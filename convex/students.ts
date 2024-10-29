import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const claimStudentCode = mutation({
    args: {
        code: v.string(),
        parentId: v.id("users"),
    },
    async handler(ctx, args) {
        const userId = await getAuthUserId(ctx)

        if (!userId) return null

        const studentCode = await ctx.db
            .query("studentCodes")
            .withIndex("by_code", (q) => q.eq("code", args.code))
            .first()

        if (!studentCode || !studentCode.isActive) {
            throw new ConvexError("Invalid or inactive student code")
        }

        if (studentCode.claimedBy) {
            throw new ConvexError("Student code already claimed")
        }

        // if walang error then update the student code
        await ctx.db.patch(studentCode._id, {
            claimedBy: args.parentId,
            claimedAt: Date.now(),
            isActive: false,
        })

        await ctx.db.patch(studentCode.studentId, {
            parentId: args.parentId,
        })

        return studentCode.studentId;
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