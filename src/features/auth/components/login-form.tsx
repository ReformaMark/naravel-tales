import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormData } from "@/types/onboarding"

interface LoginFormProps {
    formData: FormData
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function LoginForm({ formData, onSubmit, onChange }: LoginFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
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
            <Button type="submit" className="w-full">Login</Button>
        </form>
    )
}