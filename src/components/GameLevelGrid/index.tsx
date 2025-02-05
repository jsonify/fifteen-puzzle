// src/components/GameLevelGrid/index.tsx
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter
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
        <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Instructions</AlertDialogTitle>
              <AlertDialogDescription>
                Starting at the top left corner, move the tiles in ascending order in the grid. 
                The tile in the lower right corner should remain "empty". 
                To move a tile you can click on it, use your arrow keys or swipe on mobile screen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowInstructions(false)}>
                Got it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Leaderboard Dialog */}
        <AlertDialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
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
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowLeaderboard(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return null
}

const GameLevelGrid = ({ onSelectLevel, currentLevel }: GameLevelGridProps) => {
  const levels: GameLevel[] = Array.from({ length: 8 }, (_, i) => ({
    size: i + 2,
    accessible: i < 2,
    score: i === 0 ? 1 : null
  }))

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <GameControls isPlaying={currentLevel > 0} />
      
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
            disabled={!accessible}
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

