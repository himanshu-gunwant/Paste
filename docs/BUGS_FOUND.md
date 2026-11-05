# Bugs Discovered, Investigated & Resolved

This document provides a comprehensive log of all bugs, integration discrepancies, security gaps, and browser defects identified during the development and end-to-end audit of the Pastebin platform.

---

## Summary Matrix

| ID | Issue Description | Component | Severity | Root Cause | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | Dev server chunk mismatch `MODULE_NOT_FOUND ./638.js` | Frontend Dev Server | Medium | Turbopack dev server cache corrupted by concurrent `next build` execution. | **Resolved** |
| **BUG-02** | Infinite fetch loop & Redis 429 exhaustion on `/p/[id]` | Frontend (`usePasteVault`) | High | Unstable function identity in `usePasteVault` (`getToken`) passed to `useEffect`/`useCallback` dependencies. | **Resolved** |
| **BUG-03** | Auth integration test timeouts on `waitForEmail` | Backend Test Runner | Medium | Vitest default test timeout (5,000ms) killed MailHog BullMQ polling before 15s deadline. | **Resolved** |
| **BUG-04** | Undelivered emails in MailHog during test/dev execution | Backend Email Worker | High | `SMTP_HOST` was missing from `Backend/.env`, causing worker to immediately throw upon start. | **Resolved** |
| **BUG-05** | Browser rejects `__Host-sess` and `__Host-oauth` session cookies | Backend Cookie Options | Critical | RFC 6265bis mandates `Secure` attribute on all `__Host-` prefixed cookies; browser dropped cookie in dev. | **Resolved** |
| **BUG-06** | Email verification redirected to invalid port `localhost:5173` | Backend Env Config | Medium | `FRONTEND_ORIGIN` defaulted to Vite port 5173 instead of Next.js port 3001. | **Resolved** |
| **BUG-07** | PasswordGate did not render for password-protected pastes | Frontend (`/p/[id]/page.tsx`) | High | `apiClient` response interceptor throws custom `AppApiError` (`err.statusCode`); code checked `err.response.status`. | **Resolved** |
| **BUG-08** | Client-side crash on `/admin` (`TypeError: undefined.toLocaleString`) | Frontend (`admin-stats-cards.tsx`) | High | Backend `/admin/stats` returned `livePastes` & `apiKeys`, while frontend expected `activePastes` & `tombstones`. | **Resolved** |
| **BUG-09** | Missing suspense boundary for `useSearchParams` on `/search` | Next.js Page Prerender | Low | Next.js 15 requires client components consuming search parameters to be wrapped in `<Suspense>`. | **Resolved** |
| **BUG-10** | Session table property mismatch (`ipAddress` vs `ip`) | Frontend Types | Low | Frontend type declared `ipAddress` while backend Express session serializer produced `ip`. | **Resolved** |

---

## Detailed Bug Reports

### BUG-01: Dev Server Chunk Mismatch (`MODULE_NOT_FOUND ./638.js`)
- **Symptoms:** Visiting `/p/antigravity-companion-readme` resulted in an empty dark page with console errors stating chunk `./638.js` was missing and 404 responses for CSS assets.
- **Root Cause:** Next.js build (`next build`) was run while `next dev` was concurrently serving the application. The compilation output overwrote `.next/` cache chunks while the development process held stale module references in memory.
- **Resolution:** Purged the stale `.next` cache directory, produced an optimized production build (`npm run build`), and initiated the application via `next start -p 3001` (production server).

---

### BUG-02: Infinite Fetch Loop & Redis Rate Limiting Exhaustion (`429 Too Many Requests`)
- **Symptoms:** Browsing to a paste caused hundreds of instantaneous HTTP requests to `/api/v1/pastes/[id]`, triggering Redis sliding-window rate limiters (300 requests/minute) and rendering `429 Too Many Requests`.
- **Root Cause:** In `src/hooks/use-paste-vault.ts`, helper methods (`getToken`, `saveToken`, `removeToken`) were defined as inline functions without `useCallback`. When included in the dependency array of `load()` inside `src/app/p/[id]/page.tsx`, every state update caused re-render -> new function instance -> re-fetch loop.
- **Resolution:**
  1. Wrapped all storage mutations and getters inside `usePasteVault` in `useCallback`.
  2. Stabilized the `load()` effect in `src/app/p/[id]/page.tsx` with request cancellation flags (`isCancelled`) and removed unstable object references.

---

### BUG-03: MailHog Background Queue Test Timeouts
- **Symptoms:** Running `vitest run tests/integration/auth.test.ts` resulted in test failures: `Error: Test timed out in 5000ms` on `verifies email end-to-end via the queued email + MailHog`.
- **Root Cause:** Vitest's default timeout is 5,000ms. The `waitForEmail` helper in `test-client.ts` uses a 15,000ms deadline to poll MailHog. BullMQ email worker dispatch and SMTP delivery typically took 5,100ms - 5,400ms under load.
- **Resolution:** Configured explicit test timeouts (`20_000ms`) on the email verification and password reset integration test suites in `Backend/tests/integration/auth.test.ts`.

---

### BUG-04: Undelivered Mail in MailHog Due to Unset `SMTP_HOST`
- **Symptoms:** Integration tests timed out waiting for MailHog messages; MailHog inbox remained at 0 items despite BullMQ jobs completing.
- **Root Cause:** `Backend/.env` lacked the `SMTP_HOST` variable. `Backend/src/workers/email.worker.ts` checked `if (!env.SMTP_HOST) throw new Error(...)`, causing email jobs to fail immediately without attempting network transport.
- **Resolution:** Added `SMTP_HOST=127.0.0.1` and `SMTP_PORT=1025` to `Backend/.env` and restarted the backend queue worker.

---

### BUG-05: Session Cookie (`__Host-sess`) Rejected by Modern Browsers
- **Symptoms:** Following user registration or sign-in, navigation to `/dashboard` immediately redirected or showed "Sign in to access Dashboard". `GET /api/v1/users/me` returned 401.
- **Root Cause:** The cookie name `__Host-sess` uses the standard RFC 6265bis security prefix. Per browser specification, any cookie with `__Host-` MUST include the `Secure` flag, even on localhost. In `Backend/src/controllers/auth.controller.ts`, cookie options were configured with `secure: env.NODE_ENV === 'production'`. Because `NODE_ENV=development`, `secure` was `false`, causing Chromium to discard the `Set-Cookie` header.
- **Resolution:** Updated `cookieOptions` in `Backend/src/controllers/auth.controller.ts` to `secure: true`. Chromium treats `localhost` as a secure origin, allowing and enforcing `Secure` cookies.

---

### BUG-06: Verification Redirect Destination Mismatch
- **Symptoms:** Clicking an email verification link caused the backend to redirect to `http://localhost:5173/verified?status=success` (which returned connection refused).
- **Root Cause:** `FRONTEND_ORIGIN` in `Backend/.env` was hardcoded to `http://localhost:5173` (Vite's default port), whereas the Next.js frontend runs on `http://localhost:3001`.
- **Resolution:** Updated `FRONTEND_ORIGIN=http://localhost:3001` in `Backend/.env` and restarted the Express server.

---

### BUG-07: PasswordGate Render Failure on Protected Pastes
- **Symptoms:** Visiting a password-protected paste without a management token rendered a generic "Unable to Access Paste" error instead of the `PasswordGate` Argon2id password entry form.
- **Root Cause:** `Frontend/src/lib/api/client.ts` uses an Axios response interceptor that unboxes Axios errors and throws custom `AppApiError` instances containing `statusCode` and `code`. `src/app/p/[id]/page.tsx` was looking for `axiosErr.response?.status`, which was `undefined` on `AppApiError`, defaulting `errorStatus` to 500 instead of recognizing HTTP 401 `PASSWORD_REQUIRED`.
- **Resolution:** Updated error parsing in `src/app/p/[id]/page.tsx` to inspect `anyErr.statusCode || anyErr.response?.status`. When `status === 401` and code is `PASSWORD_REQUIRED`, `isPasswordRequired` is set to `true`, rendering `PasswordGate`.

---

### BUG-08: Admin Dashboard Render Exception (`undefined.toLocaleString`)
- **Symptoms:** Visiting `/admin` as an administrator resulted in Next.js error: `Application error: a client-side exception has occurred` and console message `TypeError: Cannot read properties of undefined (reading 'toLocaleString')`.
- **Root Cause:** Backend `/admin/stats` returns `{ users, activeUsers, livePastes, openReports, apiKeys }`. `Frontend/src/components/admin/admin-stats-cards.tsx` accessed `stats.activePastes.toLocaleString()` and `stats.tombstones.toLocaleString()`, which were undefined.
- **Resolution:** Updated `Frontend/src/types/admin.ts` to reflect the actual backend property signatures, and updated `admin-stats-cards.tsx` to safely access `(stats.livePastes ?? stats.activePastes ?? 0).toLocaleString()`, `(stats.apiKeys ?? 0).toLocaleString()`, and `(stats.activeUsers ?? 0).toLocaleString()`.
