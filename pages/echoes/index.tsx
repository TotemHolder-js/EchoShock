import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "@/components/Layout" // Reuse your layout if available
import { createClient } from "@/utils/supabase/component"
import Link from "next/link"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
}

export default function EchoesPage() {
  const [echoes, setEchoes] = useState<Echo[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchEchoes = async () => {
      const { data, error } = await supabase
        .from("echoes")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) setEchoes(data)
      setLoading(false)
    }

    fetchEchoes()
  }, [])

  return (
    <Layout title="Echoes - Blog">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Echoes</h1>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : echoes.length === 0 ? (
          <p className="text-center text-muted-foreground">No echoes found.</p>
        ) : (
          <div className="space-y-5">
            {echoes.map((echo) => (
              <Link key={echo.id} href={`/echoes/${echo.id}`} className='block'>
                <article className="bg-wood-light dark:bg-zinc-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <h2 className="text-2xl font-semibold mb-2">{echo.title}</h2>
                  <p className="text-sm text-zinc-500 mb-2">
                    {new Date(echo.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground line-clamp-3">
                    {echo.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
