import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '.'

describe('<App />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the initial game state correctly', () => {
    render(<App />)
    
    // Title should be present
    expect(screen.getByText('Sliding Puzzle Game')).toBeInTheDocument()
    
    // Initial controls should be visible
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    
    // Game stats should not be visible initially
    expect(screen.queryByTestId('game-stats')).not.toBeInTheDocument()
  })

  it('should handle level selection', () => {
    render(<App />)
    
    // Select level 2
    const level2Button = screen.getByTestId('level-2')
    fireEvent.click(level2Button)
    
    // Game controls should be visible
    expect(screen.getByText('Levels')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Solve')).toBeInTheDocument()
    
    // Game stats should be visible with 0 moves
    expect(screen.getByTestId('moves-display')).toHaveTextContent('0')
  })

  it('should handle game controls navigation', () => {
    render(<App />)
    
    // Start game
    const level2Button = screen.getByTestId('level-2')
    fireEvent.click(level2Button)
    
    // Return to level selection
    const levelsButton = screen.getByText('Levels')
    fireEvent.click(levelsButton)
    
    // Should show initial controls again
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
  })

  it('should open and close instructions dialog', () => {
    render(<App />)
    
    // Open instructions
    const instructionsButton = screen.getByText('Instructions')
    fireEvent.click(instructionsButton)
    
    // Dialog should be visible
    expect(screen.getByRole('heading', { name: 'Instructions' })).toBeInTheDocument()
    
    // Close dialog
    const gotItButton = screen.getByText('Got it')
    fireEvent.click(gotItButton)
    
    // Dialog should be closed
    expect(screen.queryByRole('heading', { name: 'Instructions' })).not.toBeInTheDocument()
  })

  it('should handle solve confirmation dialog', () => {
    render(<App />)
    
    // Start game
    const level2Button = screen.getByTestId('level-2')
    fireEvent.click(level2Button)
    
    // Click solve
    const solveButton = screen.getByText('Solve')
    fireEvent.click(solveButton)
    
    // Confirmation dialog should be visible
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('Your game result will not be recorded!')).toBeInTheDocument()
    
    // Cancel solve
    const cancelButton = screen.getByText('No, I will try harder')
    fireEvent.click(cancelButton)
    
    // Dialog should be closed
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
  })

  it('should reset moves when starting new game', () => {
    render(<App />)
    
    // Start game
    const level2Button = screen.getByTestId('level-2')
    fireEvent.click(level2Button)
    
    // Check if game stats are visible after starting game
    expect(screen.getByTestId('moves-display')).toHaveTextContent('0')
    
    // Return to levels
    const levelsButton = screen.getByText('Levels')
    fireEvent.click(levelsButton)
    
    // Wait for level selection to be visible
    expect(screen.getByTestId('level-3')).toBeInTheDocument()
    
    // Start new game
    const level3Button = screen.getByTestId('level-3')
    fireEvent.click(level3Button)
    
    // Check moves were reset in new game
    expect(screen.getByTestId('moves-display')).toHaveTextContent('0')
  })
})
