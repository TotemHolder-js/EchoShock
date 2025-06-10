import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "@/components/Layout" // Reuse your layout if available
import { createClient } from "@/utils/supabase/component"
import EchoCard from "@/components/EchoCard"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
  publish_date: string
  thumbnail_url: string | null
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
        .lte("publish_date", new Date().toISOString()) // ✅ Only published
        .order("publish_date", { ascending: false })

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
              <EchoCard key={echo.id} echo={echo} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
