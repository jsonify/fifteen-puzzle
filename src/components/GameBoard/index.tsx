// src/components/GameBoard/index.tsx
import { useState, useEffect } from 'react'

interface GameBoardProps {
  size: number
  moves: number
  onMove: () => void
}

export function GameBoard({ size, moves, onMove }: GameBoardProps) {
  const [tiles, setTiles] = useState<(number | null)[]>([])

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

  useEffect(() => {
    const generateBoard = () => {
      const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
      let board
      do {
        board = [...numbers, null].sort(() => Math.random() - 0.5)
      } while (!isSolvable(board))
      return board
    }
    setTiles(generateBoard())
  }, [size])

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

  return (
    <div 
      className="grid gap-0.5 p-0.5 h-full"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
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
        >
          {number}
        </button>
      ))}
    </div>
  )
}