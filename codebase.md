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
import Avatar from 'components/Avatar'
import logo from 'assets/logo.svg'

const randoms = [
  [1, 2],
  [3, 4, 5],
  [6, 7]
]

function App() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="h-screen sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <div className="my-4">
              <Avatar size="large" src={logo} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome!
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              This is a boilerplate build with Vite, React 18, TypeScript,
              Vitest, Testing Library, TailwindCSS 3, Eslint and Prettier.
            </p>
          </div>
          <div className="my-10">
            <a
              href="vscode://"
              className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
            >
              Start building for free
            </a>
            <div
              aria-hidden="true"
              className="pointer-events-none mt-10 md:mt-0 lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
            >
              <div className="absolute sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  {randoms.map((random, number) => (
                    <div
                      key={`random-${random[number]}`}
                      className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                    >
                      {random.map((number) => (
                        <div
                          key={`random-${number}`}
                          className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100"
                        >
                          <img
                            src={`https://picsum.photos/600?random=${number}`}
                            alt=""
                            className="size-full bg-indigo-100 object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

```

# src/components/Avatar/__snapshots__/test.tsx.snap

```snap
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`<Avatar /> > should render the empty Avatar 1`] = `
<span
  class="inline-block overflow-hidden bg-gray-100 rounded-full w-12 h-12"
  data-testid="empty-avatar"
>
  <svg
    class="size-full text-gray-300"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
</span>
`;

exports[`<Avatar /> > should render the large Avatar 1`] = `
<img
  alt="Avatar"
  class="inline-block rounded-full w-14 h-14"
  src="https://gravatar.com/4405735f6f3129e0286d9d43e7b460d0"
/>
`;

exports[`<Avatar /> > should render the medium Avatar as default 1`] = `
<img
  alt="Avatar"
  class="inline-block rounded-full w-12 h-12"
  src="https://gravatar.com/4405735f6f3129e0286d9d43e7b460d0"
/>
`;

exports[`<Avatar /> > should render the small Avatar 1`] = `
<img
  alt="Avatar"
  class="inline-block rounded-full w-10 h-10"
  src="https://gravatar.com/4405735f6f3129e0286d9d43e7b460d0"
/>
`;

```

# src/components/Avatar/index.tsx

```tsx
import { classNames } from 'utils'

type Size = 'small' | 'medium' | 'large'

type AvatarProps = {
  size?: Size
  src?: string
  alt?: string
}

const sizes: Record<Size, string> = {
  small: 'w-10 h-10',
  medium: 'w-12 h-12',
  large: 'w-14 h-14'
}

const EmptyAvatar = ({ size = 'medium' }: Pick<AvatarProps, 'size'>) => (
  <span
    data-testid="empty-avatar"
    className={classNames(
      'inline-block overflow-hidden bg-gray-100 rounded-full',
      sizes[size]
    )}
  >
    <svg
      className="size-full text-gray-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </span>
)

export default function Avatar({ size = 'medium', src, alt }: AvatarProps) {
  if (!src) {
    return <EmptyAvatar size={size} />
  }

  return (
    <img
      className={classNames('inline-block rounded-full', sizes[size])}
      src={src}
      alt={alt}
    />
  )
}

```

# src/components/Avatar/test.tsx

```tsx
import { render, screen } from '@testing-library/react'

import Avatar from '.'

describe('<Avatar />', () => {
  const props = {
    src: 'https://gravatar.com/4405735f6f3129e0286d9d43e7b460d0',
    alt: 'Avatar'
  }

  it('should render the medium Avatar as default', () => {
    const { container } = render(<Avatar {...props} />)

    expect(screen.getByRole('img', { name: /Avatar/i })).toBeInTheDocument()

    expect(container.firstChild).toHaveClass(
      'inline-block w-12 h-12 rounded-full'
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render the small Avatar', () => {
    const { container } = render(<Avatar size="small" {...props} />)

    expect(screen.getByRole('img', { name: /Avatar/i })).toBeInTheDocument()

    expect(container.firstChild).toHaveClass(
      'inline-block w-10 h-10 rounded-full'
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render the medium Avatar', () => {
    const { container } = render(<Avatar size="medium" {...props} />)

    expect(screen.getByRole('img', { name: /Avatar/i })).toBeInTheDocument()

    expect(container.firstChild).toHaveClass(
      'inline-block w-12 h-12 rounded-full'
    )
  })

  it('should render the large Avatar', () => {
    const { container } = render(<Avatar size="large" {...props} />)

    expect(screen.getByRole('img', { name: /Avatar/i })).toBeInTheDocument()

    expect(container.firstChild).toHaveClass(
      'inline-block w-14 h-14 rounded-full'
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render the empty Avatar', () => {
    const { container } = render(<Avatar />)

    expect(screen.getByTestId('empty-avatar')).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})

```

# src/components/test.tsx

```tsx
import { render, screen } from '@testing-library/react'

import App from './App'

describe('<App />', () => {
  it('should render the App', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /Welcome!/i,
        level: 1
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /This is a boilerplate build with Vite, React 18, TypeScript, Vitest, Testing Library, TailwindCSS 3, Eslint and Prettier./i
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /start building for free/i
      })
    ).toBeInTheDocument()

    expect(screen.getByRole('img')).toBeInTheDocument()

    expect(container.firstChild).toBeInTheDocument()
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

