import { GetStaticProps } from "next"
import Layout from "@/components/Layout"
import GameCard from "@/components/GameCard"
import { createClient } from "@/utils/supabase/static-props"
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
interface Game {
  id: number
  title: string
  description: string
  game_url: string
  image_url: string
  created_at: string
}

interface HomeProps {
  games: Game[]
  latestEcho: Echo | null
}

export default function Home({ games, latestEcho }: HomeProps) {
  return (
    <Layout title="EchoShock - Level the Playing Field">
      {/* --- Latest Echo Section --- */}
      {latestEcho && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 hover-glow">Latest Echo</h2>
          <EchoCard echo={latestEcho} />
        </section>
      )}

      {/* --- The Glade --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 hover-glow">The Glade</h2>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-lg py-12 italic">
            Nothing to see here... yet.
          </div>
        )}
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const supabase = createClient()
  const now = new Date().toISOString()

  // Get current Glade games
  const { data: games, error: gamesError } = await supabase
    .from("featured_games")
    .select("*")
    .lt("glade_entry", now)
    .gt("glade_exit", now)
    .order("created_at", { ascending: false })

  // Get latest published Echo
  const { data: echo, error: echoError } = await supabase
    .from("echoes")
    .select("*")
    .lte("publish_date", now)
    .order("publish_date", { ascending: false })
    .limit(1)
    .single()

  if (gamesError || echoError) {
    console.error("Error fetching home data:", gamesError || echoError)
    return {
      props: {
        games: [],
        latestEcho: null,
      },
      revalidate: 60,
    }
  }

  return {
    props: {
      games: games || [],
      latestEcho: echo || null,
    },
    revalidate: 60,
  }
}
