import React, { useState, useRef, useCallback } from 'react'
import { GameBoard } from '../GameBoard'
import GameLevelGrid from '../GameLevelGrid'
import { Leaderboard } from '../Leaderboard'
import { GameControls } from '../GameControls'
import { GameStatus } from '../GameStatus'
import { SolveConfirmDialog } from '../SolveConfirmDialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [moves, setMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showGameControls, setShowGameControls] = useState(true)
  const [showSolveConfirm, setShowSolveConfirm] = useState(false)
  const [isSolving, setIsSolving] = useState(false);
  const leaderboardManager = new LeaderboardManager()
  const gameBoardRef = useRef<{ solve: () => void }>(null)

  const handleVictory = async () => {
    setShowGameControls(false);
    const leaderboardManager = new LeaderboardManager()
    const prevBestScore = await leaderboardManager.getScoreForLevel(currentLevel);
    
    if (prevBestScore === null || moves < prevBestScore) {
      const playerName = prompt('You achieved a new best score! Enter your name:') || 'Anonymous';
      await leaderboardManager.saveScore(currentLevel, moves, playerName);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 9) {
      setCurrentLevel(currentLevel + 1)
      setMoves(0)
      setShowGameControls(true)
    }
  }

  const handleLevelsClick = () => {
    setCurrentLevel(0)
    setMoves(0)
  }

  const handleSolveConfirm = useCallback(() => {
    if (isSolving) return; // Prevent multiple solves
    
    setIsSolving(true);
    setShowSolveConfirm(false);

    // Ensure we're not in a race condition
    setTimeout(() => {
      if (gameBoardRef.current) {
        gameBoardRef.current.solve();
      }
      setIsSolving(false);
    }, 100);
  }, [isSolving]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Sliding Puzzle Game
            </h1>
          </div>

          <GameControls 
            showGameControls={showGameControls}
            onInstructionsClick={() => setShowInstructions(true)}
            onLeaderboardClick={() => setShowLeaderboard(true)}
            onLevelsClick={handleLevelsClick}
            onSaveClick={() => {}}
            onSolveClick={() => setShowSolveConfirm(true)}
            currentLevel={currentLevel}
          />

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
                onRetry={() => {
                  setMoves(0)
                  setShowGameControls(true)
                }}
                onChooseLevel={() => {
                  setCurrentLevel(0)
                  setMoves(0)
                  setShowGameControls(true)
                }}
                ref={gameBoardRef}
              />
            )}
          </div>

          <GameStatus 
            currentLevel={currentLevel}
            moves={moves}
            isVisible={currentLevel > 0}
          />
        </div>
      </div>

      <Leaderboard 
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />

      <SolveConfirmDialog
        open={showSolveConfirm && !isSolving}
        onOpenChange={(open) => {
          if (!isSolving) {
            setShowSolveConfirm(open);
          }
        }}
        onConfirm={handleSolveConfirm}
      />

      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent className="max-w-m bg-white">
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
