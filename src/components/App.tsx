// src/components/App.tsx
import React, { useState } from 'react'
import { GameBoard } from './GameBoard'
import GameLevelGrid from './GameLevelGrid'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showGameControls, setShowGameControls] = useState(true)

  const handleVictory = () => {
    setShowGameControls(false)
  }

  const handleNextLevel = () => {
    if (currentLevel < 9) {
      setCurrentLevel(currentLevel + 1)
      setMoves(0)
      setShowGameControls(true)
    }
  }

  const handleRetry = () => {
    setMoves(0)
    setShowGameControls(true)
  }

  const handleChooseLevel = () => {
    setCurrentLevel(0)
    setMoves(0)
    setShowGameControls(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Sliding Puzzle Game
          </h1>
        </div>

        {/* Game Controls */}
        <div className="flex gap-4 mb-6">
          {currentLevel === 0 || !showGameControls ? (
            <>
              <button 
                className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
                onClick={() => setShowInstructions(true)}
              >
                Instructions
              </button>
              <button 
                className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
                onClick={() => setShowLeaderboard(true)}
              >
                Leaderboard
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setCurrentLevel(0)
                  setMoves(0)
                }}
                className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
              >
                Levels
              </button>
              <button 
                className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
                onClick={() => {}}
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
                onClick={() => {}}
              >
                Solve
              </button>
              </>
          )}
        </div>

        {/* Main Game Area */}
        <div className="w-full aspect-square border-2 border-blue-500 rounded bg-gray-50 mb-6">
          {currentLevel === 0 ? (
            <GameLevelGrid 
              onSelectLevel={(level) => {
                setCurrentLevel(level)
                setMoves(0)
                setShowGameControls(true)
              }} 
              currentLevel={currentLevel}
            />
          ) : (
            <GameBoard 
              size={currentLevel} 
              moves={moves}
              onMove={() => setMoves(m => m + 1)}
              onVictory={handleVictory}
              onNextLevel={handleNextLevel}
              onRetry={handleRetry}
              onChooseLevel={handleChooseLevel}
            />
          )}
        </div>

        {/* Game Stats */}
        {currentLevel > 0 && (
          <div className="text-center space-y-1" data-testid="game-stats">
            <p>Moves: <span data-testid="moves-count">{moves}</span></p>
            <p>Best Score ({currentLevel}x{currentLevel}): -</p>
          </div>
        )}

        {/* Dialogs */}
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
    </div>
  )
}

export default App