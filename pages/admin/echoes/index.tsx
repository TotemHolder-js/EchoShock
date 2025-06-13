// pages/admin/echoes/index.tsx
import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"
import { createClient } from "@/utils/supabase/server-props"
import { createClient as createBrowserClient } from "@/utils/supabase/component"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import AuthGuard from "@/components/AuthGuard"

interface Echo {
  id: string
  title: string
  excerpt: string
  created_at: string
}

interface ManageEchoesProps {
  echoes: Echo[]
  pinned: Echo | null
}

export default function ManageEchoes({ echoes, pinned }: ManageEchoesProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this echo?")) return
    await fetch("/api/echoes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    router.replace(router.asPath)
  }

  const handleUnpin = async (id: string) => {
    const supabase = createBrowserClient()
    const { error: error } = await supabase
      .from("echoes")
      .update({ pinned: false })
      .eq("id", id)

    if (error) {
      console.error("Failed to unpin:", error)
      alert("Could not unpin echo.")
      return
    }
    router.replace(router.asPath)
  }

  const handlePin = async (id: string) => {
    const supabase = createBrowserClient()
    const { error: error } = await supabase
      .from("echoes")
      .update({ pinned: true })
      .eq("id", id)

    if (error) {
      console.error("Failed to unpin:", error)
      alert("Could not unpin echo.")
      return
    }
    router.replace(router.asPath)
  }

  return (
    <AuthGuard>
      <Layout title='Manage Echoes - EchoShock Admin'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold hover-glow'>Manage Echoes</h1>
            <Link href='/admin/echoes/new' className='btn'>
              Write New Echo
            </Link>
          </div>
          {pinned && (
            <div className='bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm'>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='font-bold text-[#FFF8F0]/70'>
                    {pinned.title}
                  </h3>
                  <p className='text-sm text-[#FFF8F0]/50'>
                    {pinned.excerpt.substring(0, 100)}…
                  </p>
                  <p className='text-xs text-[#FFF8F0]/30 mt-1'>
                    Created: {new Date(pinned.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button onClick={() => handleUnpin(pinned.id)}>Unpin</Button>
                </div>
              </div>
            </div>
          )}

          <div className='bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm mt-4'>
            {echoes.length === 0 ? (
              <p className=' '>No echoes found. Write your first one!</p>
            ) : (
              <ul className='space-y-4'>
                {echoes.map((e) => (
                  <li
                    key={e.id}
                    className='border-b border-[#FFF8F0]/10 pb-4 last:border-0 last:pb-0'
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <h3 className='font-bold text-[#FFF8F0]/70'>
                          {e.title}
                        </h3>
                        <p className='text-sm text-[#FFF8F0]/50'>
                          {e.excerpt.substring(0, 100)}…
                        </p>
                        <p className='text-xs text-[#FFF8F0]/30 mt-1'>
                          Created: {new Date(e.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='flex gap-2 justify-between items-center'>
                        <Button onClick={() => handleDelete(e.id)}>
                          Delete
                        </Button>
                        {!pinned && (
                          <Button
                            variant='secondary'
                            onClick={() => handlePin(e.id)}
                          >
                            Pin
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}

export const getServerSideProps: GetServerSideProps<ManageEchoesProps> = async (
  ctx
) => {
  const supabase = createClient(ctx)
  const { data: echoes, error } = await supabase
    .from("echoes")
    .select("id, title, excerpt, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching echoes:", error)
    return { props: { echoes: [], pinned: null } }
  }

  const { data: pinnedEcho } = await supabase
    .from("echoes")
    .select("id, title, excerpt, created_at")
    .eq("pinned", true)
    .maybeSingle()

  return { props: { echoes: echoes ?? [], pinned: pinnedEcho } }
}
