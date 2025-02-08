// src/components/GameBoard/index.tsx
import { useState, useEffect, useCallback } from 'react'

interface GameBoardProps {
  size: number
  moves: number
  onMove: () => void
  onVictory: () => void
  onNextLevel: () => void
  onRetry: () => void
  onChooseLevel: () => void
  forceWin?: boolean // Prop for testing
}

export function GameBoard({ 
  size, 
  moves, 
  onMove, 
  onVictory,
  onNextLevel,
  onRetry,
  onChooseLevel,
  forceWin = false
}: GameBoardProps) {
  const [tiles, setTiles] = useState<(number | null)[]>([])
  const [isVictory, setIsVictory] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const countInversions = (board: (number | null)[] | number[]): number => {
    const numbers = board.filter((x): x is number => x !== null)
    let inversions = 0
    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] > numbers[j]) inversions++
      }
    }
    return inversions
  }
  // Generate a guaranteed solvable 2x2 board
  const generateSolvable2x2Board = (): (number | null)[] => {
    // For 2x2, we can use these known solvable configurations:
    const solvableConfigs = [
      [null, 3, 2, 1],  // 3 inversions + row 0 = 3 (odd)
      [3, null, 2, 1],  // 2 inversions + row 0 = 2 (even)
      [3, 2, null, 1],  // 2 inversions + row 1 = 3 (odd)
      [3, 2, 1, null],  // 3 inversions + row 1 = 4 (even)
    ]
    
    // Pick a random configuration
    const chosenConfig = solvableConfigs[Math.floor(Math.random() * solvableConfigs.length)]
    
    // Verify solvability before returning
    const emptyIndex = chosenConfig.indexOf(null)
    const emptyRow = Math.floor(emptyIndex / 2)
    const inversions = countInversions(chosenConfig.filter((x): x is number => x !== null))
    
    if ((inversions + emptyRow) % 2 !== 0) {
      // If somehow not solvable, return a known good configuration
      return [3, null, 2, 1]
    }
    
    return chosenConfig
  }
  // Force victory state for testing
  useEffect(() => {
    if (forceWin) {
      console.log('Setting victory state from forceWin prop');
      setIsVictory(true)
      onVictory()
    }
  }, [forceWin, onVictory])

  // Check if the puzzle is solvable
  const isSolvable = (board: (number | null)[]): boolean => {
    const flatBoard = board.filter((x): x is number => x !== null)
    let inversions = 0
    
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] > flatBoard[j]) inversions++
      }
    }

    // For 2x2 puzzles, we need special handling
    if (size === 2) {
      const emptyRow = Math.floor(board.indexOf(null) / size)
      return (inversions + emptyRow) % 2 === 0
    }

    // For larger puzzles, use standard solvability check
    const emptyRowFromBottom = size - Math.floor(board.indexOf(null) / size)
    
    if (size % 2 === 0) {
      return (inversions + emptyRowFromBottom) % 2 === 0
    }
    
    return inversions % 2 === 0
  }

  // Initialize or reset the game board
  useEffect(() => {
    const generateBoard = () => {
      // Special handling for 2x2 puzzles
      if (size === 2) {
        return generateSolvable2x2Board()
      }
      const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
      let board
      let attempts = 0
      const maxAttempts = 1000 // Prevent infinite loop

      do {
        board = [...numbers, null].sort(() => Math.random() - 0.5)
        attempts++
        
        if (attempts >= maxAttempts) {
          // If we can't generate a solvable board randomly, create a known solvable one
          if (size === 2) {
            return [1, 2, null, 3]
          }
          console.warn('Could not generate random solvable board, using fallback')
          return [...numbers, null]
        }
      } while (!isSolvable(board) || isInWinningState(board))

      return board
    }
    
    setTiles(generateBoard())
    setIsVictory(false)
    setIsInitialized(true)
  }, [size])

  // For 2x2 puzzles, we only need to check if we can reach the goal state
  const isValidPosition = (board: (number | null)[]): boolean => {
    if (size === 2) {
      const emptyIndex = board.indexOf(null)
      const inversions = countInversions(board)
      const emptyRow = Math.floor(emptyIndex / 2)
      return (inversions + emptyRow) % 2 === 0
    }
    return isSolvable(board)
  }

  // Helper function to check if board is in winning state
  const isInWinningState = (board: (number | null)[]) => {
    return board.every((tile, index) => {
      if (index === board.length - 1) return tile === null;
      return tile === index + 1;
    });
  }

  // Check if a move is valid
  const isValidMove = (index: number): boolean => {
    if (!isInitialized) return false
    
    const emptyIndex = tiles.indexOf(null)
    if (index === emptyIndex) return false
    
    const row = Math.floor(index / size)
    const col = index % size
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size

    // Only allow moves to adjacent tiles
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    )
  }

  // Check for win condition
  const checkWin = useCallback(() => {
    if (!isInitialized) return false;
    return tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === null;
      return tile === index + 1;
    });
  }, [tiles, isInitialized]);

  // Handle victory state
  const handleVictory = useCallback(() => {
    setIsVictory(true)
    console.log('Victory state:', isVictory);
    onVictory()
  }, [onVictory])

  // Check for win after each move
  useEffect(() => {
    if (isInitialized && checkWin() && !isVictory) {
      handleVictory()
    }
  }, [checkWin, isVictory, handleVictory, isInitialized])

  // Handle tile click
  const handleTileClick = (index: number) => {
    if (!isValidMove(index)) return
    
    const emptyIndex = tiles.indexOf(null)
    const newTiles = [...tiles]
    
    // Swap tiles
    newTiles[emptyIndex] = tiles[index]
    newTiles[index] = null
    
    setTiles(newTiles)
    onMove()
  }

  // Render victory screen
  if (isVictory) {
    console.log('Rendering victory screen');
    return (
      <div className="flex flex-col items-center justify-center h-full text-center" data-testid="victory-screen">
        <div className="mb-8">
          <div className="text-4xl font-bold text-blue-500 mb-2" data-testid="victory-text">Solved!</div>
          <div className="text-2xl">Your result: {moves}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <button
            onClick={onChooseLevel}
            className="flex flex-col items-center p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50"
            data-testid="choose-level-button"
          >
            <span className="text-xl mb-2">Choose level</span>
            <span className="text-4xl">✸</span>
          </button>
          
          <button
            onClick={onRetry}
            className="flex flex-col items-center p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50"
            data-testid="retry-button"
          >
            <span className="text-xl mb-2">Retry again</span>
            <span className="text-4xl">↺</span>
          </button>
          
          <button
            onClick={onNextLevel}
            className="flex flex-col items-center p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50"
            data-testid="next-level-button"
          >
            <span className="text-xl mb-2">Next level</span>
            <span className="text-4xl">▶</span>
          </button>
        </div>
      </div>
    )
  }

  // Render game board
  return (
    <div 
      className="grid gap-0.5 p-0.5 h-full"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      data-testid="game-board"
    >
      {tiles.map((number, index) => (
        <button
          key={index}
          onClick={() => handleTileClick(index)}
          className={`
            aspect-square border-2 rounded
            flex items-center justify-center text-2xl font-semibold
            transition-all duration-200
            ${number 
              ? 'border-blue-500 text-blue-500 bg-white hover:bg-blue-50' 
              : 'border-none bg-transparent cursor-default'
            }
            ${isValidMove(index) ? 'cursor-pointer' : 'cursor-not-allowed'}
          `}
          disabled={!isValidMove(index)}
        >
          {number}
        </button>
      ))}
    </div>
  )
}