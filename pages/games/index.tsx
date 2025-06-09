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
  games: Game[]
}

export default function GamesPage({ games }: HomeProps) {
  return (
    <Layout title='EchoShock - Level the Playing Field'>
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 hover-glow'>The Glade</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const supabase = createClient()
  const { data: games, error } = await supabase
    .from("featured_games")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured games:", error)
    return {
      props: {
        games: [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  }

  return {
    props: {
      games: games || [],
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
