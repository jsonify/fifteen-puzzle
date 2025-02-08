// src/components/Leaderboard/test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Leaderboard } from '.'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

describe('Leaderboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state correctly', () => {
    render(<Leaderboard open={true} onOpenChange={() => {}} />)
    
    const emptyState = screen.getByTestId('empty-state')
    expect(emptyState).toHaveTextContent('No scores recorded yet')
  })

  it('displays leaderboard entries correctly', () => {
    const leaderboardManager = new LeaderboardManager()
    leaderboardManager.saveScore(2, 10, 'Player 1')
    leaderboardManager.saveScore(3, 20, 'Player 2')

    render(<Leaderboard open={true} onOpenChange={() => {}} />)

    expect(screen.getByText('2x2')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('3x3')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
  })

  it('closes when clicking outside', async () => {
    const onOpenChange = vi.fn()
    render(<Leaderboard open={true} onOpenChange={onOpenChange} />)

    // Find the close button instead of the overlay
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
    
    fireEvent.click(closeButton)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})