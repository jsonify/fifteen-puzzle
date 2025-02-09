// src/components/GameLevelGrid/test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameLevelGrid from '.'
import { LeaderboardManager } from '@/lib/LeaderboardManager'

// Mock LeaderboardManager
vi.mock('@/lib/LeaderboardManager', () => {
  return {
    LeaderboardManager: class {
      getScoreForLevel(level: number) {
        const scores = {
          2: 1,
          3: null
        };
        return scores[level as keyof typeof scores] || null;
      }

      isLevelUnlocked(level: number) {
        return level <= 3;
      }
    }
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

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
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />);
    
    // Check for mocked score of 1 on the 2x2 level
    const level2Button = screen.getByTestId('level-2');
    expect(level2Button).toHaveTextContent('Score: 1');
  });

  it('displays persisted scores for completed levels', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />);
    
    // Verify the 2x2 level shows score of 1
    const level2Button = screen.getByTestId('level-2');
    expect(level2Button).toHaveTextContent('Score: 1');
    
    // Also verify that other levels don't show scores
    const level3Button = screen.getByTestId('level-3');
    expect(level3Button).not.toHaveTextContent('Score:');
  });

  it('does not display scores for levels without completion', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />);
    
    // 3x3 and up should not have scores
    const level3Button = screen.getByTestId('level-3');
    expect(level3Button).not.toHaveTextContent('Score:');
  });
  
  it('renders all levels correctly', () => {
    render(<GameLevelGrid onSelectLevel={mockSelectLevel} currentLevel={0} />);
    
    // Should have 8 levels (2x2 through 9x9)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);

    // First level (2x2) should be enabled and show score
    expect(buttons[0]).toBeEnabled();
    expect(buttons[0]).toHaveTextContent('2x2');
    expect(buttons[0]).toHaveTextContent('Score: 1');

    // Second level (3x3) should be enabled but no score
    expect(buttons[1]).toBeEnabled();
    expect(buttons[1]).toHaveTextContent('3x3');
    expect(buttons[1]).not.toHaveTextContent('Score:');

    // Rest should be disabled
    for (let i = 2; i < buttons.length; i++) {
      expect(buttons[i]).toBeDisabled();
    }
  });
})