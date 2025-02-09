import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { LeaderboardManager } from '@/lib/LeaderboardManager'

interface VictoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: number
  moves: number
  onPlayAgain: () => void
}

export function VictoryDialog({ 
  open, 
  onOpenChange, 
  level,
  moves,
  onPlayAgain 
}: VictoryDialogProps) {
  const [playerName, setPlayerName] = useState('')
  const leaderboardManager = new LeaderboardManager()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      leaderboardManager.saveScore(level, moves, playerName.trim())
      onOpenChange(false)
      onPlayAgain()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm bg-white" description="victory-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 Puzzle Solved!</AlertDialogTitle>
          <AlertDialogDescription id="victory-dialog">
            Congratulations! You solved the {level}x{level} puzzle in {moves} moves.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="mt-4" role="form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel asChild>
              <button 
                type="button" 
                onClick={() => {
                  onOpenChange(false)
                  onPlayAgain()
                }}
                aria-label="Skip"
              >
                Skip
              </button>
            </AlertDialogCancel>
            <AlertDialogAction type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
              Save Score
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
