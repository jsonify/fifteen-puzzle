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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const leaderboardManager = new LeaderboardManager()

  useEffect(() => {
    if (open) {
      const fetchLeaderboard = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const data = await leaderboardManager.getLeaderboard()
          setEntries(data)
        } catch (err) {
          setError('Failed to load leaderboard. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchLeaderboard()
    }
  }, [open])

  const handleTrophyClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('🏆 Secret trophy click! Reset all scores?')) {
      try {
        setIsLoading(true)
        setError(null)
        await leaderboardManager.resetLeaderboard()
        setEntries([])
      } catch (err) {
        setError('Failed to reset leaderboard. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-white" aria-describedby="leaderboard-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <span 
              role="img" 
              aria-label="trophy" 
              className={`text-yellow-400 cursor-pointer hover:scale-110 transition-transform
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={!isLoading ? handleTrophyClick : undefined}
            >
              🏆
            </span>
            Best Results
          </AlertDialogTitle>
          
          <AlertDialogDescription asChild>
            <>
              {error && (
                <div className="text-red-500 p-4 text-center rounded-md">
                  {error}
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : entries.length > 0 ? (
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
