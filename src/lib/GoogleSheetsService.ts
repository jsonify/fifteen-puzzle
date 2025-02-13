// src/lib/GoogleSheetsService.ts
interface LeaderboardEntry {
    level: number;
    score: number;
    playerName: string;
    timestamp: string;
}

interface GameState {
    unlockedLevels: number[];
}

export class GoogleSheetsService {
    private readonly API_URL: string;
    private isApiAccessible: boolean = true;

    constructor(apiUrl: string) {
      this.API_URL = apiUrl;
    }

    // Try once to access the API and then disable if not available
    private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
      const defaultOptions: RequestInit = {
        method: 'GET',
        mode: 'no-cors', // Use no-cors mode for Google Apps Script
        redirect: 'follow',
        credentials: 'omit'
      };

      try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        if (!response.ok && response.type !== 'opaque') {
          throw new Error('API request failed');
        }
        // With no-cors mode, we won't get JSON back, so assume success if we get here
        return { success: true };
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }

    private async checkApiAccess(): Promise<void> {
      if (!this.isApiAccessible) return;

      try {
        await this.makeRequest(`${this.API_URL}?action=getGameState`);
      } catch (error) {
        console.error('API connectivity check failed:', error);
        this.isApiAccessible = false;
      }
    }

    async getGameState(): Promise<GameState> {
        await this.checkApiAccess();
        if (!this.isApiAccessible) {
            return { unlockedLevels: [2] };
        }

        try {
            await this.makeRequest(`${this.API_URL}?action=getGameState`);
            // Since we can't get actual data in no-cors mode,
            // return default state if we get here without errors
            return { unlockedLevels: [2] };
        } catch (error) {
            console.error('Error getting game state:', error);
            this.isApiAccessible = false;
            return { unlockedLevels: [2] };
        }
    }

    async updateGameState(key: string, value: any): Promise<boolean> {
        if (!this.isApiAccessible) return false;

        try {
            await this.makeRequest(`${this.API_URL}?action=updateGameState`, {
                method: 'POST',
                body: JSON.stringify({ key, value })
            });
            return true;
        } catch (error) {
            console.error('Error updating game state:', error);
            this.isApiAccessible = false;
            return false;
        }
    }

    async getLeaderboard(): Promise<LeaderboardEntry[]> {
        try {
            await this.makeRequest(`${this.API_URL}?action=getLeaderboard`);
            // With no-cors mode, we can't get actual data back
            // Return empty array since we can't access the response
            return [];
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    async saveScore(level: number, score: number, playerName: string): Promise<boolean> {
        if (!this.isApiAccessible) return false;

        try {
            await this.makeRequest(`${this.API_URL}?action=saveScore`, {
                method: 'POST',
                body: JSON.stringify({ level, score, playerName })
            });
            return true;
        } catch (error) {
            console.error('Error saving score:', error);
            this.isApiAccessible = false;
            return false;
        }
    }

    async resetLeaderboard(): Promise<boolean> {
        try {
            await this.makeRequest(`${this.API_URL}?action=resetLeaderboard`, {
                method: 'POST'
            });
            return true;
        } catch (error) {
            console.error('Error resetting leaderboard:', error);
            return false;
        }
    }
}
