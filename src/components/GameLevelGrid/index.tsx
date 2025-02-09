// src/components/GameLevelGrid/index.tsx
import React from 'react'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

interface GameLevel {
  size: number
  accessible: boolean
  score: number | null
  unlockedMessage?: string
}

interface GameLevelGridProps {
  onSelectLevel: (level: number) => void
  currentLevel: number
}

const GameLevelGrid = ({ onSelectLevel, currentLevel }: GameLevelGridProps) => {
  const leaderboardManager = new LeaderboardManager()
  
  const levels: GameLevel[] = Array.from({ length: 8 }, (_, i) => {
    const size = i + 2
    const isUnlocked = leaderboardManager.isLevelUnlocked(size)
    return {
      size,
      accessible: isUnlocked,
      score: leaderboardManager.getScoreForLevel(size),
      unlockedMessage: !isUnlocked ? `Complete ${size-1}x${size-1} to unlock` : undefined
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4 w-full p-4">
      {levels.map(({ size, accessible, score, unlockedMessage }) => (
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
          {unlockedMessage && (
            <div className="text-xs mt-1 text-gray-400">{unlockedMessage}</div>
          )}
        </button>
      ))}
    </div>
  )
}

export default GameLevelGrid