import { ReactNode, useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { createClient } from "@/utils/supabase/component"
import { SignInModal, SignUpModal } from "./AuthModals"
import { Button } from "@/components/ui/button"
import Logo from "@/public/icons/logo.svg"
import { User } from "@supabase/supabase-js"
import { Press_Start_2P } from "next/font/google"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const pressStart2P = Press_Start_2P({
  weight: "400", // Only one weight is available
  subsets: ["latin"],
  display: "swap",
})

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = "EchoShock" }: LayoutProps) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState<{
    is_admin: boolean
    user_name: string
  } | null>(null)

  // Get the current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    supabase
      .from("profiles")
      .select("is_admin, user_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error("Profile fetch error:", error)
        else setProfile(data)
      })
  }, [user])

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (showSignIn || showSignUp) {
        // Check if click is outside modal content
        if (!target.closest(".auth-modal-content")) {
          setShowSignIn(false)
          setShowSignUp(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSignIn, showSignUp])

  // Close modals when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSignIn(false)
        setShowSignUp(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [])

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("LAYOUT: Sign In button clicked")
    setShowSignUp(false)
    setShowSignIn(true)
  }

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("LAYOUT: Sign Up button clicked")
    setShowSignIn(false)
    setShowSignUp(true)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="EchoShock - Level the Playing Field"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Cursor light removed and replaced with hover-glow */}
      <div className="content-wrapper">
        {/* Sign In Modal */}
        {showSignIn && (
          <SignInModal
            onClose={() => {
              console.log("Closing sign in modal")
              setShowSignIn(false)
            }}
            onSwitch={() => {
              console.log("Switching to sign up modal")
              setShowSignIn(false)
              setTimeout(() => setShowSignUp(true), 100)
            }}
          />
        )}

        {/* Sign Up Modal */}
        {showSignUp && (
          <SignUpModal
            onClose={() => {
              console.log("Closing sign up modal")
              setShowSignUp(false)
            }}
            onSwitch={() => {
              console.log("Switching to sign in modal")
              setShowSignUp(false)
              setTimeout(() => setShowSignIn(true), 100)
            }}
          />
        )}

        <header className="p-4 bg-[#1C0F0A]/90 text-text-light flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Logo
                className="w-16 h-16 text-indigo-600 hover:text-indigo-400 transition-colors"
                aria-label="EchoShock logo"
              />
            </Link>
            <div className={`${pressStart2P.className}`}>
              <h1 className="text-xl font-bold hover-glow">EchoShock</h1>
              <p className="text-sm text-[#FFF8F0]/50 hover-glow">
                Level the Playing Field
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-text-light hover-glow text-2xl">
              Home
            </Link>
            <Link href="/games" className="text-text-light hover-glow text-2xl">
              Games
            </Link>
            <Link
              href="/echoes"
              className="text-text-light hover-glow text-2xl"
            >
              Echoes
            </Link>
            <Link href="/about" className="text-text-light hover-glow text-2xl">
              About
            </Link>
            <Link href="/help-center" className="text-text-light hover-glow text-2xl">
              Help Center
            </Link>

            {!user ? (
              <>
                <Button
                  onClick={handleSignUpClick}
                  variant="outline"
                  className="bg-transparent border-[#FFF8F0]/30 text-text-light hover:bg-[#FFF8F0]/10 hover-glow text-2xl"
                >
                  Sign Up
                </Button>
                <Button
                  onClick={handleSignInClick}
                  className="bg-yellow-900 border border-[#FFF8F0]/30 text-text-light hover:bg-[#FFF8F0]/10 hover-glow text-2xl"
                >
                  Log In
                </Button>
              </>
            ) : (
              <>
                {profile?.is_admin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-text-light hover-glow text-2xl">
                        Admin ▼
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link href="/admin/games">Admin Games</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/echoes">Admin Echoes</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="p-1 rounded-full hover:bg-[#FFF8F0]/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-transparent text-text-light">
                        {profile?.user_name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#1E1E1E] rounded-lg shadow-lg p-4">
                      <div className="pb-2 border-b border-[#FFF8F0]/30 text-text-light">
                        {profile?.user_name ?? "Unknown User"}
                      </div>
                      <button
                        onClick={() => supabase.auth.signOut()}
                        className="mt-2 w-full text-left text-text-light hover:text-white"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </header>

        <main className="p-8 flex-grow">{children}</main>

        <footer className="bg-[#1C0F0A]/90 text-text-light p-8 backdrop-blur-sm">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="hover-glow">
                &copy; {new Date().getFullYear()} EchoShock&trade;. All rights
                reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <p className="hover-glow">Follow our socials &#10140;</p>
              <a
                href="https://www.instagram.com/playechoshock/"
                target="_blank"
                className="text-text-light hover-glow"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@playechoshock"
                target="_blank"
                className="text-text-light hover-glow"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
