// src/components/SlidingPuzzle/test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SlidingPuzzle from './index'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

// Mock LeaderboardManager
vi.mock('@/lib/LeaderboardManager', () => ({
  LeaderboardManager: vi.fn().mockImplementation(() => ({
    getScoreForLevel: vi.fn((level) => {
      const scores = {
        2: 5,
        3: 10
      };
      return scores[level as keyof typeof scores] || null;
    }),
    isLevelUnlocked: vi.fn(() => true), // Mock all levels as unlocked for tests
    saveScore: vi.fn()
  }))
}))

describe('<SlidingPuzzle />', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn()
  }

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should render the puzzle board', () => {
    render(<SlidingPuzzle />)
    
    // Check for move counter
    expect(screen.getByText(/Moves:/)).toBeInTheDocument()
    
    // Initial 2x2 board should have 3 numbered cells (1-3) and one empty
    const buttons = screen.getAllByRole('button').filter(button => 
      /^[1-3]$/.test(button.textContent || '')
    )
    expect(buttons).toHaveLength(3)

    // Check for Best Score text
    expect(screen.getByText(/Best Score/)).toBeInTheDocument()
  })

  it('should allow changing the puzzle size', () => {
    render(<SlidingPuzzle />)

    // First, we should have a 2x2 puzzle with 3 numbered cells
    let buttons = screen.getAllByRole('button').filter(button => 
      /^[1-3]$/.test(button.textContent || '')
    )
    expect(buttons).toHaveLength(3)

    // Find and click the 3x3 level button
    const level3Button = screen.getByText('3x3')
    fireEvent.click(level3Button)

    // Now we should have 8 numbered cells (1-8) for a 3x3 puzzle
    buttons = screen.getAllByRole('button').filter(button => 
      /^[1-8]$/.test(button.textContent || '')
    )
    expect(buttons).toHaveLength(8)

    // Check that the level indicator has updated
    expect(screen.getByText(/Best Score \(3x3\)/)).toBeInTheDocument()
  })

  it('should track moves', async () => {
    render(<SlidingPuzzle />)
  
    // Initial move count should be 0
    const initialMoves = screen.getByText('Moves: 0')
    expect(initialMoves).toBeInTheDocument()
  
    // Find a valid move by looking for a button next to the empty space
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    fireEvent.click(buttons[0])
  
    // Wait for the move count to update
    await waitFor(() => {
      const moves = screen.getByTestId('moves-counter')
      expect(moves).toBeInTheDocument()
      const moveCount = parseInt(moves.textContent?.replace('Moves: ', '') || '0')
      expect(moveCount).toBeGreaterThan(0)
    })
  })

  it('should store best scores in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      '2': 5,
      '3': 10
    }))

    render(<SlidingPuzzle />)

    // Should display the best score for 2x2 puzzle
    expect(screen.getByText('Best Score (2x2): 5')).toBeInTheDocument()
  })

  it('should start new game when skipping victory dialog', async () => {
    render(<SlidingPuzzle forceWin={true} />)
    
    // Wait for victory dialog to appear
    await waitFor(() => {
      expect(screen.getByText('🎉 Puzzle Solved!')).toBeInTheDocument()
    })

    // Find and click the Skip button
    const skipButton = screen.getByTestId('skip-button')
    fireEvent.click(skipButton)
    
    // Verify moves reset to 0
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    
    // Verify puzzle is playable again (buttons are present)
    const newButtons = screen.getAllByRole('button').filter(button => 
      /^[1-3]$/.test(button.textContent || '')
    )
    expect(newButtons).toHaveLength(3)
  })

  it('should check for valid moves only', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<SlidingPuzzle />)

    // Get initial state
    const moveCountElement = screen.getByText(/Moves:/)
    const initialMoveCount = Number(moveCountElement.textContent?.match(/\d+/)?.[0] || 0)
    
    // Find a button that's definitely not adjacent to the empty space
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    const buttonPositions = buttons.map(button => {
      const style = window.getComputedStyle(button)
      return {
        button,
        left: style.left,
        top: style.top
      }
    })
    
    // Click each button twice to ensure we hit at least one invalid move
    buttonPositions.forEach(({ button }) => {
      fireEvent.click(button)
      fireEvent.click(button)
    })

    // Get final move count
    const finalMoveCount = Number(moveCountElement.textContent?.match(/\d+/)?.[0] || 0)
    
    // The number of moves should be less than the total number of clicks
    // since some clicks should have been invalid
    expect(finalMoveCount - initialMoveCount).toBeLessThan(buttonPositions.length * 2)
  })
})
