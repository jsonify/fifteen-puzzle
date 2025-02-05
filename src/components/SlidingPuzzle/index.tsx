import React, { useState, useEffect, useCallback } from 'react';

const SlidingPuzzle = () => {
  const [gameLevel, setGameLevel] = useState(2);  // Start with 2x2
  const [cells, setCells] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [bestScores, setBestScores] = useState({});

  const initializeGame = useCallback(() => {
    const totalCells = gameLevel * gameLevel;
    let initialCells = Array.from({length: totalCells - 1}, (_, i) => i + 1);
    initialCells.push('empty');
    
    // Shuffle cells ensuring puzzle is solvable
    let shuffled;
    do {
      shuffled = [...initialCells].sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled, gameLevel));

    setCells(shuffled);
    setMoveCount(0);
  }, [gameLevel]);

  useEffect(() => {
    initializeGame();
    // Load best scores from localStorage
    const savedScores = localStorage.getItem('puzzleBestScores');
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, [initializeGame]);

  const isSolvable = (board, size) => {
    let inversions = 0;
    const emptyPosition = board.indexOf('empty');
    const flatBoard = board.filter(x => x !== 'empty');
    
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }

    if (size % 2 === 0) {
      const emptyRow = Math.floor(emptyPosition / size);
      return (inversions + emptyRow) % 2 === 0;
    }
    
    return inversions % 2 === 0;
  };

  const handleMove = (index) => {
    const emptyIndex = cells.indexOf('empty');
    if (!isValidMove(index, emptyIndex)) return;

    const newCells = [...cells];
    [newCells[index], newCells[emptyIndex]] = [newCells[emptyIndex], newCells[index]];
    setCells(newCells);
    setMoveCount(prev => prev + 1);

    if (isWin(newCells)) {
      handleWin();
    }
  };

  const isValidMove = (index, emptyIndex) => {
    const row = Math.floor(index / gameLevel);
    const col = index % gameLevel;
    const emptyRow = Math.floor(emptyIndex / gameLevel);
    const emptyCol = emptyIndex % gameLevel;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const isWin = (currentCells) => {
    return currentCells.slice(0, -1).every((cell, index) => cell === index + 1);
  };

  const handleWin = () => {
    const currentBest = bestScores[gameLevel] || Infinity;
    if (moveCount < currentBest) {
      const newScores = { ...bestScores, [gameLevel]: moveCount };
      setBestScores(newScores);
      localStorage.setItem('puzzleBestScores', JSON.stringify(newScores));
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Sliding Puzzle</h2>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={initializeGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Game
          </button>
          <select 
            value={gameLevel}
            onChange={(e) => setGameLevel(Number(e.target.value))}
            className="px-4 py-2 border rounded"
          >
            {[2,3,4,5,6].map(level => (
              <option key={level} value={level}>{level}x{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative w-64 h-64 bg-gray-100 rounded-lg p-2">
        <div className="relative w-full h-full">
          {cells.map((cell, index) => (
            cell !== 'empty' && (
              <button
                key={cell}
                onClick={() => handleMove(index)}
                style={{
                  position: 'absolute',
                  width: `${100/gameLevel}%`,
                  height: `${100/gameLevel}%`,
                  left: `${(index % gameLevel) * (100/gameLevel)}%`,
                  top: `${Math.floor(index / gameLevel) * (100/gameLevel)}%`,
                  transition: 'all 0.2s',
                }}
                className="bg-blue-500 text-white rounded m-0.5 flex items-center justify-center hover:bg-blue-600"
              >
                {cell}
              </button>
            )
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg">Moves: {moveCount}</p>
        <p className="text-sm">
          Best Score ({gameLevel}x{gameLevel}): {bestScores[gameLevel] || '-'}
        </p>
      </div>
    </div>
  );
};

export default SlidingPuzzle;