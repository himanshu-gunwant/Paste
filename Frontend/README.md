# Paste — Frontend Web Application

The official web frontend for the **Paste** platform. Built with **Next.js 15 (App Router)**, **React 19**, **CodeMirror 6**, and **Tailwind CSS**.

---

## Features

* **Instant Code Editor:** CodeMirror 6 with line numbers, status bar (character count, line count, byte size), language autodetect, and bracket matching.
* **Anonymous Paste Vault:** Management tokens stored in `localStorage` allowing creators to edit and delete anonymous pastes without signing up.
* **Viewer & Protection:** Syntax-highlighted code display, line anchors (`#L10-L25`), copy/raw/download actions, Argon2id in-memory password unlock, and burn-after-read warning banners.
* **Snapshot Revisions & Diff:** Visual side-by-side diffing powered by `diff` and full revision rollback.
* **Discovery & Search:** Full-text search, language facets, and latest/popular/trending feeds.
* **Collections & Bookmarks:** Organize pastes into private/public folders.
* **User & Admin Portals:** Authentication, API key management, active session revocation, moderation queues, audit logs, and IP bans.

---

## Local Development

### 1. Prerequisites
* Node.js `>= 20.0.0`
* Backend API running on `http://localhost:3000` (see `../Backend`)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `BACKEND_URL` | Backend API URL for client proxy rewrites | `http://localhost:3000` |
| `INTERNAL_BACKEND_URL` | Target URL used by Next.js server route handlers | `http://localhost:3000` |

### 3. Install & Run
```bash
# Install dependencies
npm install

# Start development server on port 3001
npm run dev

# Lint code
npm run lint

# Production build
npm run build
```
The application will be accessible at [http://localhost:3001](http://localhost:3001).
