import Image from "next/image"
import Link from "next/link"

interface Game {
  id: number
  title: string
  description: string
  game_url: string
  image_url: string
  created_at: string
  glade: number
}

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className='flex-none w-72 bg-[#1C0F0A]/80 rounded-lg shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]'>
      <div className='h-40 bg-[#3C2820] rounded-t-lg relative overflow-hidden'>
        <Image
          src={game.image_url}
          alt={game.title}
          fill
          className='object-cover'
          unoptimized
        />
      </div>
      <div className='p-4'>
        <h3 className='hover-glow font-bold text-[#FFF8F0]/70'>{game.title}</h3>
        <p className='hover-glow text-sm text-[#FFF8F0]/50 mb-3'>
          {game.description}
        </p>
        <div className='flex justify-between items-center'>
          <Link
            href={game.game_url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover-glow inline-block btn text-sm'
          >
            Play Game
          </Link>
          <Link
            href={`/echoes/${game.glade}`}
            className='hover-glow inline-block btn text-sm'
          >
            Read Review
          </Link>
        </div>
      </div>
    </div>
  )
}
