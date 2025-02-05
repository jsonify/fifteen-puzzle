// src/components/GameLevelGrid/test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameLevelGrid from '.'

describe('<GameLevelGrid />', () => {
  const mockSelectLevel = vi.fn()

  beforeEach(() => {
    mockSelectLevel.mockClear()
  })

  it('renders the grid with correct number of levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // Should have exactly 8 level buttons (2x2 through 9x9)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(8)

    // Verify all levels are present
    for (let i = 2; i <= 9; i++) {
      expect(screen.getByTestId(`level-${i}`)).toBeInTheDocument()
    }
  })

  it('has correct initial accessibility state', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // 2x2 and 3x3 should be enabled
    const level2Button = screen.getByTestId('level-2')
    const level3Button = screen.getByTestId('level-3')
    expect(level2Button).not.toBeDisabled()
    expect(level3Button).not.toBeDisabled()
    
    // 4x4 through 9x9 should be disabled
    for (let i = 4; i <= 9; i++) {
      const button = screen.getByTestId(`level-${i}`)
      expect(button).toBeDisabled()
    }
  })

  it('calls onSelectLevel when clicking an accessible level', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // Click 2x2 level
    fireEvent.click(screen.getByTestId('level-2'))
    expect(mockSelectLevel).toHaveBeenCalledWith(2)
    
    // Click 3x3 level
    fireEvent.click(screen.getByTestId('level-3'))
    expect(mockSelectLevel).toHaveBeenCalledWith(3)
  })

  it('does not call onSelectLevel when clicking an inaccessible level', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // Try to click 4x4 level (should be inaccessible)
    fireEvent.click(screen.getByTestId('level-4'))
    expect(mockSelectLevel).not.toHaveBeenCalled()
  })

  it('displays scores for completed levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // Only 2x2 should show a score initially
    expect(screen.getByText('Score: 1')).toBeInTheDocument()
    
    // No other levels should show scores
    const scoreElements = screen.getAllByText(/Score:/i)
    expect(scoreElements).toHaveLength(1)
  })
})