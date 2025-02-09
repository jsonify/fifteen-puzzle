// src/lib/LeaderboardManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { LeaderboardManager } from './LeaderboardManager'

describe('LeaderboardManager', () => {
  let leaderboardManager: LeaderboardManager;
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  beforeEach(() => {
    // Reset localStorage mock before each test
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    localStorageMock.clear();
    leaderboardManager = new LeaderboardManager();
  });

  it('saves new scores correctly', () => {
    const result = leaderboardManager.saveScore(2, 10, 'Player1');
    expect(result).toBe(true);
    
    const savedScore = leaderboardManager.getScoreForLevel(2);
    expect(savedScore).toBe(10);
  });

  it('only saves better scores', () => {
    // Save initial score
    leaderboardManager.saveScore(2, 10, 'Player1');
    
    // Try to save worse score
    const worseResult = leaderboardManager.saveScore(2, 15, 'Player2');
    expect(worseResult).toBe(false);
    
    // Try to save better score
    const betterResult = leaderboardManager.saveScore(2, 5, 'Player3');
    expect(betterResult).toBe(true);
    
    const savedScore = leaderboardManager.getScoreForLevel(2);
    expect(savedScore).toBe(5);
  });

  it('retrieves null for non-existent levels', () => {
    const score = leaderboardManager.getScoreForLevel(999);
    expect(score).toBeNull();
  });

  it('maintains scores across multiple levels', () => {
    leaderboardManager.saveScore(2, 10, 'Player1');
    leaderboardManager.saveScore(3, 15, 'Player2');
    leaderboardManager.saveScore(4, 20, 'Player3');

    expect(leaderboardManager.getScoreForLevel(2)).toBe(10);
    expect(leaderboardManager.getScoreForLevel(3)).toBe(15);
    expect(leaderboardManager.getScoreForLevel(4)).toBe(20);
  });

  it('properly sorts leaderboard entries', () => {
    leaderboardManager.saveScore(3, 15, 'Player2');
    leaderboardManager.saveScore(2, 10, 'Player1');
    leaderboardManager.saveScore(4, 20, 'Player3');

    const leaderboard = leaderboardManager.getLeaderboard();
    expect(leaderboard).toEqual([
      expect.objectContaining({ level: 2, score: 10 }),
      expect.objectContaining({ level: 3, score: 15 }),
      expect.objectContaining({ level: 4, score: 20 })
    ]);
  });

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    // Should return null instead of throwing
    const score = leaderboardManager.getScoreForLevel(2);
    expect(score).toBeNull();
  });
});