// src/components/GameBoard/test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameBoard } from '.'

describe('<GameBoard />', () => {
  const defaultProps = {
    onMove: vi.fn(),
    onVictory: vi.fn(),
    onNextLevel: vi.fn(),
    onRetry: vi.fn(),
    onChooseLevel: vi.fn()
  }

  beforeEach(() => {
    for (const mockFn of Object.values(defaultProps)) {
      mockFn.mockClear()
    }
  })

  it('renders a board with correct number of tiles', () => {
    render(<GameBoard size={3} moves={0} {...defaultProps} />)
    
    // In a 3x3 board, we should have 8 numbered tiles (1-8) and one empty space
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
    
    // Check that numbers 1-8 are present
    const numbers = new Set(
      buttons
        .map(button => button.textContent)
        .filter(Boolean)
        .map(Number)
    )
    expect(numbers.size).toBe(8)
    for (let i = 1; i <= 8; i++) {
      expect(numbers.has(i)).toBe(true)
    }
  })

  it('generates a solvable puzzle configuration', async () => {
    const { rerender } = render(<GameBoard size={3} moves={0} {...defaultProps} />)

    // Get initial configuration
    const getConfiguration = () => 
      screen.getAllByRole('button')
        .map(button => button.textContent ? Number(button.textContent) : null)

    // Check multiple configurations
    for (let i = 0; i < 5; i++) {
      rerender(<GameBoard size={3} moves={0} {...defaultProps} />)
      const config = getConfiguration()
      
      // Count inversions
      const flatConfig = config.filter((x): x is number => x !== null)
      let inversions = 0
      for (let i = 0; i < flatConfig.length - 1; i++) {
        for (let j = i + 1; j < flatConfig.length; j++) {
          if (flatConfig[i] > flatConfig[j]) inversions++
        }
      }

      // For 3x3 puzzle, solvable if inversions is even
      expect(inversions % 2).toBe(0)
    }
  })

  it('only allows valid moves', () => {
    render(<GameBoard size={3} moves={0} {...defaultProps} />)
    
    // Find empty tile and valid adjacent tile
    const buttons = screen.getAllByRole('button')
    const tiles = buttons.map(b => b.textContent ? parseInt(b.textContent) : null)
    const emptyIndex = tiles.indexOf(null)
    
    // Find a tile adjacent to empty space
    const adjacentIndex = buttons.findIndex((_, index) => {
      if (index === emptyIndex) return false
      
      const emptyRow = Math.floor(emptyIndex / 3)
      const emptyCol = emptyIndex % 3
      const tileRow = Math.floor(index / 3)
      const tileCol = index % 3
      
      return (
        (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
        (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
      )
    })
  
    // Test invalid move
    const invalidIndex = buttons.findIndex((_, index) => {
      if (index === emptyIndex || index === adjacentIndex) return false
      
      const tileRow = Math.floor(index / 3)
      const tileCol = index % 3
      const emptyRow = Math.floor(emptyIndex / 3)
      const emptyCol = emptyIndex % 3
      
      return !(
        (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
        (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
      )
    })
  
    // Click invalid tile
    fireEvent.click(buttons[invalidIndex])
    expect(defaultProps.onMove).not.toHaveBeenCalled()
    
    // Click valid tile
    fireEvent.click(buttons[adjacentIndex])
    expect(defaultProps.onMove).toHaveBeenCalledTimes(1)
  })

  it('updates board state after valid moves', async () => {
    render(<GameBoard size={3} moves={0} {...defaultProps} />)
    
    const getConfiguration = () => 
      screen.getAllByRole('button')
        .map(button => button.textContent ? Number(button.textContent) : null)
    
    const initialConfig = getConfiguration()
    const buttons = screen.getAllByRole('button')
    const emptyIndex = buttons.findIndex(button => !button.textContent)
    
    // Find a valid move
    const validMoveIndex = buttons.findIndex((button, index) => {
      if (index === emptyIndex) return false
      return (
        (Math.floor(index / 3) === Math.floor(emptyIndex / 3) && 
         Math.abs(index % 3 - emptyIndex % 3) === 1) ||
        (index % 3 === emptyIndex % 3 && 
         Math.abs(Math.floor(index / 3) - Math.floor(emptyIndex / 3)) === 1)
      )
    })
    
    // Make the move
    fireEvent.click(buttons[validMoveIndex])
    
    // Check that configuration changed
    const newConfig = getConfiguration()
    expect(newConfig).not.toEqual(initialConfig)
    expect(defaultProps.onMove).toHaveBeenCalledTimes(1)
  })

  it('renders different size boards correctly', () => {
    const { rerender } = render(<GameBoard size={2} moves={0} {...defaultProps} />)
    
    // 2x2 board
    expect(screen.getAllByRole('button')).toHaveLength(4)
    
    // 4x4 board
    rerender(<GameBoard size={4} moves={0} {...defaultProps} />)
    expect(screen.getAllByRole('button')).toHaveLength(16)
  })

  it('maintains puzzle solvability after moves', async () => {
    render(<GameBoard size={3} moves={0} {...defaultProps} />)
    
    const makeValidMove = () => {
      const buttons = screen.getAllByRole('button')
      const emptyIndex = buttons.findIndex(button => !button.textContent)
      
      // Find and click a valid move
      buttons.forEach((button, index) => {
        if (index === emptyIndex) return
        
        const isValidMove = 
          (Math.floor(index / 3) === Math.floor(emptyIndex / 3) && 
           Math.abs(index % 3 - emptyIndex % 3) === 1) ||
          (index % 3 === emptyIndex % 3 && 
           Math.abs(Math.floor(index / 3) - Math.floor(emptyIndex / 3)) === 1)
        
        if (isValidMove) {
          fireEvent.click(button)
          return
        }
      })
    }

    // Make several moves
    for (let i = 0; i < 5; i++) {
      makeValidMove()
      
      // Check solvability after each move
      const config = screen.getAllByRole('button')
        .map(button => button.textContent ? Number(button.textContent) : null)
      
      const flatConfig = config.filter((x): x is number => x !== null)
      let inversions = 0
      for (let i = 0; i < flatConfig.length - 1; i++) {
        for (let j = i + 1; j < flatConfig.length; j++) {
          if (flatConfig[i] > flatConfig[j]) inversions++
        }
      }

      expect(inversions % 2).toBe(0)
    }
  })

  it('shows victory screen when puzzle is solved', async () => {
    const mockCallbacks = {
      onMove: vi.fn(),
      onVictory: vi.fn(),
      onNextLevel: vi.fn(),
      onRetry: vi.fn(),
      onChooseLevel: vi.fn()
    }
  
    const { rerender } = render(
      <GameBoard
        size={2}
        moves={6}
        {...mockCallbacks}
      />
    )
  
    // Force victory state by directly setting props
    act(() => {
      rerender(
        <GameBoard
          size={2}
          moves={6}
          {...mockCallbacks}
          forceWin={true}
        />
      )
    })
  
    // Check for victory screen elements
    expect(screen.getByTestId('victory-screen')).toBeInTheDocument()
    expect(screen.getByTestId('victory-text')).toHaveTextContent('Solved!')
    expect(screen.getByText(/Your result: 6/)).toBeInTheDocument()
    expect(screen.getByTestId('choose-level-button')).toBeInTheDocument()
    expect(screen.getByTestId('retry-button')).toBeInTheDocument()
    expect(screen.getByTestId('next-level-button')).toBeInTheDocument()
  })
})

describe('2x2 puzzle specific tests', () => {
  const mockProps = {
    onMove: vi.fn(),
    onVictory: vi.fn(),
    onNextLevel: vi.fn(),
    onRetry: vi.fn(),
    onChooseLevel: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('always generates a solvable 2x2 configuration', () => {
    const { rerender } = render(<GameBoard size={2} moves={0} {...mockProps} />)
    
    for (let i = 0; i < 5; i++) {
      rerender(<GameBoard size={2} moves={0} {...mockProps} />)
      
      const buttons = screen.getAllByRole('button')
      const board = buttons.map(button => 
        button.textContent ? parseInt(button.textContent) : null
      )
      
      // Get board state
      const emptyIndex = board.indexOf(null)
      const emptyRow = Math.floor(emptyIndex / 2)
      const numbers = board.filter((x): x is number => x !== null)
      const inversions = countInversions(numbers)
      
      // For 2x2 puzzle, inversions + emptyRow must be odd for solvable state
      expect((inversions + emptyRow) % 2).toBe(1)
      
      // Should not be in solved state
      expect(board).not.toEqual([1, 2, 3, null])
      
      // Should have correct numbers
      expect(numbers.sort()).toEqual([1, 2, 3])
    }
  })
  
  it('allows valid moves in 2x2 puzzle', () => {
    render(<GameBoard size={2} moves={0} {...mockProps} />)
    
    const buttons = screen.getAllByRole('button')
    const emptyIndex = Array.from(buttons).findIndex(button => !button.textContent)
    
    // Find adjacent buttons
    const validMoves = buttons.filter((_, index) => {
      const row = Math.floor(index / 2)
      const col = index % 2
      const emptyRow = Math.floor(emptyIndex / 2)
      const emptyCol = emptyIndex % 2
      
      return (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      )
    })
    
    // Verify we can click valid moves
    validMoves.forEach(button => {
      fireEvent.click(button)
      expect(mockProps.onMove).toHaveBeenCalled()
    })
  })
})

// Helper function for tests
function countInversions(numbers: number[]): number {
  let inversions = 0
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) inversions++
    }
  }
  return inversions
}