import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "@/components/Layout" // Reuse your layout if available
import { createClient } from "@/utils/supabase/static-props"
import { GetStaticProps } from "next"
import EchoCard from "@/components/EchoCard"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
  publish_date: string
  thumbnail_url: string | null
  pinned?: boolean
}

interface EchoesPageProps {
  echoes: Echo[]
  pinnedEcho: Echo | null
}

export default function EchoesPage({ echoes, pinnedEcho }: EchoesPageProps) {
  return (
    <Layout title='Echoes - Blog'>
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-8 text-center'>Echoes</h1>
        {echoes.length === 0 ? (
          <p className='text-center text-muted-foreground'>No echoes found.</p>
        ) : (
          <>
            {pinnedEcho && (
              <div className='space-y-5'>
                <h2 className='text-2xl font-bold mb-8 text-center'>
                  Featured Echo
                </h2>
                <EchoCard echo={pinnedEcho} />
              </div>
            )}
            <div className='space-y-5'>
              <h2 className='text-2xl font-bold mb-8 text-center mt-4'>
                All Echoes
              </h2>
              {echoes.map((echo) => (
                <EchoCard key={echo.id} echo={echo} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const supabase = createClient()
  const now = new Date().toISOString()

  const { data: echoes, error } = await supabase
    .from("echoes")
    .select("*")
    .lte("publish_date", now)
    .order("publish_date", { ascending: false })

  if (error) {
    console.error("Error fetching echoes:", error)
    return {
      props: { echoes: [], pinnedEcho: null },
      revalidate: 60,
    }
  }

  const pinnedEcho = echoes.find((e) => e.pinned) || null

  return {
    props: {
      echoes,
      pinnedEcho,
    },
    revalidate: 60, // Update at most once per minute
  }
}
