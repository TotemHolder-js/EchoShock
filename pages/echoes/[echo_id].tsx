// /pages/echoes/[echo_id].tsx

import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "@/components/Layout"
import { createClient } from "@/utils/supabase/server-props"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createClient(context)
  const echoId = context.params?.echo_id

  const { data, error } = await supabase
    .from("echoes")
    .select("*")
    .eq("id", echoId)
    .single()

  if (error || !data) {
    return { notFound: true }
  }

  return {
    props: {
      echo: data,
    },
  }
}

export default function EchoPage({ echo }: { echo: Echo }) {
  return (
    <Layout title={echo.title}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{echo.title}</h1>
        <p className="text-sm text-zinc-500 mb-6">
          {new Date(echo.created_at).toLocaleDateString()}
        </p>
        <div className="prose max-w-none  dark:prose-invert">
          <ReactMarkdown>
            {echo.content}
          </ReactMarkdown>
        </div>
      </div>
    </Layout>
  )
}
