// src/components/onboarding/RegistrationForm.tsx

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@/types/onboarding"
import { FormData } from "@/types/onboarding"

interface RegistrationFormProps {
    role: UserRole
    formData: FormData
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function RegistrationForm({
    role,
    formData,
    onSubmit,
    onChange
}: RegistrationFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
                {role === 'teacher' ? 'Teacher' : 'Parent'} Registration
            </h2>
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
    )
}