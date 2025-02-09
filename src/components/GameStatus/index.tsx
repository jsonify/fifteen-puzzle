// src/components/GameStatus/index.tsx
import React from 'react'

interface GameStatusProps {
  currentLevel: number
  moves: number
  isVisible: boolean
}

export const GameStatus: React.FC<GameStatusProps> = ({ currentLevel, moves, isVisible }) => {
  if (!isVisible || currentLevel === 0) return null

  return (
    <div className="text-center space-y-1" data-testid="game-stats">
      <p data-testid="moves-display">Moves: {moves}</p>
      <p>Best Score ({currentLevel}x{currentLevel}): -</p>
    </div>
  )
}
