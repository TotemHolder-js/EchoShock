import { useState } from "react"
import { useRouter } from "next/router"
import { createClient } from '@/utils/supabase/component'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignInModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Close modal and refresh page after successful sign in
      onClose()
      router.reload()
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold hover-glow">Sign In</DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg'>
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-text-light mb-2'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='your@email.com'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-text-light mb-2'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='••••••••'
            />
          </div>

          <div className='flex justify-between'>
            <Button type='submit' disabled={loading} variant="default" className="bg-wood-medium hover:bg-wood-light text-text-light hover-glow">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type='button'
              variant="ghost"
              onClick={() => {
                onClose()
                router.push("/auth/signup")
              }}
              className='text-spiritual-yellow hover-glow'
            >
              Need an account?
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SignUpModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Show success message
      setMessage("Registration successful! Check your email for confirmation.")

      // Close modal after a delay
      setTimeout(() => {
        onClose()
      }, 5000)
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold hover-glow">Create Account</DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg'>
            {error}
          </div>
        )}

        {message && (
          <div className='bg-green-900/50 border border-green-700 text-text-light p-4 rounded-lg'>
            {message}
          </div>
        )}

        <form onSubmit={handleSignUp} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-text-light mb-2'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='your@email.com'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-text-light mb-2'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='••••••••'
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-text-light mb-2'
            >
              Confirm Password
            </label>
            <Input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='••••••••'
            />
          </div>

          <div className='flex justify-between'>
            <Button type='submit' disabled={loading} variant="default" className="bg-wood-medium hover:bg-wood-light text-text-light hover-glow">
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Button
              type='button'
              variant="ghost"
              onClick={() => {
                onClose()
                router.push("/auth/signin")
              }}
              className='text-spiritual-yellow hover-glow'
            >
              Already have an account?
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
