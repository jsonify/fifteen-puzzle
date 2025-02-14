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
      console.log('Initializing GoogleSheetsService with URL:', apiUrl);
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
      const defaultOptions: RequestInit = {
          method: 'GET',
          mode: 'no-cors', // Switch back to no-cors for now
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          redirect: 'follow',
      };

      try {
          const response = await fetch(url, { ...defaultOptions, ...options });

          // With no-cors, we can't read the response
          // Return a default successful response
          return { success: true, data: [] };
      } catch (error) {
          console.error('API request failed:', error);
          this.isApiAccessible = false;
          // Don't throw, just return null to fall back to localStorage
          return null;
      }
  }

  async getGameState(): Promise<{ unlockedLevels: number[] }> {
      try {
          const response = await this.makeRequest(`${this.API_URL}?action=getGameState`);
          if (!response) {
              return { unlockedLevels: [2] }; // Default state
          }
          return response.data || { unlockedLevels: [2] };
      } catch (error) {
          console.warn('Falling back to default game state');
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
