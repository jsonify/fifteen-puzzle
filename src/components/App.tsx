// src/components/App.tsx
import React, { useState } from 'react'
import { GameBoard } from './GameBoard'
import { LevelGrid } from './LevelGrid'

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [moves, setMoves] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header - always visible */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Sliding Puzzle Game
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            A classic sliding puzzle game built with React and TypeScript
          </p>
        </div>

        {/* Game Controls */}
        <div className="flex gap-4 mb-6">
          {currentLevel === 0 ? (
            <>
              <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded">
                Instructions
              </button>
              <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded">
                Leaderboard
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setCurrentLevel(0)
                  setMoves(0)
                }}
                className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded"
              >
                Levels
              </button>
              <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded">
                Save
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-300 py-2 rounded" disabled>
                Load
              </button>
              <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded">
                Solve
              </button>
            </>
          )}
        </div>

        {/* Main Game Area */}
        <div className="w-full aspect-square border-2 border-blue-500 rounded bg-gray-50 mb-6">
          {currentLevel === 0 ? (
            <LevelGrid onSelectLevel={setCurrentLevel} />
          ) : (
            <GameBoard 
              size={currentLevel} 
              moves={moves}
              onMove={() => setMoves(m => m + 1)}
            />
          )}
        </div>

        {/* Game Stats */}
        {currentLevel > 0 && (
          <div className="text-center space-y-1">
            <p>Moves: {moves}</p>
            <p>Best Score ({currentLevel}x{currentLevel}): -</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App