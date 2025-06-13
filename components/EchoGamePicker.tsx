import { Button } from '@/components/ui/button'

export interface GameOption { id: number; title: string }

interface GamePickerProps {
  games: GameOption[]
  selected: number[]
  onToggle: (id: number) => void
  onConfirm: () => void
  onCancel: () => void
  visible: boolean
}

export function GamePicker({
  games,
  selected,
  onToggle,
  onConfirm,
  onCancel,
  visible,
}: GamePickerProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-wood-dark p-6 rounded-lg space-y-4 w-full max-w-md">
        <h3 className="text-lg font-bold  ">
          Select up to 5 games
        </h3>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {games.map((game) => {
            const checked = selected.includes(game.id)
            return (
              <li key={game.id}>
                <label className="flex items-center space-x-2  ">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(game.id)}
                    className="accent-pink-500"
                  />
                  <span>{game.title}</span>
                </label>
              </li>
            )
          })}
        </ul>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={selected.length === 0}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
