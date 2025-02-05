# .editorconfig

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

# .eslintrc

```
{
  "env": {
    "browser": true,
    "es2020": true,
    "jest": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["react", "react-hooks", "@typescript-eslint", "tailwindcss"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/no-contradicting-classname": "error"
  }
}

```

# .github/ISSUE_TEMPLATE/bug_report.md

```md
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.

```

# .github/ISSUE_TEMPLATE/feature_request.md

```md
---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

```

# .gitignore

```
dist
dist-ssr
*.local

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

```

# .prettierrc

```
{
  "trailingComma": "none",
  "semi": false,
  "singleQuote": true
}

```

# .vitest/setup.ts

```ts
import '@testing-library/jest-dom/vitest'

```

# .vscode/extensions.json

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig",
    "stivo.tailwind-fold",
    "vitest.explorer"
  ]
}

```

# .vscode/settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}

```

# index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React 18, TypeScript, Jest, Testing Library, TailwindCSS 3, Vite, Eslint and Prettier boilerplate</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>

```

# package.json

```json
{
  "name": "reactjs-vite-tailwindcss-boilerplate",
  "description": "This is a boilerplate build with Vite, React 18, TypeScript, Vitest, Testing Library, TailwindCSS 3, Eslint and Prettier.",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "author": {
    "name": "João Paulo Moraes",
    "email": "joaopaulomoraes@outlook.com",
    "url": "https://github.com/joaopaulomoraes"
  },
  "bugs": {
    "url": "https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate/issues",
    "email": "joaopaulomoraes@outlook.com"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src --max-warnings=0",
    "typecheck": "tsc --project tsconfig.json --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^14.3.1",
    "@types/node": "^20.17.16",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react-swc": "^3.7.2",
    "@vitest/ui": "^1.6.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.3",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-tailwindcss": "^3.18.0",
    "happy-dom": "^15.11.7",
    "postcss": "^8.5.1",
    "prettier": "3.1.1",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^5.4.14",
    "vite-tsconfig-paths": "^4.3.2",
    "vitest": "^1.6.0"
  }
}

```

# postcss.config.mjs

```mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

```

# public/favicon.svg

This is a file of the type: SVG Image

# public/robots.txt

```txt

User-Agent: *
Allow: /

```

# README.md

```md
![reactjs-vite-tailwindcss-boilerplate](https://user-images.githubusercontent.com/16243531/217138979-b854309c-4742-4275-a705-f9fec5158217.jpg)

# React Tailwindcss Boilerplate build with Vite

This is a boilerplate build with Vite, React 18, TypeScript, Vitest, Testing Library, TailwindCSS 3, Eslint and Prettier.

## What is inside?

This project uses many tools like:

- [Vite](https://vitejs.dev)
- [ReactJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Tailwindcss](https://tailwindcss.com)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)

## Getting Started

### Install

Create the project.

\`\`\`bash
pnpm dlx degit joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate my-app
\`\`\`

Access the project directory.

\`\`\`bash
cd my-app
\`\`\`

Install dependencies.

\`\`\`bash
pnpm install
\`\`\`

Serve with hot reload at <http://localhost:5173>.

\`\`\`bash
pnpm run dev
\`\`\`

### Lint

\`\`\`bash
pnpm run lint
\`\`\`

### Typecheck

\`\`\`bash
pnpm run typecheck
\`\`\`

### Build

\`\`\`bash
pnpm run build
\`\`\`

### Test

\`\`\`bash
pnpm run test
\`\`\`

View and interact with your tests via UI.

\`\`\`bash
pnpm run test:ui
\`\`\`

## License

This project is licensed under the MIT License.

```

# src/assets/logo.svg

This is a file of the type: SVG Image

# src/components/App.tsx

```tsx
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
```

# src/components/SlidingPuzzle/index.tsx

```tsx
import { useState, useEffect, useCallback } from 'react';

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
```

# src/components/SlidingPuzzle/test.tsx

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SlidingPuzzle from './index'

describe('<SlidingPuzzle />', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should render the puzzle board', () => {
    render(<SlidingPuzzle />)

    // Check for main components
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
    expect(screen.getByText(/Moves:/)).toBeInTheDocument()
    expect(screen.getByText('New Game')).toBeInTheDocument()
    
    // Initial 2x2 board should have 3 numbered cells (1-3) and one empty
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    expect(buttons).toHaveLength(3)
  })

  it('should allow changing the puzzle size', () => {
    render(<SlidingPuzzle />)

    // Change to 3x3 puzzle
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '3' } })

    // Should now have 8 numbered cells (1-8)
    const buttons = screen.getAllByRole('button').filter(button => /^[1-8]$/.test(button.textContent || ''))
    expect(buttons).toHaveLength(8)
  })

  it('should track moves', async () => {
    render(<SlidingPuzzle />)

    // Initial move count should be 0
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()

    // Find a valid move by looking for a button next to the empty space
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    fireEvent.click(buttons[0])

    // Move count should increase after valid move
    await waitFor(() => {
      expect(screen.queryByText('Moves: 0')).not.toBeInTheDocument()
    })
  })

  it('should store best scores in localStorage', () => {
    const mockLocalStorage = {
      puzzleBestScores: JSON.stringify({
        '2': 5,
        '3': 10
      })
    }
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => mockLocalStorage[key]),
        setItem: vi.fn()
      },
      writable: true
    })

    render(<SlidingPuzzle />)

    // Should display the best score for 2x2 puzzle
    expect(screen.getByText('Best Score (2x2): 5')).toBeInTheDocument()
  })

  it('should start new game when button clicked', async () => {
    render(<SlidingPuzzle />)

    // Make a move
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    fireEvent.click(buttons[0])

    // Click new game
    const newGameButton = screen.getByText('New Game')
    fireEvent.click(newGameButton)

    // Move count should reset to 0
    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })
  })

  it('should check for valid moves only', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<SlidingPuzzle />)

    // Track initial move count
    const initialMoveCount = screen.getByText(/Moves:/).textContent

    // Try clicking all buttons
    const buttons = screen.getAllByRole('button').filter(button => /^[1-3]$/.test(button.textContent || ''))
    buttons.forEach(button => {
      fireEvent.click(button)
    })

    // At least one button should not have caused a move (not adjacent to empty space)
    const finalMoveCount = screen.getByText(/Moves:/).textContent
    expect(finalMoveCount).not.toBe(`Moves: ${buttons.length}`)
  })
})
```

# src/components/test.tsx

```tsx
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
```

# src/index.tsx

```tsx
import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from 'components/App'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)

```

# src/utils/index.ts

```ts
export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

```

# tailwind.config.mjs

```mjs
/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

```

# vite.config.ts

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})

```

