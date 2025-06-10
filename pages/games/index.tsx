import { GetStaticProps } from "next"
import Layout from "@/components/Layout"
import GameCard from "@/components/GameCard"
import { createClient } from "@/utils/supabase/static-props"

interface Game {
  id: number
  title: string
  description: string
  game_url: string
  image_url: string
  created_at: string
}

interface HomeProps {
  currentGames: Game[]
  previousGames: Game[]
}

export default function GamesPage({ currentGames, previousGames }: HomeProps) {
  return (
    <Layout title='EchoShock - Level the Playing Field'>
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 hover-glow'>The Glade</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {previousGames.length > 0 && (
        <section>
          <h2 className='text-2xl font-bold mb-6 hover-glow'>Previously Featured</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {previousGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const supabase = createClient()
  const now = new Date().toISOString()

  const { data: allGames, error } = await supabase
    .from("featured_games")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured games:", error)
    return {
      props: {
        currentGames: [],
        previousGames: [],
      },
      revalidate: 60,
    }
  }

  const currentGames = allGames.filter(
    (game) => game.glade_entry < now && game.glade_exit > now
  )

  const previousGames = allGames.filter(
    (game) => game.glade_exit <= now
  )

  return {
    props: {
      currentGames,
      previousGames,
    },
    revalidate: 60,
  }
}
