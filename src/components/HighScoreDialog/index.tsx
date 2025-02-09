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

interface HighScoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: number
  moves: number
  onSaveScore: (playerName: string) => void
  onSkip: () => void
}

export function HighScoreDialog({ 
  open, 
  onOpenChange, 
  level,
  moves,
  onSaveScore,
  onSkip
}: HighScoreDialogProps) {
  const [playerName, setPlayerName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      onSaveScore(playerName.trim())
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm bg-white" description="highscore-dialog" data-testid="highscore-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>🏆 New High Score!</AlertDialogTitle>
          <AlertDialogDescription id="highscore-dialog">
            Amazing! You solved the {level}x{level} puzzle in {moves} moves - that's a new record!
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
            <AlertDialogCancel 
              type="button" 
              onClick={onSkip}
              data-testid="skip-button"
            >
              Skip
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
