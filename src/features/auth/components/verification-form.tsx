import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VerificationFormProps {
    email: string
    verificationCode: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => Promise<void>
    pending: boolean
    error?: string
}

export function VerificationForm({
    email,
    verificationCode,
    onChange,
    onSubmit,
    pending,
    error
}: VerificationFormProps) {
    return (
        <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-muted-foreground">
                    We sent a verification code to {email}
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        name="verificationCode"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={onChange}
                        disabled={pending}
                    />
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={pending}
                >
                    {pending ? "Verifying..." : "Verify Email"}
                </Button>
            </form>
        </div>
    )
}