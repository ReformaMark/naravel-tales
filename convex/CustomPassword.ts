import { ResendOTP } from "@/features/auth/resendOTP";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { z } from "zod";
import { DataModel } from "./_generated/dataModel";
import { ResendOTPPasswordReset } from "./resendOTP";

const ParamsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fname: z.string().min(1),
    lname: z.string().min(1),
    role: z.enum(["teacher", "admin", "parent"]),
});

export default Password<DataModel>({
    // @ts-expect-error - profile is not defined in the type
    profile(params) {
        switch (params.flow) {
            case "signIn":
                // For sign in, we only need to validate email and password
                if (!params.email || !params.password) {
                    throw new ConvexError({
                        message: "Invalid credentials",
                        validationErrors: {
                            email: !params.email ? { _errors: ["Required"] } : undefined,
                            password: !params.password ? { _errors: ["Required"] } : undefined,
                        }
                    });
                }
                return {
                    email: params.email,
                    isVerified: true, // User is already verified if they can sign in
                };

            case "email-verification":
                if (!params.email || !params.code) {
                    throw new ConvexError({
                        message: "Invalid verification data",
                        validationErrors: {
                            email: !params.email ? { _errors: ["Required"] } : undefined,
                            code: !params.code ? { _errors: ["Required"] } : undefined,
                        }
                    });
                }
                return {
                    email: params.email,
                    isVerified: false,
                };

            case "reset":
                // Only validate email for initial reset request
                if (!params.email) {
                    throw new ConvexError({
                        message: "Email is required",
                        validationErrors: { email: { _errors: ["Required"] } }
                    });
                }
                return { email: params.email };

            case "reset-verification":
                // For password reset verification, we need email, code, and new password
                if (!params.email || !params.code || !params.newPassword) {
                    throw new ConvexError({
                        message: "Invalid reset verification data",
                        validationErrors: {
                            email: !params.email ? { _errors: ["Required"] } : undefined,
                            code: !params.code ? { _errors: ["Required"] } : undefined,
                            newPassword: !params.newPassword ? { _errors: ["Required"] } : undefined,
                        }
                    });
                }
                // For reset verification, we need to return a profile
                return {
                    email: params.email,
                    isVerified: true,
                    // Add minimal required profile data
                    name: "User",
                    lastName: "Reset",
                    role: "user",
                    address: "Reset Address",
                    barangay: "Reset Barangay",
                    municipality: "Reset Municipality",
                    province: "Reset Province",
                };

            case "signUp":
                // For sign up, validate all required fields
                const result = ParamsSchema.safeParse({
                    email: params.email,
                    password: params.password,
                    fname: params.fname,
                    lname: params.lname,
                    role: params.role,
                });

                if (!result.success) {
                    throw new ConvexError({
                        message: "Invalid profile data",
                        validationErrors: result.error.format()
                    });
                }

                return {
                    email: result.data.email,
                    fname: result.data.fname,
                    lname: result.data.lname,
                    role: result.data.role,
                    isVerified: false,
                };

            default:
                throw new ConvexError({
                    message: "Invalid flow",
                    validationErrors: {
                        flow: { _errors: ["Invalid flow type"] }
                    }
                });
        }
    },
    validatePasswordRequirements: (password: string) => {
        if (password?.length < 6) {
            throw new ConvexError("Password must be at least 6 characters long");
        }
    },
    verify: ResendOTP,
    reset: ResendOTPPasswordReset,
});