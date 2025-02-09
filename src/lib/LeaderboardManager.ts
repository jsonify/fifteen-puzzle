// src/lib/LeaderboardManager.ts
interface LeaderboardState {
  entries: LeaderboardEntry[];
  unlockedLevels: number[];
}
export interface LeaderboardEntry {
    level: number
    score: number
    playerName: string
    timestamp?: number
  }
  
  export class LeaderboardManager {
    private readonly STORAGE_KEY = 'sliding-puzzle-leaderboard'
    private readonly UNLOCKS_KEY = 'sliding-puzzle-unlocks'
  
    public isLevelUnlocked(level: number): boolean {
      const unlockedLevels = this.getUnlockedLevels()
      return unlockedLevels.includes(level)
    }
  
    public getScoreForLevel(level: number): number | null {
      try {
        const leaderboard = this.getLeaderboard();
        const entry = leaderboard.find(e => e.level === level);
        return entry?.score ?? null;
      } catch (error) {
        console.error('Error getting score for level:', error);
        return null;
      }
    }
  
    // Make sure all methods are declared with proper syntax
    public getLeaderboard(): LeaderboardEntry[] {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY)
        const entries = data ? JSON.parse(data) : []
        return this.sortEntries(entries)
      } catch (error) {
        console.error('Error reading leaderboard:', error)
        return []
      }
    }
    
    private getUnlockedLevels(): number[] {
      try {
        const data = localStorage.getItem(this.UNLOCKS_KEY)
        if (!data) {
          // Initially only 2x2 is unlocked
          const initial = [2]
          localStorage.setItem(this.UNLOCKS_KEY, JSON.stringify(initial))
          return initial
        }
        const parsed = JSON.parse(data)
        // Ensure we always return an array
        return Array.isArray(parsed) ? parsed : [2]
      } catch (error) {
        console.error('Error reading unlocked levels:', error)
        return [2] // Fallback to just first level
      }
    }

    private sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
      return entries.sort((a, b) => a.level - b.level)
    }
  
    private unlockNextLevel(currentLevel: number): void {
      const unlockedLevels = this.getUnlockedLevels()
      const nextLevel = currentLevel + 1
      if (nextLevel <= 9 && !unlockedLevels.includes(nextLevel)) {
        unlockedLevels.push(nextLevel)
        localStorage.setItem(this.UNLOCKS_KEY, JSON.stringify(unlockedLevels))
      }
    }

    clearLeaderboard(): void {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  
    saveScore(level: number, score: number, playerName: string): boolean {
      try {
        const leaderboard = this.getLeaderboard();
        const existingEntry = leaderboard.find(entry => entry.level === level);
        
        if (!existingEntry || existingEntry.score > score) {
          // Remove existing entry if present
          const filteredLeaderboard = leaderboard.filter(entry => entry.level !== level);
          
          // Add new entry
          const newEntry: LeaderboardEntry = {
            level,
            score,
            playerName,
            timestamp: Date.now()
          };
          
          const newLeaderboard = this.sortEntries([...filteredLeaderboard, newEntry]);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newLeaderboard));
          
          // Unlock next level upon completion
          this.unlockNextLevel(level);
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error saving score:', error);
        return false;
      }
    }
  }