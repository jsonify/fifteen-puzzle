// src/components/App.tsx
import React, { useState, useRef } from 'react'
import { GameBoard } from './GameBoard'
import GameLevelGrid from './GameLevelGrid'
import { Leaderboard } from './Leaderboard'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel
} from '@/components/ui/alert-dialog'
import { LeaderboardManager } from '@/lib/LeaderboardManager'
import { SolveConfirmDialog } from './SolveConfirmDialog'

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showGameControls, setShowGameControls] = useState(true)
  const leaderboardManager = new LeaderboardManager()
  const [showSolveConfirm, setShowSolveConfirm] = useState(false);
  const gameBoardRef = useRef<{ solve: () => void }>(null);
  
  const handleSolve = () => {
    setShowSolveConfirm(true);
  };

  const handleConfirmSolve = () => {
    setShowSolveConfirm(false);
    if (gameBoardRef.current) {
      gameBoardRef.current.solve();
    }
  };

  const handleVictory = () => {
    setShowGameControls(false)
    const playerName = prompt('You achieved a new best score! Enter your name:') || 'Anonymous'
    leaderboardManager.saveScore(currentLevel, moves, playerName)
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
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Sliding Puzzle Game
            </h1>
          </div>

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
                  onClick={handleSolve}
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
                ref={gameBoardRef} 
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
        </div>
      </div>

      {/* Dialogs */}
      <Leaderboard 
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />

      <SolveConfirmDialog
        open={showSolveConfirm}
        onOpenChange={setShowSolveConfirm}
        onConfirm={handleConfirmSolve}
      />

      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent className="max-w-md bg-white">
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
    </>
  )
}

export default App