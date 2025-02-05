// src/components/GameBoard/index.tsx
import { useState } from 'react'

interface GameBoardProps {
  size: number
  moves: number
  onMove: () => void
}

export function GameBoard({ size, moves, onMove }: GameBoardProps) {
  const [tiles, setTiles] = useState(() => {
    // Initialize tiles for the game
    const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
    return [...numbers, null]
  })

  // Calculate grid layout
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    gap: '2px',
    padding: '2px',
    height: '100%'
  }

  return (
    <div style={gridStyle}>
      {tiles.map((number, index) => (
        <button
          key={index}
          onClick={() => {
            // Add move logic here
            onMove()
          }}
          className={`
            aspect-square border-2 rounded
            flex items-center justify-center text-2xl font-semibold
            ${number 
              ? 'border-blue-500 text-blue-500 bg-white hover:bg-blue-50' 
              : 'border-none bg-transparent'
            }
          `}
        >
          {number}
        </button>
      ))}
    </div>
  )
}

