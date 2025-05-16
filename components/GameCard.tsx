import Image from "next/image"
import Link from "next/link"

interface Game {
  id: number
  title: string
  description: string
  game_url: string
  image_url: string
  created_at: string
}

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className='flex-none w-72 bg-[#1C0F0A]/80 rounded-lg shadow-lg backdrop-blur-sm hover-glow transition-transform duration-300 hover:scale-105'>
      <div className='h-40 bg-[#3C2820] rounded-t-lg relative overflow-hidden'>
        <Image
          src={game.image_url}
          alt={game.title}
          fill
          className='object-cover'
        />
      </div>
      <div className='p-4'>
        <h3 className='font-bold text-[#FFF8F0]/70'>{game.title}</h3>
        <p className='text-sm text-[#FFF8F0]/50 mb-3'>{game.description}</p>
        <Link
          href={game.game_url}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block btn text-sm'
        >
          Play Game
        </Link>
      </div>
    </div>
  )
}
