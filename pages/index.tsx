<<<<<<< HEAD
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

export default function Home({ games }: HomeProps) {
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
=======
import { GetStaticProps } from 'next';
import { supabase } from '../lib/supabaseClient';

type Game = {
  id: number;
  title: string;
  description: string;
  game_url: string;
  image_url: string;
  created_at: string;
};

interface HomeProps {
  games: Game[];
}

export default function Home({ games }: { games: Game[] }) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Featured Games</h1>
      {games.length === 0 ? (
        <p>No games yet — go add some in the admin dashboard!</p>
      ) : (
        <ul className="space-y-4">
          {games.map((g) => (
            <li key={g.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{g.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(g.created_at).toLocaleString()}
              </p>
              <p className="mt-2">{g.description}</p>
              <a
                href={g.game_url}
                className="text-blue-500 underline mt-2 block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Play now →
              </a>
              <img
                src={g.image_url}
                alt={g.title}
                className="mt-2 w-full max-w-sm rounded"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data: games, error } = await supabase
    .from('featured_games')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Supabase error:', error);

  return {
    props: { games: games ?? [] },
    revalidate: 60, // regenerate every minute
  };
};
>>>>>>> e5065aeb381b6f0ea917433b9891e6d8611fd14c
