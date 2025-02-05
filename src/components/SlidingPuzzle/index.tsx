import React, { useState, useEffect, useCallback } from 'react'
import GameLevelGrid from '../GameLevelGrid'

interface Position {
  row: number
  col: number
}

interface Cell {
  value: number | null
  position: Position
}

const SlidingPuzzle = () => {
  const [gameLevel, setGameLevel] = useState(2)
  const [cells, setCells] = useState<Cell[]>([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [bestScores, setBestScores] = useState<Record<number, number>>({})

  // Check if a move is valid
  const isValidMove = (index: number): boolean => {
    const emptyIndex = cells.findIndex(cell => cell.value === null)
    const emptyPos = cells[emptyIndex].position
    const clickedPos = cells[index].position

    return (
      (Math.abs(emptyPos.row - clickedPos.row) === 1 && emptyPos.col === clickedPos.col) ||
      (Math.abs(emptyPos.col - clickedPos.col) === 1 && emptyPos.row === clickedPos.row)
    )
  }

  // Calculate if the puzzle is solved
  const checkWin = useCallback(() => {
    return cells.every((cell, index) => {
      if (index === cells.length - 1) return cell.value === null
      return cell.value === index + 1
    })
  }, [cells])

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (isComplete || !isValidMove(index)) return

    const newCells = [...cells]
    const emptyIndex = cells.findIndex(cell => cell.value === null)

    // Swap cells
    const temp = newCells[index].value
    newCells[index].value = null
    newCells[emptyIndex].value = temp

    setCells(newCells)
    setMoves(prev => prev + 1)

    // Check for win condition
    if (checkWin()) {
      handleWin()
    }
  }

  // Handle win condition
  const handleWin = () => {
    setIsComplete(true)
    const currentBest = bestScores[gameLevel] || Infinity
    if (moves < currentBest) {
      setBestScores(prev => ({
        ...prev,
        [gameLevel]: moves
      }))
      localStorage.setItem('puzzleBestScores', JSON.stringify({
        ...bestScores,
        [gameLevel]: moves
      }))
    }
  }

  // Initialize the game board
  const initializeGame = useCallback(() => {
    const totalCells = gameLevel * gameLevel
    const numbers = Array.from({ length: totalCells - 1 }, (_, i) => i + 1)
    
    // Shuffle numbers ensuring puzzle is solvable
    let shuffled
    do {
      shuffled = [...numbers, null].sort(() => Math.random() - 0.5)
    } while (!isSolvable(shuffled, gameLevel))

    const newCells = shuffled.map((value, index) => ({
      value,
      position: {
        row: Math.floor(index / gameLevel),
        col: index % gameLevel
      }
    }))

    setCells(newCells)
    setMoves(0)
    setIsComplete(false)
  }, [gameLevel])

  // Check if puzzle configuration is solvable
  const isSolvable = (board: (number | null)[], size: number): boolean => {
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

  // Load best scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('puzzleBestScores')
    if (savedScores) {
      setBestScores(JSON.parse(savedScores))
    }
  }, [])

  // Initialize game when level changes
  useEffect(() => {
    initializeGame()
  }, [gameLevel, initializeGame])

  return (
    <div className="flex flex-col items-center p-4">
      <GameLevelGrid 
        onSelectLevel={level => {
          setGameLevel(level)
          initializeGame()
        }}
        currentLevel={gameLevel}
      />

      {/* Game Board */}
      <div 
        className="relative mt-8 bg-gray-100 rounded-lg"
        style={{
          width: '300px',
          height: '300px'
        }}
      >
        {cells.map((cell, index) => (
          cell.value !== null && (
            <button
              key={cell.value}
              onClick={() => handleCellClick(index)}
              className={`
                absolute transition-all duration-200 
                bg-white border-2 border-blue-500 rounded-lg
                flex items-center justify-center text-xl font-bold text-blue-500
                hover:bg-blue-50 focus:outline-none
                ${isValidMove(index) ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              style={{
                width: `${100/gameLevel}%`,
                height: `${100/gameLevel}%`,
                left: `${cell.position.col * (100/gameLevel)}%`,
                top: `${cell.position.row * (100/gameLevel)}%`
              }}
              disabled={!isValidMove(index)}
            >
              {cell.value}
            </button>
          )
        ))}
      </div>

      {/* Game Stats */}
      <div className="mt-6 text-center">
        <p className="text-lg">Moves: {moves}</p>
        <p className="text-sm text-gray-600">
          Best Score ({gameLevel}x{gameLevel}): {bestScores[gameLevel] || '-'}
        </p>
        {isComplete && (
          <div className="mt-4">
            <p className="text-xl font-bold text-green-600">Puzzle Solved! 🎉</p>
            <button
              onClick={initializeGame}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlidingPuzzle