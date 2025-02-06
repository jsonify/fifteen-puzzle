// src/lib/LeaderboardManager.ts

export interface LeaderboardEntry {
    level: number
    score: number
    playerName: string
    timestamp?: number
  }
  
  export class LeaderboardManager {
    private readonly STORAGE_KEY = 'sliding-puzzle-leaderboard'
  
    getLeaderboard(): LeaderboardEntry[] {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY)
        const entries = data ? JSON.parse(data) : []
        return this.sortEntries(entries)
      } catch (error) {
        console.error('Error reading leaderboard:', error)
        return []
      }
    }
  
    saveScore(level: number, score: number, playerName: string): boolean {
      try {
        const leaderboard = this.getLeaderboard()
        const existingEntry = leaderboard.find(entry => entry.level === level)
        
        if (!existingEntry || existingEntry.score > score) {
          // Remove existing entry if present
          const filteredLeaderboard = leaderboard.filter(entry => entry.level !== level)
          
          // Add new entry
          const newEntry: LeaderboardEntry = {
            level,
            score,
            playerName,
            timestamp: Date.now()
          }
          
          const newLeaderboard = this.sortEntries([...filteredLeaderboard, newEntry])
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newLeaderboard))
          return true
        }
        
        return false
      } catch (error) {
        console.error('Error saving score:', error)
        return false
      }
    }
  
    private sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
      return entries.sort((a, b) => a.level - b.level)
    }
  
    clearLeaderboard(): void {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  
    getScoreForLevel(level: number): number | null {
      const leaderboard = this.getLeaderboard()
      const entry = leaderboard.find(e => e.level === level)
      return entry?.score ?? null
    }
  }