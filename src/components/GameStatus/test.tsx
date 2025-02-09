// src/components/GameStatus/test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GameStatus } from '.'

describe('<GameStatus />', () => {
  const defaultProps = {
    currentLevel: 3,
    moves: 10,
    isVisible: true
  }

  it('should render game stats when visible', () => {
    render(<GameStatus {...defaultProps} />)
    
    expect(screen.getByTestId('game-stats')).toBeInTheDocument()
    expect(screen.getByTestId('moves-display')).toHaveTextContent('10')
    expect(screen.getByText('Best Score (3x3): -')).toBeInTheDocument()
  })

  it('should not render when isVisible is false', () => {
    render(<GameStatus {...defaultProps} isVisible={false} />)
    
    expect(screen.queryByTestId('game-stats')).not.toBeInTheDocument()
  })

  it('should not render when currentLevel is 0', () => {
    render(<GameStatus {...defaultProps} currentLevel={0} />)
    
    expect(screen.queryByTestId('game-stats')).not.toBeInTheDocument()
  })

  it('should update moves display when moves prop changes', () => {
    const { rerender } = render(<GameStatus {...defaultProps} />)
    
    expect(screen.getByTestId('moves-display')).toHaveTextContent('10')
    
    rerender(<GameStatus {...defaultProps} moves={15} />)
    
    expect(screen.getByTestId('moves-display')).toHaveTextContent('15')
  })

  it('should display correct level in best score text', () => {
    const { rerender } = render(<GameStatus {...defaultProps} />)
    
    expect(screen.getByText('Best Score (3x3): -')).toBeInTheDocument()
    
    rerender(<GameStatus {...defaultProps} currentLevel={4} />)
    
    expect(screen.getByText('Best Score (4x4): -')).toBeInTheDocument()
  })
})
