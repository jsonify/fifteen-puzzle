import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  it('should render the App with sliding puzzle game', () => {
    render(<App />)

    // Check for main heading
    expect(
      screen.getByRole('heading', {
        name: /Sliding Puzzle Game/i,
        level: 1
      })
    ).toBeInTheDocument()

    // Check for game description
    expect(
      screen.getByText(
        /A classic sliding puzzle game built with React and TypeScript/i
      )
    ).toBeInTheDocument()

    // Verify SlidingPuzzle component is rendered
    expect(screen.getByText(/Moves:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Game/i })).toBeInTheDocument()
  })
})