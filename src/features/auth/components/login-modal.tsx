"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from 'convex/react'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRoleCheck } from '../api/use-role-check'
import { loginModalURLSyncAtom } from '../loginModal'

export function LoginModal() {
  const [isOpen, setIsOpen] = useAtom(loginModalURLSyncAtom)
  const [isRendered, setIsRendered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated } = useConvexAuth()
  const { data: roleCheck } = useRoleCheck()
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  console.log(`Role Check: `, roleCheck)

  useEffect(() => {
    if (isAuthenticated) {
      if (roleCheck === "teacher") {
        router.push('/teachers')
      } else if (roleCheck === "parent") {
        router.push('/parent')
      } else if (roleCheck === "admin") {
        router.push('/admin/overview')
      }
    }
  }, [signIn, router, isAuthenticated, roleCheck])

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
    } else {
      const timer = setTimeout(() => setIsRendered(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await signIn("password", {
      email,
      password,
      flow: "signIn"
    })
      .then(() => {
        setIsOpen(false)
      })
      .catch(() => {
        setError("Invalid email or password")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // const handleGoogleLogin = () => {
  //   signIn("google").then(() => {
  //     setIsOpen(false)
  //   }).catch((error) => {
  //     setError("Failed to sign in with Google")
  //     console.error(error)
  //   }).finally(() => {
  //     setIsLoading(false)
  //   })
  // }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    router.push(href)
  }

  const handleCreateAccount = () => {
    setIsOpen(false)
    router.push('/auth')
  }

  if (!isRendered) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="data-[state=open]:duration-500 h-screen w-screen max-w-none m-0 p-16 md:p-8 xl:p-0 rounded-none bg-[#2a2a2a] border-none text-white flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-md space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-blue-400 p-0 h-auto font-normal"
                  href="/auth/reset-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#2a2a2a] px-2 text-gray-400">No account?</span>
            </div>
          </div>
          {/* <Button onClick={handleGoogleLogin} variant="outline" className="w-full bg-white text-black hover:bg-gray-100">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button> */}
          <div className="text-center">
            {/* <p className="text-sm text-gray-400">Don&apos;t have an account?</p> */}
            <Button variant="link" className="text-blue-400" onClick={handleCreateAccount}>
              Create Account
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing in to Naravel Tales, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:underline" onClick={(e) => handleLinkClick(e, '/terms')}>Terms</Link> and{' '}
            <Link href="/privacy" className="text-blue-400 hover:underline" onClick={(e) => handleLinkClick(e, '/privacy')}>Privacy Policy</Link>.
            <br />
            <br />
            We value your privacy and security. Our login process is protected by industry-standard encryption and authentication measures. For more information, please review our{' '}
            <Link href="/security" className="text-blue-400 hover:underline" onClick={(e) => handleLinkClick(e, '/security')}>Security Practices</Link> and{' '}
            <Link href="/data-protection" className="text-blue-400 hover:underline" onClick={(e) => handleLinkClick(e, '/data-protection')}>Data Protection Policy</Link>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
