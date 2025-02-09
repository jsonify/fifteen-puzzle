// src/components/GameLevelGrid/index.tsx
import React from 'react'
import { LeaderboardManager } from '@/lib/LeaderboardManager'
import { useEffect, useState } from 'react'
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
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const leaderboardManager = new LeaderboardManager()
  
  useEffect(() => {
    const loadLevels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const levelData = await Promise.all(
          Array.from({ length: 8 }, async (_, i) => {
            const size = i + 2;
            const isUnlocked = await leaderboardManager.isLevelUnlocked(size);
            const score = await leaderboardManager.getScoreForLevel(size);
            return {
              size,
              accessible: isUnlocked,
              score,
              unlockedMessage: !isUnlocked ? `Complete ${size-1}x${size-1} to unlock` : undefined
            };
          })
        );
        setLevels(levelData);
      } catch (err) {
        setError('Failed to load levels. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLevels();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
  );
};

export default GameLevelGrid