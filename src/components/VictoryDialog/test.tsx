import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VictoryDialog } from '.'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

vi.mock('@/lib/LeaderboardManager', () => {
  return {
    LeaderboardManager: class {
      saveScore = vi.fn()
    }
  }
})

describe('VictoryDialog', () => {
  it('should allow entering name and saving score', () => {
    const mockOnOpenChange = vi.fn()
    const mockOnPlayAgain = vi.fn()

    render(
      <VictoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        level={2}
        moves={10}
        onPlayAgain={mockOnPlayAgain}
      />
    )

    // Check if dialog content is visible
    expect(screen.getByText('🎉 Puzzle Solved!')).toBeInTheDocument()
    expect(screen.getByText('Congratulations! You solved the 2x2 puzzle in 10 moves.')).toBeInTheDocument()

    // Enter name and submit
    const input = screen.getByPlaceholderText('Enter your name')
    fireEvent.change(input, { target: { value: 'Test Player' } })
    
    const submitButton = screen.getByText('Save Score')
    fireEvent.click(submitButton)

    // Verify form submission
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    expect(mockOnPlayAgain).toHaveBeenCalled()
  })

  it('should not save if name is empty', () => {
    const mockOnOpenChange = vi.fn()
    const mockOnPlayAgain = vi.fn()

    render(
      <VictoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        level={2}
        moves={10}
        onPlayAgain={mockOnPlayAgain}
      />
    )

    // Try to submit without entering name
    const form = screen.getByRole('form')
    fireEvent.submit(form)

    // Verify form was not submitted
    expect(mockOnOpenChange).not.toHaveBeenCalled()
    expect(mockOnPlayAgain).not.toHaveBeenCalled()
  })

  it('should allow skipping score save', () => {
    const mockOnOpenChange = vi.fn()
    const mockOnPlayAgain = vi.fn()

    render(
      <VictoryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        level={2}
        moves={10}
        onPlayAgain={mockOnPlayAgain}
      />
    )

    const skipButton = screen.getByRole('button', { name: 'Skip' })
    fireEvent.click(skipButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    expect(mockOnPlayAgain).toHaveBeenCalled()
  })
})
