// pages/admin/index.tsx
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"
import { getServerSupabase } from "@/lib/supabaseClient"

interface Game {
  id: number
  title: string
  description: string
  game_url: string
  image_url: string
  created_at: string
}

interface AdminProps {
  games: Game[]
}

export default function Admin({ games }: AdminProps) {
  return (
    <Layout title='Admin Dashboard - EchoShock'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold hover-glow'>
            Manage Featured Games
          </h1>
          <Link href='/admin/create' className='btn'>
            Add New Game
          </Link>
        </div>

        <div className='bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm'>
          {games.length === 0 ? (
            <p className='text-text-light'>
              No featured games found. Add your first one!
            </p>
          ) : (
            <ul className='space-y-4'>
              {games.map((game) => (
                <li
                  key={game.id}
                  className='border-b border-[#FFF8F0]/10 pb-4 last:border-0 last:pb-0'
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-bold text-[#FFF8F0]/70'>
                        {game.title}
                      </h3>
                      <p className='text-sm text-[#FFF8F0]/50'>
                        {game.description.substring(0, 100)}…
                      </p>
                      <p className='text-xs text-[#FFF8F0]/30 mt-1'>
                        Added: {new Date(game.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <a
                        href={game.game_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm btn'
                      >
                        View
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async (
  ctx: GetServerSidePropsContext
) => {
  const supabase = getServerSupabase(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  const { data: games, error } = await supabase
    // Provide both table name and row type here so TS knows your Game interface
    .from<"featured_games", Game>("featured_games")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching games:", error)
    return { props: { games: [] } }
  }

  return {
    props: {
      games: games ?? [],
    },
  }
}
