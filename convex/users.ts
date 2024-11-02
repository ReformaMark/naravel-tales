import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { asyncMap } from "convex-helpers";

export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) return null

        const user = await ctx.db.get(userId)

        if (!user) return null

        return {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            avatar: user.image,
            onboarding: user.onboarding,
        }
    }
})

export const role = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        return user.role;
    },
});

export const checkEmailExists = query({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), email))
            .first();

        return !!existingUser;
    }
});

export const getAllUsers = query({
    handler: async(ctx) => {
        return (await ctx.db.query('users').collect())
    }
})

export const getActiveUsers = query({
    handler: async (ctx) => {
        const users = await ctx.db.query('users').collect();

        const activeUsers = await asyncMap(users, async(user) => {
            // Get the current date
            const currentDate = new Date();
            
            // Calculate the date one month ago
            const lastMonthDate = new Date(currentDate);
            lastMonthDate.setMonth(currentDate.getMonth() - 1);
            
            // Convert lastMonthDate to a timestamp for querying
            const lastMonthTimestamp = lastMonthDate.getTime(); // Optional: if your DB uses timestamps

            // Query for active users with creation time within the last month
            const authSessions = await ctx.db
                .query('authSessions')
                .order('desc')
                .collect(); // Ensure to call find() or similar method to execute the query
            const getUser = authSessions.find(session => session.userId === user._id && session._creationTime > lastMonthTimestamp)
            
            if(getUser) {
                return getUser
            } else {
                return null
            }
        })

        return activeUsers
    }
})

export const getNumberOfRoles = query({
    handler: async(ctx) => {
        const users = await ctx.db.query('users').collect()
        const usersCounts = {
            admin: 0,
            teacher: 0,
            parent: 0
        };

        users.forEach(user => {
            usersCounts[user.role as keyof typeof usersCounts]++
        })

        const totalUserCount = usersCounts.admin + usersCounts.parent + usersCounts.teacher;

        return [
            {
                userRole: "Admin",
                value: usersCounts.admin,
                percentage: (usersCounts.admin / totalUserCount) * 100,
                fill: "#FFDB00"
            },
            {
                userRole: "Teacher",
                value: usersCounts.teacher,
                percentage: (usersCounts.teacher / totalUserCount) * 100,
                fill: "#FF8F00"
            },
            {
                userRole: "Parent",
                value: usersCounts.parent,
                percentage: (usersCounts.parent / totalUserCount) * 100,
                fill: "#26355D"
            }
        ]
    }
})

export const getTeacherByStudentId = query({
    args: { studentId: v.string() },
    handler: async (ctx, args) => {
        // First get the student to find their class
        const student = await ctx.db
            .query("students")
            .filter((q) => q.eq(q.field("_id"), args.studentId))
            .first();

        if (!student) return null;

        // Get the class to find the teacher ID
        const class_ = await ctx.db
            .query("classes")
            .filter((q) => q.eq(q.field("_id"), student.classId))
            .first();

        if (!class_) return null;

        // Get the teacher from users table
        const teacher = await ctx.db
            .query("users")
            .filter((q) => 
                q.and(
                    q.eq(q.field("_id"), class_.teacherId),
                    q.eq(q.field("role"), "teacher")
                )
            )
            .first();

        return teacher;
    },
});
