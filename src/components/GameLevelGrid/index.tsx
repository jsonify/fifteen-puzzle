import React, { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'

interface GameLevel {
  size: number
  accessible: boolean
  score: number | null
}

interface GameLevelGridProps {
  onSelectLevel: (level: number) => void
  currentLevel: number
}

const GameControls = ({ isPlaying }: { isPlaying: boolean }) => {
  const [showInstructions, setShowInstructions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (!isPlaying) {
    return (
      <div className="w-full flex gap-4 mb-6">
        <button 
          onClick={() => setShowInstructions(true)}
          className="flex-1 py-2 px-4 bg-white border-2 border-blue-500 text-blue-500 rounded hover:shadow-md transition-shadow"
        >
          Instructions
        </button>
        <button 
          onClick={() => setShowLeaderboard(true)}
          className="flex-1 py-2 px-4 bg-white border-2 border-blue-500 text-blue-500 rounded hover:shadow-md transition-shadow"
        >
          Leaderboard
        </button>

        {/* Instructions Dialog */}
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <AlertDialog open={showInstructions}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Instructions</AlertDialogTitle>
                <AlertDialogDescription>
                  Starting at the top left corner, move the tiles in ascending order in the grid. 
                  The tile in the lower right corner should remain "empty". 
                  To move a tile you can click on it, use your arrow keys or swipe on mobile screen.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>

        {/* Leaderboard Dialog */}
        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <AlertDialog open={showLeaderboard}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>🏆 Leaderboard</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 font-bold">
                    <div>Level</div>
                    <div>Score</div>
                    <div>Player</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>2x2</div>
                    <div>1</div>
                    <div>Player 1</div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="w-full flex gap-4 mb-6">
      <button className="flex-1 py-2 px-4 bg-white border-2 border-blue-500 text-blue-500 rounded hover:shadow-md transition-shadow">
        Levels
      </button>
      <button className="flex-1 py-2 px-4 bg-white border-2 border-blue-500 text-blue-500 rounded hover:shadow-md transition-shadow">
        Save
      </button>
      <button 
        className="flex-1 py-2 px-4 bg-white border-2 border-gray-300 text-gray-300 rounded cursor-not-allowed"
        disabled
      >
        Load
      </button>
      <button className="flex-1 py-2 px-4 bg-white border-2 border-blue-500 text-blue-500 rounded hover:shadow-md transition-shadow">
        Solve
      </button>
    </div>
  )
}

const GameLevelGrid = ({ onSelectLevel, currentLevel }: GameLevelGridProps) => {
  // Game configurations from 2x2 to 9x9
  const levels: GameLevel[] = Array.from({ length: 8 }, (_, i) => ({
    size: i + 2,
    accessible: i < 2, // Only 2x2 and 3x3 initially accessible
    score: i === 0 ? 1 : null // Example score for 2x2
  }))

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      {/* Controls - shows either Instructions/Leaderboard or game controls */}
      <GameControls isPlaying={currentLevel > 0} />

      {/* Grid of game configurations */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {levels.map(({ size, accessible, score }) => (
          <button
            key={size}
            onClick={() => accessible && onSelectLevel(size)}
            className={`
              aspect-square rounded-lg border-2 p-4 
              flex flex-col items-center justify-center
              ${accessible 
                ? 'border-blue-500 text-blue-500 hover:shadow-md cursor-pointer' 
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            <div className="text-2xl font-bold">{size}x{size}</div>
            {score && <div className="text-sm mt-2">Score: {score}</div>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GameLevelGrid