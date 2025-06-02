import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { createClient } from "@/utils/supabase/component"
import { User } from "@supabase/supabase-js"

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user === null) {
          // No user, redirect to home
          router.replace("/")
        } else {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("user_id", user.id)
            .single()

          if (error) {
            console.error("Error fetching profile:", error)
            router.replace("/")
            return
          }

          const isAdmin = profile?.is_admin === true

          if (!isAdmin && router.pathname.startsWith("/admin")) {
            router.replace("/")
            return
          }
          setUser(user)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.replace("/")
      }
    }

    getUser()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.replace("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-light">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
