# Contributing to Paste

Thank you for your interest in contributing to Paste! We welcome contributions from the community.

Please take a moment to review this guide to understand our development workflow, standards, and submission process.

---

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat others with respect and empathy.

---

## Project Architecture

Paste is organized as a dual-package repository:
* **`Backend/`**: Express 5 + TypeScript strict, Prisma 7 with PostgreSQL 16 adapter, Redis 7 with BullMQ workers, Pino structured logging, Vitest test suites.
* **`Frontend/`**: Next.js 15 (App Router) + React 19, CodeMirror 6 code editor, Tailwind CSS, TanStack React Query, Radix UI primitives.

---

## Local Development Setup

### 1. Prerequisites
* **Node.js**: `v22.0.0` or higher
* **npm**: `v10.0.0` or higher
* **Docker & Docker Compose**: For local PostgreSQL, Redis, and MailHog

### 2. Clone the Repository
```bash
git clone git@github.com:himanshu-gunwant/Paste.git
cd Paste
```

### 3. Backend Setup
```bash
cd Backend

# 1. Install dependencies (runs prisma generate automatically)
npm install

# 2. Start PostgreSQL, Redis, and MailHog
docker compose up -d

# 3. Create development environment file
cp .env.example .env
# Edit .env with your local secrets if needed (defaults work out of the box with docker compose)

# 4. Run database migrations
npm run db:migrate:dev

# 5. Start the backend API server (runs on http://localhost:3000)
npm run dev

# 6. (Optional) In another terminal, start the background worker
npm run dev:worker
```

### 4. Frontend Setup
```bash
cd ../Frontend

# 1. Install dependencies
npm install

# 2. Create environment file (points to Backend API on port 3000)
cp .env.example .env.local

# 3. Start the Next.js development server (runs on http://localhost:3001)
npm run dev
```

---

## Quality Checks & Testing

Before submitting a Pull Request, ensure that all linting, type checks, and tests pass:

### Backend Checks
```bash
cd Backend

# Type check
npm run typecheck

# Linting
npm run lint

# Unit tests
npm run test:unit

# Integration tests (requires Docker services running)
npm run test:integration

# Build
npm run build
```

### Frontend Checks
```bash
cd Frontend

# Linting
npm run lint

# Production build & static page verification
npm run build
```

---

## Git Conventions & Workflow

1. **Branch Naming**:
   * `feat/feature-name` for new features
   * `fix/bug-description` for bug fixes
   * `docs/documentation-update` for documentation changes
   * `refactor/component-name` for refactoring

2. **Commit Messages**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: add syntax highlighting theme switcher`
   * `fix: correct token validation timing safe check`
   * `docs: update API authentication guide`
   * `test: add unit tests for paste expiration calculation`

3. **Pull Request Guidelines**:
   * Keep pull requests focused on a single change.
   * Provide a clear title and description explaining the problem and solution.
   * Reference any related issues (e.g., `Fixes #42`).
   * Verify all CI checks pass.
