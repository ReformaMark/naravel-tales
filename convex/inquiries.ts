import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        studentId: v.id("students"),
        subject: v.string(),
        message: v.string(),
    },

    handler: async (ctx, { studentId, subject, message }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const student = await ctx.db.get(studentId);
        if (!student) throw new Error("Student not found");

        const classInfo = await ctx.db.get(student.classId);
        if (!classInfo) throw new Error("Class not found");

        await ctx.db.insert("inquiries", {
            parentId: userId,
            teacherId: classInfo.teacherId,
            studentId,
            subject,
            message,
            status: "pending",
            createdAt: Date.now(),
        });
    },
});

export const getByTeacher = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const inquiries = await ctx.db
            .query("inquiries")
            .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
            .collect();

        const studentIds = Array.from(new Set(inquiries.map((i) => i.studentId)));
        const students = await Promise.all(studentIds.map((id) => ctx.db.get(id)));

        return inquiries.map((inquiry) => ({
            ...inquiry,

            student: students.find((s) => s?._id === inquiry.studentId),
        }));
    },
});

export const listByClass = query({
    args: { classId: v.id("classes") },
    handler: async (ctx, args) => {
        const students = await ctx.db
            .query("students")
            .withIndex("by_class", (q) => q.eq("classId", args.classId))
            .collect();

        const studentIds = students.map((student) => student._id);

        const inquiries = await ctx.db
            .query("inquiries")
            .filter((q) =>
                studentIds.length > 0
                    ? studentIds.reduce(
                        (acc, studentId) =>
                            q.or(acc, q.eq(q.field("studentId"), studentId)),

                        q.eq(q.field("studentId"), studentIds[0])
                    )
                    : q.eq(1, 0)
            )
            .order("desc")
            .collect();

        return inquiries.map((inquiry) => ({
            ...inquiry,
            student: students.find((s) => s._id === inquiry.studentId),
        }));
    },
});

export const respond = mutation({
    args: {
        inquiryId: v.id("inquiries"),
        response: v.string(),
    },
    handler: async (ctx, args) => {
        const inquiry = await ctx.db.get(args.inquiryId);
        if (!inquiry) throw new Error("Inquiry not found");

        await ctx.db.patch(args.inquiryId, {
            response: args.response,
            status: "responded",
            respondedAt: Date.now(),
        });
    },
});

export const getByStudent = query({
    args: { studentId: v.id("students") },
    handler: async (ctx, args) => {
        const inquiries = await ctx.db
            .query("inquiries")
            .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
            .order("desc")
            .collect();

        return inquiries;
    },
});
