import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormData, UserRole } from "@/types/onboarding"
import { ValidationErrors } from "./onboarding-flow"

interface RegistrationFormProps {
    role: UserRole;
    formData: FormData;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGoogleSignIn: () => void;
    errors: ValidationErrors;
    pending: boolean;
}

export function RegistrationForm({
    role,
    formData,
    onSubmit,
    onChange,
    errors,
    pending,
}: RegistrationFormProps) {
    return (
        <div className="w-full max-w-md space-y-6 px-4">
            <h2 className="text-2xl font-bold mb-4">
                {role === 'teacher' ? 'Teacher' : 'Parent'} Registration
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                        id="fname"
                        name="fname"
                        value={formData.fname}
                        onChange={onChange}
                        required
                        disabled={pending}
                        className={errors.fname ? "border-destructive" : ""}
                    />
                    {errors.fname && (
                        <p className="text-sm text-destructive mt-1">{errors.fname}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                        id="lname"
                        name="lname"
                        value={formData.lname}
                        onChange={onChange}
                        required
                        disabled={pending}
                        className={errors.lname ? "border-destructive" : ""}
                    />
                    {errors.lname && (
                        <p className="text-sm text-destructive mt-1">{errors.lname}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        disabled={pending}
                        className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={onChange}
                        required
                        disabled={pending}
                        className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive mt-1">{errors.password}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={onChange}
                        required
                        disabled={pending}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                    )}
                </div>
                {/* {role === 'parent' && (
                    <div>
                        <Label htmlFor="inviteCode">Invite Code</Label>
                        <Input
                            id="inviteCode"
                            name="inviteCode"
                            value={formData.inviteCode}
                            onChange={onChange}
                            required
                        />
                    </div>
                )} */}
                <div className="flex items-start space-x-2">
                    <Input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        required
                        disabled={pending}
                        className=" h-4 w-4"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline" target="_blank">
                            Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                        </a>
                    </Label>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={pending}
                >
                    {pending ? 'Signing up...' : 'Register'}
                </Button>
            </form>
            {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div> */}
            {/* <Button onClick={onGoogleSignIn} variant="outline" className="w-full">
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign up with Google
            </Button> */}
        </div>
    )
}
