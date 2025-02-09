// src/lib/LeaderboardManager.ts
import { GoogleSheetsService } from './GoogleSheetsService';

export interface LeaderboardEntry {
  level: number;
  score: number;
  playerName: string;
  timestamp?: string;
}

export class LeaderboardManager {
  private readonly sheetsService: GoogleSheetsService;
  private cachedLeaderboard: LeaderboardEntry[] = [];
  private cachedUnlockedLevels: number[] = [2]; // Start with level 2 unlocked

  constructor() {
    // Replace with your deployed Google Apps Script Web App URL
    this.sheetsService = new GoogleSheetsService('https://script.google.com/macros/s/AKfycbxPAC13oau8TQtscu-wgY49XmQFH2gaKDvy8XOllRgvgLDiWLf6oeCPJY-XhuluYe7E/exec');
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    try {
      // Load initial data
      const [leaderboard, gameState] = await Promise.all([
        this.sheetsService.getLeaderboard(),
        this.sheetsService.getGameState()
      ]);

      this.cachedLeaderboard = leaderboard;
      this.cachedUnlockedLevels = gameState.unlockedLevels || [2];
    } catch (error) {
      console.error('Error initializing cache:', error);
    }
  }

  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const leaderboard = await this.sheetsService.getLeaderboard();
      this.cachedLeaderboard = leaderboard;
      return this.sortEntries(leaderboard);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return this.cachedLeaderboard;
    }
  }

  public async getScoreForLevel(level: number): Promise<number | null> {
    try {
      const leaderboard = await this.getLeaderboard();
      const entry = leaderboard.find(e => e.level === level);
      return entry?.score ?? null;
    } catch (error) {
      console.error('Error getting score for level:', error);
      const entry = this.cachedLeaderboard.find(e => e.level === level);
      return entry?.score ?? null;
    }
  }

  public async saveScore(level: number, score: number, playerName: string): Promise<boolean> {
    try {
      const currentBest = await this.getScoreForLevel(level);
      if (currentBest === null || score < currentBest) {
        const success = await this.sheetsService.saveScore(level, score, playerName);
        if (success) {
          // Update cache
          await this.getLeaderboard();
          // Unlock next level
          await this.unlockNextLevel(level);
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  }

  public async resetLeaderboard(): Promise<void> {
    try {
      await this.sheetsService.resetLeaderboard();
      // Reset game state to initial state
      await this.sheetsService.updateGameState('unlockedLevels', [2]);
      // Update cache
      this.cachedLeaderboard = [];
      this.cachedUnlockedLevels = [2];
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
    }
  }

  public async isLevelUnlocked(level: number): Promise<boolean> {
    try {
      const gameState = await this.sheetsService.getGameState();
      this.cachedUnlockedLevels = gameState.unlockedLevels || [2];
      return this.cachedUnlockedLevels.includes(level);
    } catch (error) {
      console.error('Error checking level unlock status:', error);
      return this.cachedUnlockedLevels.includes(level);
    }
  }

  private async unlockNextLevel(currentLevel: number): Promise<void> {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 9 && !this.cachedUnlockedLevels.includes(nextLevel)) {
      const newUnlockedLevels = [...this.cachedUnlockedLevels, nextLevel];
      try {
        await this.sheetsService.updateGameState('unlockedLevels', newUnlockedLevels);
        this.cachedUnlockedLevels = newUnlockedLevels;
      } catch (error) {
        console.error('Error unlocking next level:', error);
      }
    }
  }

  private sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    return entries.sort((a, b) => a.level - b.level);
  }
}
