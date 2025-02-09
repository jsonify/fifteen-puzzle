// src/components/GameControls/index.tsx
import React from 'react'

interface GameControlsProps {
  showGameControls: boolean
  onInstructionsClick: () => void
  onLeaderboardClick: () => void
  onLevelsClick: () => void
  onSaveClick: () => void
  onSolveClick: () => void
  currentLevel: number
}

export const GameControls: React.FC<GameControlsProps> = ({
  showGameControls,
  onInstructionsClick,
  onLeaderboardClick,
  onLevelsClick,
  onSaveClick,
  onSolveClick,
  currentLevel
}) => {
  return (
    <div className="flex gap-4 mb-6">
      {currentLevel === 0 || !showGameControls ? (
        <>
          <button 
            className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
            onClick={onInstructionsClick}
          >
            Instructions
          </button>
          <button 
            className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
            onClick={onLeaderboardClick}
          >
            Leaderboard
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={onLevelsClick}
            className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
          >
            Levels
          </button>
          <button 
            className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
            onClick={onSaveClick}
          >
            Save
          </button>
          <button 
            className="flex-1 border-2 border-gray-300 text-gray-300 py-2 rounded"
            disabled
          >
            Load
          </button>
          <button 
            className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
            onClick={onSolveClick}
          >
            Solve
          </button>
        </>
      )}
    </div>
  )
}
