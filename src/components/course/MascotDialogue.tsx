import { cn } from '../../lib/cn'

export type MascotType = 'ch7' | 'ch13' | 'shared'

interface MascotDialogueProps {
  mascotType: MascotType
  message: string
  className?: string
}

const mascotConfig = {
  ch7: {
    name: 'Hariette',
    emoji: '🐇',
    image: '/mascots/hariette_hare_final.png',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    accentColor: 'text-amber-700',
  },
  ch13: {
    name: 'Sheldon',
    emoji: '🐢',
    image: '/mascots/sheldon_tortoise_final.png',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    accentColor: 'text-teal-700',
  },
  shared: {
    name: 'Hariette & Sheldon',
    emoji: '🐇🐢',
    image: '/mascots/hariette_hare_final.png', // Default to Hariette for shared
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    accentColor: 'text-purple-700',
  },
}

export function MascotDialogue({ mascotType, message, className }: MascotDialogueProps) {
  const config = mascotConfig[mascotType]

  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-4 my-6',
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {mascotType === 'shared' ? (
            <div className="flex -space-x-3">
              <img
                src="/mascots/hariette_hare_final.png"
                alt="Hariette"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <img
                src="/mascots/sheldon_tortoise_final.png"
                alt="Sheldon"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
            </div>
          ) : (
            <img
              src={config.image}
              alt={config.name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
            />
          )}
        </div>

        {/* Speech bubble */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-bold uppercase tracking-wide mb-1', config.accentColor)}>
            {config.emoji} {config.name} {mascotType === 'shared' ? 'say' : 'says'}:
          </p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}
