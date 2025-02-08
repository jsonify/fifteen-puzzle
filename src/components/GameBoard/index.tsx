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
  forceWin = false // Default value
}: GameBoardProps) {
  const [tiles, setTiles] = useState<(number | null)[]>([])
  const [isVictory, setIsVictory] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

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

    const emptyRowFromBottom = size - Math.floor(board.indexOf(null) / size)

    if (size % 2 === 0) {
      return (inversions + emptyRowFromBottom) % 2 === 0
    }
    
    return inversions % 2 === 0
  }

  // Initialize or reset the game board
  useEffect(() => {
    const generateBoard = () => {
      const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
      let board
      do {
        board = [...numbers, null].sort(() => Math.random() - 0.5)
      } while (!isSolvable(board) || isInWinningState(board))
      return board
    }
    
    setTiles(generateBoard())
    setIsVictory(false)
    setIsInitialized(true)
  }, [size])

  // Helper function to check if board is in winning state
  const isInWinningState = (board: (number | null)[]) => {
    return board.every((tile, index) => {
      if (index === board.length - 1) return tile === null;
      return tile === index + 1;
    });
  }

  // Check if a move is valid
  const isValidMove = (index: number): boolean => {
    const emptyIndex = tiles.indexOf(null)
    if (index === emptyIndex) return false
    
    const row = Math.floor(index / size)
    const col = index % size
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size

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