// src/components/Leaderboard/index.tsx
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

interface LeaderboardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface LeaderboardEntry {
  level: number
  score: number
  playerName: string
}

export function Leaderboard({ open, onOpenChange }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const leaderboardManager = new LeaderboardManager()

  const handleTrophyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('🏆 Secret trophy click! Reset all scores?')) {
      leaderboardManager.resetLeaderboard()
      setEntries([])
    }
  }

  useEffect(() => {
    if (open) {
      setEntries(leaderboardManager.getLeaderboard())
    }
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        className="max-w-md bg-white"
        aria-describedby="leaderboard-description"
      >
        <VisuallyHidden id="leaderboard-description">
          Leaderboard showing the best results for each puzzle level
        </VisuallyHidden>
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <span 
              role="img" 
              aria-label="trophy" 
              className="text-yellow-400 cursor-pointer hover:scale-110 transition-transform" 
              onClick={handleTrophyClick}
            >🏆</span>
            Best Results
          </AlertDialogTitle>
          
          <AlertDialogDescription asChild>
            <>
              {entries.length > 0 ? (
                <div className="overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-3 gap-4 py-2 px-4 bg-muted/50 rounded-lg font-medium text-sm">
                    <div>Level</div>
                    <div>Score</div>
                    <div>Player</div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {entries.map((entry) => (
                      <div 
                        key={entry.level}
                        className="grid grid-cols-3 gap-4 py-2 px-4 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>{entry.level}x{entry.level}</div>
                        <div>{entry.score}</div>
                        <div className="truncate">{entry.playerName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8" data-testid="empty-state">
                  No scores recorded yet
                </div>
              )}
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
