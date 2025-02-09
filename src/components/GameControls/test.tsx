// src/components/GameControls/test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameControls } from '.'

describe('<GameControls />', () => {
  const defaultProps = {
    showGameControls: true,
    onInstructionsClick: vi.fn(),
    onLeaderboardClick: vi.fn(),
    onLevelsClick: vi.fn(),
    onSaveClick: vi.fn(),
    onSolveClick: vi.fn(),
    currentLevel: 0
  }

  beforeEach(() => {
    for (const mockFn of Object.values(defaultProps)) {
      if (typeof mockFn === 'function') {
        mockFn.mockClear()
      }
    }
  })

  it('should render initial controls when currentLevel is 0', () => {
    render(<GameControls {...defaultProps} />)
    
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.queryByText('Levels')).not.toBeInTheDocument()
  })

  it('should render game controls when in active game', () => {
    render(<GameControls {...defaultProps} currentLevel={3} showGameControls={true} />)
    
    expect(screen.getByText('Levels')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Load')).toBeInTheDocument()
    expect(screen.getByText('Solve')).toBeInTheDocument()
  })

  it('should call correct handlers when buttons are clicked', () => {
    render(<GameControls {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Instructions'))
    expect(defaultProps.onInstructionsClick).toHaveBeenCalledTimes(1)
    
    fireEvent.click(screen.getByText('Leaderboard'))
    expect(defaultProps.onLeaderboardClick).toHaveBeenCalledTimes(1)
  })

  it('should call game control handlers when in active game', () => {
    render(<GameControls {...defaultProps} currentLevel={3} showGameControls={true} />)
    
    fireEvent.click(screen.getByText('Levels'))
    expect(defaultProps.onLevelsClick).toHaveBeenCalledTimes(1)
    
    fireEvent.click(screen.getByText('Save'))
    expect(defaultProps.onSaveClick).toHaveBeenCalledTimes(1)
    
    fireEvent.click(screen.getByText('Solve'))
    expect(defaultProps.onSolveClick).toHaveBeenCalledTimes(1)
  })

  it('should have disabled Load button', () => {
    render(<GameControls {...defaultProps} currentLevel={3} showGameControls={true} />)
    
    const loadButton = screen.getByText('Load')
    expect(loadButton).toBeDisabled()
  })

  it('should render correct controls based on showGameControls prop', () => {
    const { rerender } = render(
      <GameControls {...defaultProps} currentLevel={3} showGameControls={false} />
    )
    
    // Should show initial controls when showGameControls is false
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    
    // Rerender with showGameControls true
    rerender(<GameControls {...defaultProps} currentLevel={3} showGameControls={true} />)
    
    // Should show game controls
    expect(screen.getByText('Levels')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })
})