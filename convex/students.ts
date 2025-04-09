import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";
import { Student } from "@/features/students/student-types";

const generateStudentCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
            code += letters.charAt(Math.floor(Math.random() * letters.length));
        } else {
            code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
    }

    return code
}

export const createStudent = mutation({
    args: {
        classId: v.id("classes"),
        fname: v.string(),
        lname: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) return null

        let code = generateStudentCode();
        let isUnique = false;

        while (!isUnique) {
            const existingCode = await ctx.db
                .query("studentCodes")
                .withIndex("by_code", (q) => q.eq("code", code))
                .first()

            if (!existingCode) {
                isUnique = true;
            } else {
                code = generateStudentCode();
            }
        }

        const studentId = await ctx.db.insert("students", {
            classId: args.classId,
            fname: args.fname,
            lname: args.lname,
            createdAt: Date.now(),
            studentCode: code,
        })

        await ctx.db.insert("studentCodes", {
            studentId,
            code,
            isActive: true,
            createdAt: Date.now(),
        })

        return studentId;
    }
})

export const getMyStudents = query({
    args: {
        classId: v.id("classes"),
        searchQuery: v.optional(v.string()),
        page: v.number(),
        limit: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        let studentsQuery = ctx.db.query("students")

        if (args.searchQuery && args.searchQuery.trim()) {
            const searchTerm = args.searchQuery.trim()

            // Search in fname
            const byFname = await ctx.db
                .query("students")
                .withSearchIndex("search_name", q =>
                    q.search("fname", searchTerm)
                        .eq("classId", args.classId)
                )
                .collect()

            // Search in lname
            const byLname = await ctx.db
                .query("students")
                .withSearchIndex("search_lname", q =>
                    q.search("lname", searchTerm)
                        .eq("classId", args.classId)
                )
                .collect()

            // Search in studentCode
            const byCode = await ctx.db
                .query("students")
                .withSearchIndex("search_code", q =>
                    q.search("studentCode", searchTerm)
                        .eq("classId", args.classId)
                )
                .collect()

            // Combine and deduplicate results
            const searchResults = [...byFname, ...byLname, ...byCode]
            const uniqueResults = Array.from(
                new Map(searchResults.map(s => [s._id.toString(), s])).values()
            )

            // Apply pagination to search results
            const startIndex = (args.page - 1) * args.limit
            const paginatedResults = uniqueResults.slice(startIndex, startIndex + args.limit)

            return {
                students: paginatedResults,
                totalCount: uniqueResults.length,
                totalPages: Math.ceil(uniqueResults.length / args.limit)
            }
        }

        // If no search query, return all students with pagination
        const allStudents = await studentsQuery
            .withIndex("by_class", q => q.eq("classId", args.classId))
            .order("desc")
            .collect()

        const startIndex = (args.page - 1) * args.limit
        const paginatedStudents = allStudents.slice(startIndex, startIndex + args.limit)

        return {
            students: paginatedStudents,
            totalCount: allStudents.length,
            totalPages: Math.ceil(allStudents.length / args.limit)
        }
    }
})

export const getById = query({
    args: {
        id: v.id("students"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    }
})

export const getByIds = query({
    args: { ids: v.array(v.id("students")) },
    handler: async (ctx, args) => {
        const students = await Promise.all(
            args.ids.map(id => ctx.db.get(id))
        );
        return students.filter((s): s is Student => s !== null);
    },
});

export const linkParentToStudent = mutation({
    args: {
        code: v.string()
    },
    handler: async (ctx, { code }) => {
        // 1.) Authentication Check
        const userId = await getAuthUserId(ctx)

        if (!userId) {
            throw new ConvexError("Unauthorized!")
        }

        const user = await ctx.db.get(userId)

        if (!user || user?.role !== "parent") {
            throw new ConvexError("Unauthorized")
        }

        // 2.) Validate Student Code
        const currentCode = await ctx.db
            .query("studentCodes")
            .withIndex("by_code", q => q.eq("code", code))
            .first()

        if (!currentCode) {
            throw new ConvexError("Code does not exist, please contact your child's teacher for clarification")
        }

        if (!currentCode.isActive) {
            throw new ConvexError(
                "This code is no longer active, please contact your child's teacher for a new code"
            );
        }

        if (currentCode.claimedBy || currentCode.claimedAt) {
            throw new ConvexError("Code already claimed, please contact your child's teacher for clarification")
        }

        // 3.) Get Student Record
        const student = await ctx.db.get(currentCode.studentId)

        if (!student) {
            throw new ConvexError("Student record not found")
        }

        if (student.parentId) {
            if (student.parentId === userId) {
                throw new ConvexError("You are already linked to this student");
            }

            throw new ConvexError(
                "This student is already linked to a parent. Please contact your teacher if you think this is a mistake."
            );
        }

        // 4.) Transaction (Atomic Updates)

        try {
            // Update student code status
            await ctx.db.patch(currentCode._id, {
                claimedBy: userId,
                claimedAt: Date.now(),
                isActive: false,
            });

            // Link student to parent
            await ctx.db.patch(student._id, {
                parentId: userId,
            });

            return student._id // for routing and redirecting purposes

        } catch (error) {
            throw new ConvexError(
                "Failed to link student. Please try again or contact support."
            );
        }
    }
})

export const getChildAchievements = query({
    args: {
        studentId: v.id("students")
    },
    handler: async (ctx, { studentId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const student = await ctx.db.get(studentId);
        if (!student || student.parentId !== userId) {
            throw new ConvexError("Unauthorized access");
        }

        const achievements = await ctx.db
            .query("achievements")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .order("desc")
            .collect();

        return achievements;
    }
});