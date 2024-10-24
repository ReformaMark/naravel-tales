"use client"
import { useAtom } from 'jotai'
import { loginModalURLSyncAtom } from '../loginModal'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock user data
const mockUser = {
  email: "user@example.com",
  password: "password123"
}

export function LoginModal() {
  const [isOpen, setIsOpen] = useAtom(loginModalURLSyncAtom)
  const [isRendered, setIsRendered] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === mockUser.email && password === mockUser.password) {
      console.log("Login successful")
      setIsOpen(false)
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

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
              <Label htmlFor="password">Password</Label>
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
          <div className="text-center">
            <p className="text-sm text-gray-400">Don&apos;t have an account?</p>
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
