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

export function SignInModal({
  onClose,
  onSwitch,
}: {
  onClose: () => void
  onSwitch: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('%c AUTH: Sign in form submitted', 'background: #222; color: #bada55; font-size: 14px')
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Sign in successful')
      // Close modal and refresh page after successful sign in
      onClose()
      router.reload()
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message || "An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  // Function to handle sign in button click directly
  const handleSignInButtonClick = () => {
    console.log('DIRECT: Sign In button clicked');
    alert('Sign In button clicked'); // This will show a visible alert
    
    setLoading(true);
    setError(null);

    supabase.auth.signInWithPassword({
      email,
      password,
    })
    .then(({ error }) => {
      if (error) {
        console.error('Sign in error:', error);
        alert('Error: ' + error.message);
        setError(error.message || "An error occurred during sign in");
      } else {
        console.log('Sign in successful');
        alert('Sign in successful');
        onClose();
        router.reload();
      }
    })
    .catch(error => {
      console.error('Sign in exception:', error);
      alert('Exception: ' + error.message);
      setError(error.message || "An error occurred during sign in");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Function to switch to sign up
  const handleSwitchToSignUp = () => {
    console.log('DIRECT: Switching to sign up');
    alert('Switching to sign up');
    onClose();
    setTimeout(() => onSwitch(), 100);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className='bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md auth-modal-content'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold hover-glow'>
            Sign In
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-text-light mb-2'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='••••••••'
            />
          </div>

          <div className='flex justify-between'>
            <Button
              type='button'
              disabled={loading}
              variant='default'
              className='bg-wood-medium hover:bg-wood-light text-text-light hover-glow'
              onClick={handleSignInButtonClick}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type='button'
              variant='ghost'
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
    console.log('%c AUTH: Signing up form submitted', 'background: #222; color: #bada55; font-size: 14px')
    setLoading(true)
    setError(null)
    setMessage(null)

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Passwords do not match')
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      console.log('Attempting to sign up with:', email)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      console.log('Sign up successful')
      // Show success message
      setMessage("Registration successful! Check your email for confirmation.")

      // Close modal after a delay
      setTimeout(() => {
        onClose()
      }, 5000)
    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error.message || "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  // Function to handle sign up button click directly
  const handleSignUpButtonClick = () => {
    console.log('DIRECT: Sign Up button clicked');
    alert('Sign Up button clicked'); // This will show a visible alert
    
    setLoading(true);
    setError(null);
    setMessage(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      alert('Passwords do not match');
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    supabase.auth.signUp({
      email,
      password,
    })
    .then(({ error }) => {
      if (error) {
        console.error('Sign up error:', error);
        alert('Error: ' + error.message);
        setError(error.message || "An error occurred during sign up");
      } else {
        console.log('Sign up successful');
        alert('Registration successful! Check your email for confirmation.');
        setMessage("Registration successful! Check your email for confirmation.");
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
        }, 5000);
      }
    })
    .catch(error => {
      console.error('Sign up exception:', error);
      alert('Exception: ' + error.message);
      setError(error.message || "An error occurred during sign up");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Function to switch to sign in
  const handleSwitchToSignIn = () => {
    console.log('DIRECT: Switching to sign in');
    alert('Switching to sign in');
    onClose();
    setTimeout(() => onSwitch(), 100);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className='bg-wood-dark/95 border-b border-[#FFF8F0]/20 backdrop-blur-md auth-modal-content'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold hover-glow'>
            Create Account
          </DialogTitle>
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

        <div className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-text-light mb-2'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className='bg-wood-light/50 border-text-light/20 text-text-light'
              placeholder='••••••••'
            />
          </div>

          <div className='flex justify-between'>
            <Button
              type='button'
              disabled={loading}
              variant='default'
              className='bg-wood-medium hover:bg-wood-light text-text-light hover-glow'
              onClick={handleSignUpButtonClick}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Button
              type='button'
              variant='ghost'
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
