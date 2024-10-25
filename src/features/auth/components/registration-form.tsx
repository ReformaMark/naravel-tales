import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@/types/onboarding"
import { FormData } from "@/types/onboarding"
import { FcGoogle } from 'react-icons/fc'

interface RegistrationFormProps {
    role: UserRole
    formData: FormData
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onGoogleSignIn: () => void
}

export function RegistrationForm({
    role,
    formData,
    onSubmit,
    onChange,
    onGoogleSignIn
}: RegistrationFormProps) {
    return (
        <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold mb-4">
                {role === 'teacher' ? 'Teacher' : 'Parent'} Registration
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                    />
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
                    />
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
                    />
                </div>
                {role === 'parent' && (
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
                )}
                <Button type="submit" className="w-full">Register</Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button onClick={onGoogleSignIn} variant="outline" className="w-full">
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign up with Google
            </Button>
        </div>
    )
}