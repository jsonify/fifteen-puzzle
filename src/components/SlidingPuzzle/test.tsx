import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest'
import SlidingPuzzle from './index'

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
    // Clear all mocks before each test
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should render the puzzle board', () => {
    render(<SlidingPuzzle />)

    // Check for main components
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
    expect(screen.getByText(/Moves:/)).toBeInTheDocument()
    expect(screen.getByText('New Game')).toBeInTheDocument()
    
    // Initial 2x2 board should have 3 numbered cells (1-3) and one empty
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    expect(buttons).toHaveLength(3)
  })

  it('should allow changing the puzzle size', () => {
    render(<SlidingPuzzle />)

    // Change to 3x3 puzzle
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '3' } })

    // Should now have 8 numbered cells (1-8)
    const buttons = screen.getAllByRole('button').filter(button => /^[1-8]$/.test(button.textContent || ''))
    expect(buttons).toHaveLength(8)
  })

  it('should track moves', async () => {
    render(<SlidingPuzzle />)

    // Initial move count should be 0
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()

    // Find a valid move by looking for a button next to the empty space
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    fireEvent.click(buttons[0])

    // Move count should increase after valid move
    await waitFor(() => {
      expect(screen.queryByText('Moves: 0')).not.toBeInTheDocument()
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

  it('should start new game when button clicked', async () => {
    render(<SlidingPuzzle />)

    // Make a move
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    fireEvent.click(buttons[0])

    // Click new game
    const newGameButton = screen.getByText('New Game')
    fireEvent.click(newGameButton)

    // Move count should reset to 0
    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })
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