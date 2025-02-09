// src/lib/GoogleSheetsService.ts
interface LeaderboardEntry {
    level: number;
    score: number;
    playerName: string;
    timestamp: string;
  }
  
  export class GoogleSheetsService {
    private readonly API_URL: string;
  
    constructor(apiUrl: string) {
      this.API_URL = apiUrl;
    }
  
    async getLeaderboard(): Promise<LeaderboardEntry[]> {
      try {
        const response = await fetch(`${this.API_URL}?action=getLeaderboard`);
        const text = await response.text(); // Get raw response text first
        console.log('Raw response:', text); // Debug log
        
        try {
          const data = JSON.parse(text);
          return data.data;
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          throw e;
        }
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    }
  
    async saveScore(level: number, score: number, playerName: string): Promise<boolean> {
      const response = await fetch(`${this.API_URL}?action=saveScore`, {
        method: 'POST',
        body: JSON.stringify({ level, score, playerName })
      });
      const { success } = await response.json();
      return success;
    }
  
    async resetLeaderboard(): Promise<boolean> {
      const response = await fetch(`${this.API_URL}?action=resetLeaderboard`, {
        method: 'POST'
      });
      const { success } = await response.json();
      return success;
    }
  
    async getGameState(): Promise<Record<string, any>> {
      const response = await fetch(`${this.API_URL}?action=getGameState`);
      const { data } = await response.json();
      return data;
    }
  
    async updateGameState(key: string, value: any): Promise<boolean> {
      const response = await fetch(`${this.API_URL}?action=updateGameState`, {
        method: 'POST',
        body: JSON.stringify({ key, value })
      });
      const { success } = await response.json();
      return success;
    }
  }