import { useState } from "react"
import { useRouter } from "next/router"
import { createClient } from "@/utils/supabase/component"
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { USERNAME_REGEX, PASSWORD_REGEX } from "@/utils/constants"
import PasswordChecker from "./PasswordChecker"

export function SignInModal({
  onClose,
  onSwitch,
}: {
  onClose: () => void
  onSwitch: () => void
}) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Function to handle sign in button click directly
  const handleSignInButtonClick = async () => {
    console.log("DIRECT: Sign In button clicked")
    alert("Sign In button clicked") // This will show a visible alert

    setLoading(true)
    setError(null)
    let emailToUse = identifier.trim()

    if (!identifier.includes("@")) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_name", identifier)
        .maybeSingle()

      if (profileError || !profile?.email) {
        throw new Error("No user found with that username.")
      }

      emailToUse = profile.email
    }

    supabase.auth
      .signInWithPassword({
        email: emailToUse,
        password,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Sign in error:", error)
          alert("Error: " + error.message)
          setError(error.message || "An error occurred during sign in")
        } else {
          console.log("Sign in successful")
          alert("Sign in successful")
          onClose()
          router.reload()
        }
      })
      .catch((error) => {
        console.error("Sign in exception:", error)
        alert("Exception: " + error.message)
        setError(error.message || "An error occurred during sign in")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Function to switch to sign up
  const handleSwitchToSignUp = () => {
    console.log("DIRECT: Switching to sign up")
    onClose()
    setTimeout(() => onSwitch(), 100)
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className='bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md auth-modal-content'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold hover-glow'>
            Sign In
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-900/50 border border-red-700   p-4 rounded-lg'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label htmlFor='identifier' className='hover-glow'>
              Username or Email
            </label>
            <Input
              id='identifier'
              type='text'
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='you@example.com or yourUsername'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='  mb-2 flex items-center hover-glow'
            >
              Password
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='ml-2 h-4 w-4 cursor-pointer  /60' />
                </TooltipTrigger>
                <TooltipContent side='right' align='start'>
                  <p className='text-xs'>
                    ≥8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special
                    char
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='••••••••'
            />
          </div>

          <div className='flex justify-between'>
            <Button
              type='button'
              disabled={loading}
              variant='ghost'
              className=''
              onClick={handleSignInButtonClick}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type='button'
              variant='link'
              onClick={handleSwitchToSignUp}
              className='text-spiritual-yellow hover-glow'
            >
              Need an account?
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SignUpModal({
  onClose,
  onSwitch,
}: {
  onClose: () => void
  onSwitch: () => void
}) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSignUpButtonClick = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    setMessage(null)

    const name = username.trim()
    if (!USERNAME_REGEX.test(name)) {
      setError(
        "Username must be 3-30 characters long and only contain letters, numbers, dots, underscores or hyphens."
      )
      setLoading(false)
      return
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError("Password must meet the specified requirements")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // 2) Check username availability
      const { data: existingUser, error: selectError } = await supabase
        .from("profiles")
        .select("user_name")
        .eq("user_name", name)
        .maybeSingle()

      if (selectError) {
        console.error("Error checking username:", selectError)
        setError("Unable to verify username availability.")
        setLoading(false)
        return
      }
      if (existingUser) {
        setError("That username is already taken. Please choose another.")
        setLoading(false)
        return
      }

      // 3) Proceed with sign-up now that username is free
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      const newUser = signUpData.user
      if (!newUser)
        throw new Error("Sign-up succeeded but no user was returned.")

      // 4) Insert profile row
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: newUser.id,
          user_name: name,
          email: email,
          is_admin: false,
        })
        .select()
        .single()
      if (profileError) throw profileError
      if (!profileRow) throw new Error("Profile insert returned no data.")

      // 5) Success
      setMessage(`Welcome aboard, ${profileRow.user_name}!`)
      setTimeout(() => {
        onClose()
        router.reload()
      }, 1500)
    } catch (err: any) {
      console.error("Sign-up/profile error:", err)
      // Handle unique‐constraint just in case
      if (
        err.code === "23505" &&
        err.message.includes("profiles_user_name_unique")
      ) {
        setError("That username is already taken. Please choose another.")
      } else {
        setError(err.message || "An error occurred during sign up")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchToSignIn = () => {
    onClose()
    setTimeout(() => onSwitch(), 100)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md auth-modal-content'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold hover-glow'>
            Create Account
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-900/50 border border-red-700   p-4 rounded-lg'>
            {error}
          </div>
        )}
        {message && (
          <div className='bg-green-900/50 border border-green-700   p-4 rounded-lg'>
            {message}
          </div>
        )}

        <div className='space-y-4'>
          {/* Username field */}
          <div>
            <label
              htmlFor='username'
              className='block   mb-2 hover-glow'
            >
              Username
            </label>
            <Input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='Pick a username'
            />
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor='email'
              className='block   mb-2 hover-glow'
            >
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='your@email.com'
            />
          </div>

          {/* Password fields */}
          <div>
            <label
              htmlFor='password'
              className='block   mb-2 hover-glow'
            >
              Password
            </label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='••••••••'
            />
          </div>
          <PasswordChecker password={password} />
          <div>
            <label
              htmlFor='confirmPassword'
              className='block   mb-2 hover-glow'
            >
              Confirm Password
            </label>
            <Input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='bg-wood-light/50 border-text-light/20 text-background'
              placeholder='••••••••'
            />
          </div>

          {/* Actions */}
          <div className='flex justify-between'>
            <Button
              type='button'
              disabled={loading}
              variant='ghost'
              onClick={handleSignUpButtonClick}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <Button
              type='button'
              variant='link'
              onClick={handleSwitchToSignIn}
              className='text-spiritual-yellow hover-glow'
            >
              Already have an account?
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
