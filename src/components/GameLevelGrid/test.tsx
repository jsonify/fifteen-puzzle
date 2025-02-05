// src/components/GameLevelGrid/test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameLevelGrid from '.'

describe('<GameLevelGrid />', () => {
  const mockSelectLevel = vi.fn()

  beforeEach(() => {
    mockSelectLevel.mockClear()
  })

  it('renders the grid with correct number of levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    // Should have 8 levels (2x2 through 9x9) plus Instructions and Leaderboard buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
  })

  it('shows instructions modal when clicking Instructions button', async () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    fireEvent.click(screen.getByText('Instructions'))
    
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText(/move the tiles in ascending order/)).toBeInTheDocument()
    })
  })

  it('shows leaderboard modal when clicking Leaderboard button', async () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    fireEvent.click(screen.getByText('Leaderboard'))
    
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('🏆 Leaderboard')).toBeInTheDocument()
    })
  })

  it('calls onSelectLevel when clicking an accessible level', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    fireEvent.click(screen.getByText('2x2'))
    expect(mockSelectLevel).toHaveBeenCalledWith(2)
  })

  it('does not render control buttons when playing', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={2} />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(8)
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument()
    expect(screen.queryByText('Leaderboard')).not.toBeInTheDocument()
  })

  it('disables inaccessible levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />)
    
    const button4x4 = screen.getByText('4x4').closest('button')
    expect(button4x4).toBeDisabled()
    
    fireEvent.click(button4x4!)
    expect(mockSelectLevel).not.toHaveBeenCalled()
  })
})