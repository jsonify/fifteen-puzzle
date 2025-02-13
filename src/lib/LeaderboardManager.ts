// src/lib/LeaderboardManager.ts
import { GoogleSheetsService } from './GoogleSheetsService';

export interface LeaderboardEntry {
  level: number;
  score: number;
  playerName: string;
  timestamp?: string;
}

export class LeaderboardManager {
  private readonly STORAGE_KEY = 'leaderboard';
  private readonly UNLOCKS_KEY = 'unlockedLevels';
  private readonly sheetsService: GoogleSheetsService;
  private useLocalStorageOnly = true; // Start with local storage by default

  constructor() {
    this.sheetsService = new GoogleSheetsService('https://script.google.com/macros/s/AKfycbzVJ_k_muhKWSheCQR7z6Bc5IRuOFyc62vHDbPnFy9UkBhe6UzLm-L5tJAYjThnF2zc/exec');

    // Initialize local storage
    if (!localStorage.getItem(this.UNLOCKS_KEY)) {
      localStorage.setItem(this.UNLOCKS_KEY, JSON.stringify([2]));
    }
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }

    // Test connection on initialization
    this.testConnection().catch(error => {
      console.error('Failed to connect to Google Sheets:', error);
      this.useLocalStorageOnly = true;
    });
  }

  private async testConnection() {
    try {
      await this.sheetsService.getGameState();
    } catch (error) {
      console.log('API unreachable, using local storage only');
      this.useLocalStorageOnly = true;

      // Initialize local storage if needed
      if (!localStorage.getItem(this.UNLOCKS_KEY)) {
        localStorage.setItem(this.UNLOCKS_KEY, JSON.stringify([2]));
      }
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      }
    }
  }

  public async getScoreForLevel(level: number): Promise<number | null> {
    try {
      const leaderboard = await this.getLeaderboard();
      const entry = leaderboard.find(e => e.level === level);
      return entry ? entry.score : null;
    } catch (error) {
      console.error('Error getting score for level:', error);
      return null;
    }
  }

  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      if (this.useLocalStorageOnly) {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
      return await this.sheetsService.getLeaderboard();
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  }

  public async saveScore(level: number, score: number, playerName: string): Promise<boolean> {
    try {
      const entry = { level, score, playerName };

      if (this.useLocalStorageOnly) {
        const leaderboard = await this.getLeaderboard();
        const existingIndex = leaderboard.findIndex(e => e.level === level);

        if (existingIndex >= 0) {
          if (score < leaderboard[existingIndex].score) {
            leaderboard[existingIndex] = entry;
          }
        } else {
          leaderboard.push(entry);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leaderboard));
        await this.unlockNextLevel(level);
        return true;
      }

      return await this.sheetsService.saveScore(level, score, playerName);
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  }

  public async isLevelUnlocked(level: number): Promise<boolean> {
    try {
      if (this.useLocalStorageOnly) {
        const unlockedLevels = localStorage.getItem(this.UNLOCKS_KEY);
        return unlockedLevels ? JSON.parse(unlockedLevels).includes(level) : level === 2;
      }
      const gameState = await this.sheetsService.getGameState();
      return gameState.unlockedLevels?.includes(level) || level === 2;
    } catch (error) {
      console.error('Error checking level unlock status:', error);
      const unlockedLevels = localStorage.getItem(this.UNLOCKS_KEY);
      return unlockedLevels ? JSON.parse(unlockedLevels).includes(level) : level === 2;
    }
  }

  private async unlockNextLevel(currentLevel: number): Promise<void> {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 9) {
      try {
        if (this.useLocalStorageOnly) {
          const unlockedLevels = localStorage.getItem(this.UNLOCKS_KEY);
          const levels = unlockedLevels ? JSON.parse(unlockedLevels) : [2];
          if (!levels.includes(nextLevel)) {
            levels.push(nextLevel);
            localStorage.setItem(this.UNLOCKS_KEY, JSON.stringify(levels));
          }
          return;
        }
        await this.sheetsService.updateGameState('unlockedLevels', [nextLevel]);
      } catch (error) {
        console.error('Error unlocking next level:', error);
      }
    }
  }
}
