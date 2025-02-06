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
    expect(screen.getByText('No scores recorded yet')).toBeInTheDocument()
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

  it('closes when clicking outside', () => {
    const onOpenChange = vi.fn()
    render(<Leaderboard open={true} onOpenChange={onOpenChange} />)

    // Click the backdrop
    const backdrop = document.querySelector('[data-backdrop]')
    fireEvent.click(backdrop!)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})