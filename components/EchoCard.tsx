import Link from "next/link"

interface Echo {
  id: number
  title: string
  excerpt: string
  content: string
  created_at: string
  publish_date: string
  thumbnail_url: string | null
}

interface EchoCardProps {
  echo: Echo
}

export default function EchoCard({ echo }: EchoCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-md transition-transform transform bg-wood-light dark:bg-zinc-900 hover:scale-[1.02]">
      {echo.thumbnail_url && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-cover bg-center"
          style={{
            backgroundImage: `url(${echo.thumbnail_url})`,
          }}
        />
      )}

      <div className="relative p-6 z-10">
        <h3 className="text-xl font-semibold mb-2 hover-glow">{echo.title}</h3>
        <p className="text-muted-foreground mb-2">{echo.excerpt}</p>
        <p className="text-sm text-zinc-500 mb-4">
          {new Date(echo.publish_date).toLocaleDateString()}
        </p>
        <Link
          href={`/echoes/${echo.id}`}
          className="text-accent hover:underline font-semibold"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}
