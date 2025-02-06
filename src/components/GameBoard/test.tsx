// src/components/GameBoard/test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameBoard } from '.'

describe('<GameBoard />', () => {
  const mockOnMove = vi.fn()

  beforeEach(() => {
    mockOnMove.mockClear()
  })

  it('renders a board with correct number of tiles', () => {
    render(<GameBoard size={3} moves={0} onMove={mockOnMove} />)
    
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
    const { rerender } = render(<GameBoard size={3} moves={0} onMove={mockOnMove} />)

    // Get initial configuration
    const getConfiguration = () => 
      screen.getAllByRole('button')
        .map(button => button.textContent ? Number(button.textContent) : null)

    // Check multiple configurations
    for (let i = 0; i < 5; i++) {
      rerender(<GameBoard size={3} moves={0} onMove={mockOnMove} />)
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
    render(<GameBoard size={3} moves={0} onMove={mockOnMove} />)
    
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
    expect(mockOnMove).not.toHaveBeenCalled()
    
    // Click valid tile
    fireEvent.click(buttons[adjacentIndex])
    expect(mockOnMove).toHaveBeenCalledTimes(1)
  })

  it('updates board state after valid moves', async () => {
    render(<GameBoard size={3} moves={0} onMove={mockOnMove} />)
    
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
    expect(mockOnMove).toHaveBeenCalledTimes(1)
  })

  it('renders different size boards correctly', () => {
    const { rerender } = render(<GameBoard size={2} moves={0} onMove={mockOnMove} />)
    
    // 2x2 board
    expect(screen.getAllByRole('button')).toHaveLength(4)
    
    // 4x4 board
    rerender(<GameBoard size={4} moves={0} onMove={mockOnMove} />)
    expect(screen.getAllByRole('button')).toHaveLength(16)
  })

  it('maintains puzzle solvability after moves', async () => {
    render(<GameBoard size={3} moves={0} onMove={mockOnMove} />)
    
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
})