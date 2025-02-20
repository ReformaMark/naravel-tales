'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"

export function ResetPassword() {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState<"email" | "verify" | "success">("email")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const { signIn } = useAuthActions()

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError("")

    try {
      await signIn("password", {
        email,
        flow: "reset"
      })
      setStep("verify")
    } catch (error) {
      console.error(error)
      setError("Failed to send reset code. Please try again.")
    } finally {
      setPending(false)
    }
  }

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setPending(true)
    setError("")

    try {
      await signIn("password", {
        email,
        code: verificationCode,
        newPassword,
        flow: "reset-verification"
      })
      setStep("success")
    } catch (error) {
      console.error(error)
      setError("Invalid verification code or password. Please try again.")
    } finally {
      setPending(false)
    }
  }

  if (step === "success") {
    return (
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Password Reset Successful</h1>
        <p className="text-center text-muted-foreground">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <Button
          className="w-full"
          onClick={() => window.location.href = '/auth'}
        >
          Return to Login
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      {step === "email" ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyReset} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  )
}