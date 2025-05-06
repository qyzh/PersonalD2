import { Skull, Sword, Handshake } from 'lucide-react'
import { Icon } from '../../public/svg/icon'

// Reusable loading card component to reduce repetition
function LoadingCard() {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm aspect-square flex items-center justify-center w-10 h-10">
      <div className="animate-pulse">...</div>
    </div>
  )
}

export default function FBrecentGame() {
  return (
    <div className="max-w-3xl">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Profile Image Placeholder */}
        <div className="w-32 h-32 md:w-28 md:h-28 overflow-hidden rounded-lg shadow-md flex-shrink-0">
          <div className="animate-pulse bg-neutral-900 w-full h-full" />
        </div>

        <div className="flex flex-col items-center md:items-start gap-2 flex-grow">
          {/* Title and Status */}
          <div className="flex flex-row gap-2">
            <div className="animate-pulse font-semibold text-xl lg:text-lg bg-neutral-900 w-16 h-6" />
            <div className="animate-pulse inline-flex items-center justify-center rounded-md border text-sm w-16 h-6 bg-neutral-900" />
          </div>

          {/* Game Stats Icons */}
          <div className="flex flex-row gap-2">
            <div className="inline-flex items-center"><Icon name='sword' size={20} className="size-4" /></div>
            <div className="inline-flex items-center"><Icon name='skull' size={20} className="size-4" /></div>
            <div className="inline-flex items-center"><Icon name='assist' size={20} className="size-4" /></div>
          </div>

          {/* Loading Cards Grid */}
          <div className="grid grid-cols-6 gap-1 mt-2 max-w-lg">
            {Array(6).fill(null).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
