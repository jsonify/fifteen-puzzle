import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameLevelGrid from '.'

describe('<GameLevelGrid />', () => {
  const mockSelectLevel = vi.fn()

  beforeEach(() => {
    mockSelectLevel.mockClear()
  })

  it('renders the grid with correct number of levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    // Should have 8 levels (2x2 through 9x9)
    const buttons = screen.getAllByRole('button')
    // 8 level buttons + 2 control buttons (Instructions, Leaderboard)
    expect(buttons).toHaveLength(10)
  })

  it('shows instructions modal when clicking Instructions button', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    fireEvent.click(screen.getByText('Instructions'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/move the tiles in ascending order/)).toBeInTheDocument()
  })

  it('shows leaderboard modal when clicking Leaderboard button', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    fireEvent.click(screen.getByText('Leaderboard'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('🏆 Leaderboard')).toBeInTheDocument()
  })

  it('calls onSelectLevel when clicking an accessible level', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    // Click 2x2 level (should be accessible)
    fireEvent.click(screen.getByText('2x2'))
    expect(mockSelectLevel).toHaveBeenCalledWith(2)
  })

  it('does not call onSelectLevel when clicking an inaccessible level', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    // Click 4x4 level (should be inaccessible initially)
    fireEvent.click(screen.getByText('4x4'))
    expect(mockSelectLevel).not.toHaveBeenCalled()
  })

  it('shows score for completed levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    // 2x2 should show score
    expect(screen.getByText('Score: 1')).toBeInTheDocument()
  })
})