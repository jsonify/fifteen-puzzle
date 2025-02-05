import SlidingPuzzle from './SlidingPuzzle'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Sliding Puzzle Game
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            A classic sliding puzzle game built with React and TypeScript
          </p>
        </div>
        <div className="mt-10">
          <SlidingPuzzle />
        </div>
      </div>
    </div>
  )
}

export default App