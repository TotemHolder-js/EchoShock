import Link from "next/link"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
  publish_date: string
}

interface EchoCardProps {
  echo: Echo
}

export default function EchoCard({ echo }: EchoCardProps) {
  return (
    <Link key={echo.id} href={`/echoes/${echo.id}`} className="block">
      <article className="bg-wood-light dark:bg-zinc-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <h2 className="text-2xl font-semibold mb-2">{echo.title}</h2>
        <p className="text-sm text-zinc-500 mb-2">
          {new Date(echo.created_at).toLocaleDateString()}
        </p>
        <p className="text-muted-foreground line-clamp-3">{echo.excerpt}</p>
      </article>
    </Link>
  )
}
