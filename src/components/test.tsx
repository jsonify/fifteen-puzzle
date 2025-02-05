// src/components/test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('<App />', () => {
  it('should render the App with sliding puzzle game', () => {
    render(<App />)

    // Check for main heading
    expect(
      screen.getByRole('heading', { name: /Sliding Puzzle Game/i })
    ).toBeInTheDocument()

    // Should start with level selection (moves counter not visible initially)
    expect(screen.queryByTestId('moves-count')).not.toBeInTheDocument()

    // Select a level (2x2)
    const level2Button = screen.getByText('2x2')
    fireEvent.click(level2Button)

    // Now moves counter should be visible
    expect(screen.getByTestId('moves-count')).toHaveTextContent('0')
  })

  it('should start with level selection view', () => {
    render(<App />)
    expect(screen.getByText('2x2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Instructions' })).toBeInTheDocument()
  })

  it('should reset moves when selecting a new level', () => {
    render(<App />)
    
    // Start game with 2x2
    fireEvent.click(screen.getByText('2x2'))
    expect(screen.getByTestId('moves-count')).toHaveTextContent('0')

    // Make some moves (simulated by modifying moves count)
    fireEvent.click(screen.getByRole('button', { name: 'Levels' }))
    
    // Return to level selection should reset moves
    expect(screen.queryByTestId('moves-count')).not.toBeInTheDocument()
    
    // Select a new level
    fireEvent.click(screen.getByText('3x3'))
    
    // Moves should be reset
    expect(screen.getByTestId('moves-count')).toHaveTextContent('0')
  })

  it('should show appropriate controls based on game state', () => {
    render(<App />)
    
    // Initial state should show Instructions and Leaderboard
    expect(screen.getByRole('button', { name: 'Instructions' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leaderboard' })).toBeInTheDocument()
    
    // Start game
    fireEvent.click(screen.getByText('2x2'))
    
    // Should now show game controls
    expect(screen.getByRole('button', { name: 'Levels' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solve' })).toBeInTheDocument()
  })
})