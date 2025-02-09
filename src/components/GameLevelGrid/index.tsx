// src/components/GameLevelGrid/index.tsx
import React from 'react'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

interface GameLevel {
  size: number
  accessible: boolean
  score: number | null
}

interface GameLevelGridProps {
  onSelectLevel: (level: number) => void
  currentLevel: number
}

const GameLevelGrid = ({ onSelectLevel, currentLevel }: GameLevelGridProps) => {
  const leaderboardManager = new LeaderboardManager()
  
  const levels: GameLevel[] = Array.from({ length: 8 }, (_, i) => {
    const size = i + 2
    return {
      size,
      accessible: i < 2, // Only 2x2 and 3x3 initially accessible
      score: leaderboardManager.getScoreForLevel(size)
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4 w-full p-4">
      {levels.map(({ size, accessible, score }) => (
        <button
          key={size}
          onClick={() => accessible && onSelectLevel(size)}
          disabled={!accessible}
          aria-disabled={!accessible}
          data-testid={`level-${size}`}
          className={`
            aspect-square rounded-lg border-2 p-4 
            flex flex-col items-center justify-center
            ${accessible 
              ? 'border-blue-500 text-blue-500 hover:shadow-md cursor-pointer'
              : 'border-gray-300 text-gray-300 cursor-not-allowed bg-gray-50'
            }
            disabled:opacity-60
            disabled:cursor-not-allowed
          `}
        >
          <div className="text-2xl font-bold">{size}x{size}</div>
          {score !== null && (
            <div className="text-sm mt-2">Score: {score}</div>
          )}
        </button>
      ))}
    </div>
  )
}

export default GameLevelGrid