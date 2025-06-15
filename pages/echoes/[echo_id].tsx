// /pages/echoes/[echo_id].tsx

import { GetStaticProps, GetStaticPaths } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '@/components/Layout'
import { createClient } from '@/utils/supabase/static-props'

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
  publish_date: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const supabase = createClient()
  const now = new Date().toISOString()

  const { data: echoes, error } = await supabase
    .from('echoes')
    .select('id')
    .lte('publish_date', now)

  if (error || !echoes) return { paths: [], fallback: 'blocking' }

  const paths = echoes.map((echo) => ({
    params: { echo_id: echo.id.toString() },
  }))

  return {
    paths,
    fallback: 'blocking', // SSRs if path not prebuilt, then caches it
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const supabase = createClient()
  const echoId = context.params?.echo_id

  const { data, error } = await supabase
    .from('echoes')
    .select('*')
    .eq('id', echoId)
    .single()

  if (error || !data || new Date(data.publish_date) > new Date()) {
    return { notFound: true }
  }

  return {
    props: {
      echo: data,
    },
    revalidate: 60,
  }
}

export default function EchoPage({ echo }: { echo: Echo }) {
  return (
    <Layout title={echo.title}>
      <div className='max-w-3xl mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-4'>{echo.title}</h1>
        <p className='text-sm text-zinc-500 mb-6'>
          {new Date(echo.created_at).toLocaleDateString()}
        </p>
        <div className='prose max-w-none dark:prose-invert'>
          <ReactMarkdown>{echo.content}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  )
}
