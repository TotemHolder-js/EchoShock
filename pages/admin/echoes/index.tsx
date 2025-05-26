// pages/admin/echoes/index.tsx
import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"
import { createClient } from "@/utils/supabase/server-props"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

interface Echo {
  id: string
  title: string
  excerpt: string
  created_at: string
}

interface ManageEchoesProps {
  echoes: Echo[]
}

export default function ManageEchoes({ echoes }: ManageEchoesProps) {
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

  return (
    <Layout title="Manage Echoes - EchoShock Admin">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold hover-glow">Manage Echoes</h1>
          <Link href="/admin/echoes/new" className="btn">
            Write New Echo
          </Link>
        </div>

        <div className="bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm">
          {echoes.length === 0 ? (
            <p className="text-text-light">
              No echoes found. Write your first one!
            </p>
          ) : (
            <ul className="space-y-4">
              {echoes.map((e) => (
                <li
                  key={e.id}
                  className="border-b border-[#FFF8F0]/10 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#FFF8F0]/70">{e.title}</h3>
                      <p className="text-sm text-[#FFF8F0]/50">
                        {e.excerpt.substring(0, 100)}…
                      </p>
                      <p className="text-xs text-[#FFF8F0]/30 mt-1">
                        Created: {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleDelete(e.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<ManageEchoesProps> = async (ctx) => {
  const supabase = createClient(ctx)
  const { data: echoes, error } = await supabase
    .from("echoes")
    .select("id, title, excerpt, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching echoes:", error)
    return { props: { echoes: [] } }
  }

  return { props: { echoes: echoes ?? [] } }
}
