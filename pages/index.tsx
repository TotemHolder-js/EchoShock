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