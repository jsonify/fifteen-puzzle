// src/components/LevelGrid/index.tsx
interface LevelGridProps {
  onSelectLevel: (level: number) => void
}

export function LevelGrid({ onSelectLevel }: LevelGridProps) {
  const levels = Array.from({ length: 8 }, (_, i) => ({
    size: i + 2,
    accessible: i < 2,
    score: i === 0 ? 1 : null
  }))

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {levels.map(({ size, accessible, score }) => (
        <button
          key={size}
          onClick={() => accessible && onSelectLevel(size)}
          className={`
            aspect-square border-2 rounded p-4
            flex flex-col items-center justify-center
            ${accessible 
              ? 'border-blue-500 text-blue-500 hover:bg-blue-50' 
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <span className="text-2xl font-semibold">{size}x{size}</span>
          {score && <span className="text-sm mt-1">Score: {score}</span>}
        </button>
      ))}
    </div>
  )
}