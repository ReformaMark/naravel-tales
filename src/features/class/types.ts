import { Id } from "../../../convex/_generated/dataModel"

export interface Student {
  _id: Id<"students">
  fname: string
  lname: string
}

export interface Inquiry {
  _id: Id<"inquiries">
  subject: string
  message: string
  status: "pending" | "responded"
  createdAt: number
  respondedAt?: number
  response?: string
  student?: Student
} 