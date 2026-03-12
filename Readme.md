# Card Game - Monorepo

A monorepo for developing a card game, including a NestJS API and React frontend.

## 📋 Project Structure

```
card-game/
├── apps/
│   ├── api/                 # NestJS API server
│   └── front/              # React + Vite frontend
├── packages/
│   └── contracts/
│       └── shared/         # Shared types and schemas
├── package.json            # Root configuration
└── pnpm-workspace.yaml     # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 10.0.0 (package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd card-game

# Install dependencies for all packages
pnpm install
```

### Development

```bash
# Run all dev servers simultaneously
pnpm dev

# This will start:
# - API at http://localhost:3000
# - Front at http://localhost:5173
```

## 📦 Applications

### API (`apps/api`)
NestJS application providing REST API for the card game.

**Run:**
```bash
pnpm -r --filter api run dev
```

**Available commands:**
```bash
pnpm -r --filter api run build    # Production build
pnpm -r --filter api run test     # Run tests
```

### Front (`apps/front`)
React application with Vite for the game interface.

**Run:**
```bash
pnpm -r --filter front run dev
```

**Available commands:**
```bash
pnpm -r --filter front run build  # Production build
pnpm -r --filter front run preview # Preview production build
```

## 📚 Shared Packages

### Contracts (`packages/contracts/shared`)
Contains shared types, interfaces, and Zod schemas for data validation between frontend and API.

```bash
# Add dependency to a specific application
pnpm add --filter front @contracts/shared
```

## 🛠️ Available Commands

Run in the project root:

```bash
# Development
pnpm dev              # Run all dev servers

# Build
pnpm build            # Production build for all applications

# Testing
pnpm test             # Run tests for all applications

# Linting
pnpm lint             # ESLint check for all files
pnpm lint:css         # Stylelint check for styles
pnpm lint:css:fix     # Auto-fix styles

# Type checking
pnpm typecheck        # Type check for all applications
```

## 📦 Adding Dependencies

### To a specific application

```bash
pnpm add --filter api express
pnpm add --filter front react-router-dom
pnpm add -D --filter shared typescript
```

### To all applications

```bash
pnpm add -r lodash
```

### To root only (dev dependencies)

```bash
pnpm add -D -w eslint prettier
```

## 🧲 Git Hooks

The project uses **husky** and **lint-staged** for automatic code verification before commits:

- ESLint checks for TypeScript/JavaScript files
- Prettier formatting
- Stylelint checks for CSS/SCSS files

Errors block commits.

## 🎨 Development Tools

- **ESLint** - static code analysis
- **Prettier** - code formatting
- **Stylelint** - style checking
- **TypeScript** - type safety
- **pnpm** - package manager with workspace support
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## 📝 Project Configuration

- `eslint.config.mjs` - ESLint configuration
- `stylelint.config.cjs` - Stylelint configuration
- `pnpm-workspace.yaml` - Workspace configuration
- `.husky/` - Git hooks configuration
- Each application has its own `package.json` and `tsconfig.json`

## 🚢 Deployment

Each application has its own deployment cycle:

- **API** - NestJS application (can be deployed on any Node.js host)
- **Front** - static SPA (can be deployed on CDN or static server)

## 📖 Additional Information

- For new feature development, create branches from `main`
- Use clear commit messages
- Before pushing, ensure code passes linting and type checking
- Update this README when adding new applications or packages 