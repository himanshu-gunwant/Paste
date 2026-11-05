# Paste Platform — Frontend API Integration Matrix & Specification

> **Document Version:** 1.0.0  
> **Target Backend:** `D:\Personal\paste\Backend` (Express 5 + TypeScript + PostgreSQL 16 + Redis 7)  
> **Companion Document:** [`FRONTEND_IMPLEMENTATION_PLAN.md`](./FRONTEND_IMPLEMENTATION_PLAN.md)  
> **Status:** Inspected & Verified against Backend Implementation

---

## 1. Global Integration Protocols & Conventions

### 1.1 Base URLs and Proxy Topology

- **Development:**
  - Frontend runs on `http://localhost:3000` (or `http://localhost:5173` if Vite).
  - Backend runs on `http://localhost:3000` (or `http://localhost:3001`).
  - Next.js / Vite development proxy or reverse proxy rewrites `/api/v1/*` to the Express backend port.
  - Same-origin proxying is **required** in development to allow `__Host-` prefixed session cookies and prevent cross-origin cookie rejection on localhost.
- **Production:**
  - Single VPS with Nginx fronting both the frontend application and backend API.
  - API Base Path: `/api/v1`
  - Operational & Embed Paths: `/healthz`, `/readyz`, `/api/docs`, `/embed/:id`
  - Nginx handles TLS, passes `X-Forwarded-For` (overwritten with socket peer address), and enforces `client_max_body_size 2m`.

### 1.2 Authentication & Credential Schemes

| Scheme | Mechanism | Header / Cookie | Scope & Usage |
|---|---|---|---|
| **Session Cookie** | HTTP-Only cookie | `Cookie: __Host-sess=<token>` | Standard web UI auth. Issued on login/register/OAuth. Rolling 30-day idle expiry. |
| **API Key** | Bearer HTTP header | `Authorization: Bearer pb_<raw>` | Developer programmatic access. Daily quota tracked (1,000 req/UTC day). |
| **Anonymous Management** | Custom HTTP header | `x-management-token: <raw>` | Anonymous paste owner management. Generated and returned once on anonymous paste creation. |
| **Paste Password** | Unlock POST body / Header | Body `{ password }` / `x-paste-password: <raw>` | Unlocks protected pastes. Revisions diff and view accept `x-paste-password` header. |
| **Share Token** | Query parameter | `?share_token=<token>` | Bypasses `PRIVATE` visibility restriction for permitted viewers. |
| **Idempotency Key** | Custom HTTP header | `Idempotency-Key: <uuid/string>` | Optional on `POST /pastes` for authenticated sessions/API keys (8–128 chars). Replays identical response within 24h. |
| **Anti-Abuse CAPTCHA** | Custom HTTP header | `x-captcha-token: <turnstile-token>` | Required on `POST /auth/register` and anonymous `POST /pastes` when `CAPTCHA_PROVIDER=turnstile`. |

### 1.3 Uniform API Envelopes

#### Standard Success Envelope
Success payloads are JSON objects with either a resource key (e.g. `{ paste: ... }`, `{ user: ... }`, `{ collection: ... }`) or a collection envelope `{ data: [...] }`. Cursor pagination envelopes include `{ data: [...], pagination: { cursor?: string, hasMore: boolean } }`.

#### Standard Error Envelope (RFC 7807 inspired)
Every 4xx/5xx error returned by the backend conforms to:
```typescript
interface ErrorResponseBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: Array<{
      path: string;
      message: string;
    }>;
  };
  requestId: string;
}
```

#### Complete Error Code Reference
| Code | HTTP Status | Description | Frontend Handling |
|---|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid payload, schema mismatch, or failed Zod refinement | Map `details` array to React Hook Form field errors |
| `UNAUTHORIZED` | 401 | Missing or invalid session / Bearer token | Prompt user to log in or clear stale session |
| `PASSWORD_REQUIRED` | 401 | Paste requires password before content can be returned | Show password unlock modal/card |
| `INVALID_PASSWORD` | 401 | Incorrect paste password supplied | Display inline password error shake animation |
| `FORBIDDEN` | 403 | CSRF Origin mismatch or insufficient permissions | Show forbidden banner or check origin configuration |
| `NOT_FOUND` | 404 | Resource does not exist, expired, or private without token | Display uniform 404 screen (anti-enumeration) |
| `CONFLICT` | 409 | Duplicate username, email, custom slug, or alias | Highlight collided field with conflict warning |
| `IDEMPOTENCY_IN_FLIGHT` | 409 | Duplicate paste submission currently executing | Show progress spinner and await original completion |
| `GONE` | 410 | Paste has burned after reading or exceeded max views | Display tombstone banner ("Consumed or Burned") |
| `PAYLOAD_TOO_LARGE` | 413 | Paste content exceeds 1,000,000 bytes (1 MB) | Block submission and display byte size counter alert |
| `IDEMPOTENCY_KEY_REUSED` | 422 | Same idempotency key used with different payload | Regenerate fresh UUID idempotency key and retry |
| `QUOTA_EXCEEDED` | 429 | Anonymous IP daily limit (20 pastes) or API key quota exceeded | Show quota exhaustion dialog with reset time |
| `RATE_LIMITED` | 429 | Exceeded IP or endpoint rate limit window | Read `Retry-After` header and show countdown timer |
| `OAUTH_EMAIL_UNVERIFIED` | 400 | OAuth provider did not supply a verified primary email | Alert user to verify email at provider |
| `PROVIDER_NOT_CONFIGURED` | 503 | Requested OAuth provider is disabled or missing credentials | Disable provider button in UI |
| `INTERNAL` | 500 | Unhandled server error (details scrubbed) | Show generic friendly error with `requestId` for support |

---

## 2. Exhaustive API Integration Matrix

### 2.1 Authentication & Session Management (`/api/v1/auth`)

#### 1. Register Account
- **Endpoint:** `POST /api/v1/auth/register`
- **Auth:** Anonymous
- **Headers:** `Content-Type: application/json`, `x-captcha-token: <token>` (if Turnstile active)
- **Request Body:**
  ```json
  {
    "email": "developer@example.com",
    "username": "dev_coder",
    "password": "SecurePassword123!"
  }
  ```
  - `email`: Valid email, max 255 chars, normalized lowercase.
  - `username`: 3–30 chars, lowercase letters, digits, `-`, `_`.
  - `password`: 10–128 chars.
- **Response (201 Created):** Sets `__Host-sess` cookie.
  ```json
  {
    "user": {
      "id": "019488a1-8d4e-7b2a-89bc-9f33b1e35a11",
      "email": "developer@example.com",
      "username": "dev_coder",
      "displayName": null,
      "bio": null,
      "avatarUrl": null,
      "websiteUrl": null,
      "emailVerified": false,
      "role": "USER",
      "createdAt": "2026-11-05T08:00:00.000Z"
    }
  }
  ```
- **Error Codes:** `VALIDATION_ERROR` (400), `CONFLICT` (409 - email or username taken), `RATE_LIMITED` (429 - 10 req/15min).
- **Component:** `src/components/auth/register-form.tsx`
- **States:**
  - *Loading:* Spinner on submit button, inputs disabled.
  - *Success:* Toast notification "Account created", update auth query cache, redirect to `/dashboard`.

#### 2. Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Auth:** Anonymous
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "developer@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):** Sets `__Host-sess` cookie.
  ```json
  {
    "user": {
      "id": "019488a1-8d4e-7b2a-89bc-9f33b1e35a11",
      "email": "developer@example.com",
      "username": "dev_coder",
      "displayName": null,
      "bio": null,
      "avatarUrl": null,
      "websiteUrl": null,
      "emailVerified": false,
      "role": "USER",
      "createdAt": "2026-11-05T08:00:00.000Z"
    }
  }
  ```
- **Error Codes:** `UNAUTHORIZED` (401 - invalid email or password; timing-equalized Argon2id verify), `RATE_LIMITED` (429 - 5 attempts/hour per email).
- **Component:** `src/components/auth/login-form.tsx`
- **States:**
  - *Loading:* Pulse effect on submit.
  - *Error:* Clear password field, display inline credential mismatch alert.

#### 3. Logout
- **Endpoint:** `POST /api/v1/auth/logout`
- **Auth:** Session cookie
- **Request Body:** None
- **Response (204 No Content):** Clears `__Host-sess` cookie.
- **Component:** `src/components/layout/user-nav.tsx`
- **States:** On success, reset TanStack Query cache (`queryClient.clear()`) and redirect to `/`.

#### 4. Request Email Verification
- **Endpoint:** `POST /api/v1/auth/verify-email/request`
- **Auth:** Session required (`requireAuth()`)
- **Request Body:** None
- **Response (202 Accepted):**
  ```json
  { "status": "accepted" }
  ```
- **Rate Limit:** 5 req/hour.
- **Component:** `src/components/settings/email-verification-banner.tsx`

#### 5. Confirm Email Verification (API Form)
- **Endpoint:** `POST /api/v1/auth/verify-email/confirm`
- **Auth:** Anonymous / Any
- **Request Body:**
  ```json
  { "token": "a1b2c3d4e5f6g7h8i9j0..." }
  ```
- **Response (200 OK):**
  ```json
  { "status": "ok", "emailVerified": true }
  ```
- **Component:** `src/app/(auth)/verify-email/page.tsx`

#### 6. Email Link Verification (Direct Click)
- **Endpoint:** `GET /api/v1/auth/verify-email?token=<token>`
- **Behavior:** Backend 302 redirects to frontend `${frontend}/verified?status=success` or `${frontend}/verified?status=error`.
- **Component:** `src/app/verified/page.tsx`

#### 7. Request Password Reset
- **Endpoint:** `POST /api/v1/auth/password-reset/request`
- **Auth:** Anonymous
- **Request Body:**
  ```json
  { "email": "developer@example.com" }
  ```
- **Response (202 Accepted):** Always 202 (anti-enumeration).
  ```json
  { "status": "accepted" }
  ```
- **Component:** `src/components/auth/forgot-password-form.tsx`

#### 8. Confirm Password Reset
- **Endpoint:** `POST /api/v1/auth/password-reset/confirm`
- **Auth:** Anonymous
- **Request Body:**
  ```json
  {
    "token": "reset-token-from-email",
    "newPassword": "NewSecurePassword456!"
  }
  ```
- **Response (204 No Content):** Revokes all existing user sessions.
- **Component:** `src/components/auth/reset-password-form.tsx`

#### 9. OAuth Start (Google / GitHub)
- **Endpoint:** `GET /api/v1/auth/oauth/:provider` (`provider`: `google` | `github`)
- **Behavior:** Backend sets `__Host-oauth` state cookie (PKCE + state) and 302 redirects browser to provider consent screen.
- **Component:** OAuth buttons in `src/components/auth/oauth-buttons.tsx`

#### 10. OAuth Callback
- **Endpoint:** `GET /api/v1/auth/oauth/:provider/callback?code=...&state=...`
- **Behavior:** Backend verifies state, exchanges token, creates/links user, sets `__Host-sess` cookie, and 302 redirects to:
  - Success: `${frontend}/auth/callback?status=created|linked|login`
  - Error: `${frontend}/login?oauth=error&reason=<code_string>`
- **Component:** `src/app/(auth)/auth/callback/page.tsx`

---

### 2.2 Paste Operations (`/api/v1/pastes`)

#### 1. Create Paste
- **Endpoint:** `POST /api/v1/pastes`
- **Auth:** Anonymous OR Session OR API Key
- **Headers:**
  - `Content-Type: application/json`
  - `Idempotency-Key: <uuid>` (Optional for authenticated sessions/keys)
  - `x-captcha-token: <turnstile-token>` (Required for anonymous if Turnstile active)
- **Request Body:**
  ```typescript
  interface CreatePastePayload {
    content: string; // 1 to 1,000,000 bytes
    title?: string; // max 140 chars
    description?: string; // max 500 chars
    language?: string; // lowercase identifier: a-z, 0-9, +, #, -
    visibility?: 'public' | 'unlisted' | 'private'; // default: 'public'
    password?: string; // 4 to 128 chars
    expiresIn?: '10min' | '1h' | '1d' | '1w' | '1m'; // Mutually exclusive with expiresAt
    expiresAt?: string; // ISO 8601 datetime
    maxViews?: number; // 1 to 1,000,000
    burnAfterRead?: boolean; // default: false
    customSlug?: string; // 3-64 chars: lowercase a-z, 0-9, -, _
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "paste": {
      "id": "7k9xM2qL1v",
      "title": "Rust Threadpool Implementation",
      "description": "Lock-free worker pool",
      "language": "rust",
      "detectedLanguage": "rust",
      "visibility": "public",
      "author": { "username": "dev_coder" },
      "forkOfId": null,
      "contentSize": 4520,
      "burnAfterRead": false,
      "expiresAt": "2026-11-12T08:00:00.000Z",
      "createdAt": "2026-11-05T08:00:00.000Z",
      "updatedAt": "2026-11-05T08:00:00.000Z"
    },
    "managementToken": "YTNmNzE5MmEtMzA4MS00MTc1LWIwOTEt..."
  }
  ```
  *(Note: `managementToken` is present ONLY for anonymous paste creation; `content` is omitted from create response).*
- **Error Codes:** `VALIDATION_ERROR` (400), `CONFLICT` (409 - custom slug collision), `PAYLOAD_TOO_LARGE` (413 - >1 MB), `QUOTA_EXCEEDED` (429 - anon limit: 20/day), `RATE_LIMITED` (429 - 10/hr anon, 60/hr user).
- **Component:** `src/components/editor/paste-editor.tsx`

#### 2. View Paste
- **Endpoint:** `GET /api/v1/pastes/:id` (`id` is 10-char short id or custom slug)
- **Auth:** Anonymous OR Session
- **Query Params:** `share_token=<token>` (Optional)
- **Headers:** `x-management-token: <raw>` (Optional for anon owner)
- **Response (200 OK):**
  ```json
  {
    "paste": {
      "id": "7k9xM2qL1v",
      "title": "Rust Threadpool Implementation",
      "description": "Lock-free worker pool",
      "language": "rust",
      "detectedLanguage": "rust",
      "visibility": "public",
      "author": { "username": "dev_coder" },
      "forkOfId": null,
      "contentSize": 4520,
      "burnAfterRead": false,
      "expiresAt": "2026-11-12T08:00:00.000Z",
      "createdAt": "2026-11-05T08:00:00.000Z",
      "updatedAt": "2026-11-05T08:00:00.000Z",
      "content": "use std::sync::{Arc, Mutex};\n...",
      "viewCount": 42,
      "maxViews": null,
      "burnedAt": null,
      "deletedAt": null
    }
  }
  ```
  *(Note: `viewCount`, `maxViews`, `burnedAt`, `deletedAt` are present ONLY if caller is owner or admin).*
- **Error Codes:**
  - `401 Unauthorized` with code `PASSWORD_REQUIRED`: Paste is password protected.
  - `404 Not Found`: Paste does not exist, expired, deleted, or is `PRIVATE` without verified share token.
  - `410 Gone`: Paste had `burnAfterRead: true` or reached `maxViews` and was consumed (shown to owner).
- **Component:** `src/components/viewer/paste-viewer.tsx`

#### 3. Unlock Password-Protected Paste
- **Endpoint:** `POST /api/v1/pastes/:id/unlock`
- **Auth:** Anonymous OR Session
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  { "password": "pasteSecretPassword" }
  ```
- **Response (200 OK):** Returns full paste view with `content`.
- **Error Codes:** `INVALID_PASSWORD` (401), `RATE_LIMITED` (429 - 10 attempts/15min).
- **Component:** `src/components/viewer/password-unlock-modal.tsx`

#### 4. Raw Paste Content
- **Endpoint:** `GET /api/v1/pastes/:id/raw`
- **Query Params:** `share_token=<token>` (Optional)
- **Headers:** `x-management-token: <raw>` (Optional)
- **Response (200 OK):** Content-Type `text/plain; charset=utf-8`, body is raw unescaped paste string.
  - Cache-Control: `public, max-age=60` for public pastes; `private, no-store` for private/unlisted.
  - *Warning:* For burn-after-reading pastes, accessing `/raw` consumes the burn!

#### 5. Download Paste Attachment
- **Endpoint:** `GET /api/v1/pastes/:id/download`
- **Response (200 OK):** Content-Type `text/plain; charset=utf-8`, header `Content-Disposition: attachment; filename="<title-or-id>.<ext>"`.

#### 6. Fork Paste
- **Endpoint:** `POST /api/v1/pastes/:id/fork`
- **Auth:** Anonymous OR Session
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  { "password": "optionalPasswordIfSourceProtected" }
  ```
- **Response (201 Created):**
  ```json
  {
    "paste": {
      "id": "newShortId1",
      "forkOfId": "7k9xM2qL1v",
      "visibility": "public",
      "contentSize": 4520,
      "createdAt": "2026-11-05T08:15:00.000Z"
    },
    "managementToken": "optionalAnonTokenIfForkedAnonymously"
  }
  ```
- **Component:** `src/components/viewer/fork-button.tsx`

#### 7. Update Paste
- **Endpoint:** `PATCH /api/v1/pastes/:id`
- **Auth:** Session (owner) OR `x-management-token` header OR Admin
- **Request Body:**
  ```typescript
  interface UpdatePastePayload {
    content?: string; // If modified, creates Revision N+1
    title?: string;
    description?: string;
    language?: string;
    visibility?: 'public' | 'unlisted' | 'private';
    password?: string | null; // null clears password
    expiresIn?: '10min' | '1h' | '1d' | '1w' | '1m';
    expiresAt?: string | null; // null clears expiration
    maxViews?: number | null;
    burnAfterRead?: boolean;
  }
  ```
- **Response (200 OK):** Full updated paste object with `content` and stats.
- **Component:** `src/components/editor/paste-edit-view.tsx`

#### 8. Delete Paste
- **Endpoint:** `DELETE /api/v1/pastes/:id`
- **Auth:** Session (owner) OR `x-management-token` header OR Admin
- **Response (204 No Content):** Tombstones content immediately (`content = null`, `deletedAt = now()`), scheduled for physical purge.
- **Component:** `src/components/viewer/delete-paste-dialog.tsx`

#### 9. Create Share Token
- **Endpoint:** `POST /api/v1/pastes/:id/share-tokens`
- **Auth:** Session required (must be paste owner or admin)
- **Request Body:**
  ```json
  {
    "expiresAt": "2026-11-20T00:00:00.000Z",
    "maxUses": 10
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "pb_st_9f8e7d6c5b4a3...",
    "expiresAt": "2026-11-20T00:00:00.000Z",
    "maxUses": 10
  }
  ```
  *(Note: Raw share token is returned ONCE; hash stored in PostgreSQL).*
- **Component:** `src/components/viewer/share-dialog.tsx`

#### 10. Revoke Share Token
- **Endpoint:** `DELETE /api/v1/pastes/:id/share-tokens/:tokenId`
- **Auth:** Session required (owner/admin)
- **Response (204 No Content)**

---

### 2.3 Revision Management (`/api/v1/pastes/:id/revisions`)

#### 1. List Revisions
- **Endpoint:** `GET /api/v1/pastes/:id/revisions`
- **Auth:** Anonymous OR Session (view access required; accepts `x-paste-password` or `?share_token=`)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "revisionNo": 1,
        "title": "Initial Draft",
        "description": null,
        "language": "rust",
        "contentSize": 4120,
        "createdAt": "2026-11-05T08:00:00.000Z"
      },
      {
        "revisionNo": 2,
        "title": "Added Mutex locking",
        "description": "Fix data race in queue",
        "language": "rust",
        "contentSize": 4520,
        "createdAt": "2026-11-05T08:10:00.000Z"
      }
    ],
    "latestRevisionNo": 2
  }
  ```
- **Component:** `src/components/revisions/revision-list-drawer.tsx`

#### 2. Get Single Revision Snapshot
- **Endpoint:** `GET /api/v1/pastes/:id/revisions/:no` (`no` integer 1–10000)
- **Response (200 OK):**
  ```json
  {
    "revision": {
      "revisionNo": 1,
      "title": "Initial Draft",
      "description": null,
      "language": "rust",
      "content": "fn main() { ... }",
      "contentSize": 4120,
      "createdAt": "2026-11-05T08:00:00.000Z"
    }
  }
  ```
- **Component:** `src/components/revisions/revision-snapshot-modal.tsx`

#### 3. Diff Revisions
- **Endpoint:** `GET /api/v1/pastes/:id/revisions/:no/diff?to=:toNo`
- **Response (200 OK):**
  ```json
  {
    "from": 1,
    "to": 2,
    "diff": "===================================================================\n--- revision-1\n+++ revision-2\n@@ -3,4 +3,6 @@\n-    let pool = ThreadPool::new(4);\n+    let pool = ThreadPool::builder().workers(8).build();\n"
  }
  ```
- **Component:** `src/components/revisions/diff-viewer.tsx`

#### 4. Restore Revision
- **Endpoint:** `POST /api/v1/pastes/:id/revisions/:no/restore`
- **Auth:** Session (owner) OR `x-management-token` header OR Admin
- **Behavior:** Takes snapshot `no` and writes it as a **NEW** revision `latestRevisionNo + 1` (preserves append-only history).
- **Response (200 OK):**
  ```json
  {
    "restored": true,
    "latestRevisionNo": 3
  }
  ```
- **Component:** `src/components/revisions/restore-revision-dialog.tsx`

---

### 2.4 Discovery & Search (`/api/v1`)

#### 1. Public Pastes Feed
- **Endpoint:** `GET /api/v1/pastes`
- **Query Params:**
  - `sort`: `latest` (default) | `popular` | `trending`
  - `language`: string identifier
  - `username`: filter by author username
  - `cursor`: opaque base64url keyset cursor
  - `limit`: integer 1–50 (default 20)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "7k9xM2qL1v",
        "title": "Rust Threadpool Implementation",
        "description": "Lock-free worker pool",
        "language": "rust",
        "detectedLanguage": "rust",
        "visibility": "public",
        "viewCount": "142",
        "authorUsername": "dev_coder",
        "createdAt": "2026-11-05T08:00:00.000Z"
      }
    ],
    "pagination": {
      "cursor": "eyJ0IjoiMjAyNi0xMS0wNVQwODowMDowMC4wMDBaIiwiaWQiOiI3azl4TTJxTDF2In0",
      "hasMore": true
    }
  }
  ```
- **Component:** `src/components/discovery/paste-feed.tsx`

#### 2. Search Public Pastes
- **Endpoint:** `GET /api/v1/search`
- **Rate Limit:** 60 req/min per IP
- **Query Params:**
  - `q`: search string (1–200 chars, PostgreSQL websearch `tsvector` query)
  - `language`: optional filter
  - `username`: optional filter
  - `cursor`: keyset cursor
  - `limit`: integer 1–50
- **Response (200 OK):** Same schema as Feed (`{ data, pagination }`).
- **Component:** `src/components/discovery/search-view.tsx`

#### 3. Language Facets
- **Endpoint:** `GET /api/v1/languages`
- **Response (200 OK):**
  ```json
  {
    "data": [
      { "language": "typescript", "count": 128 },
      { "language": "rust", "count": 94 },
      { "language": "python", "count": 76 },
      { "language": "go", "count": 45 }
    ]
  }
  ```
- **Component:** `src/components/discovery/language-filter-sidebar.tsx`

---

### 2.5 Collections & Bookmarks (`/api/v1/collections`, `/api/v1/pastes/:id/bookmark`)

#### 1. Create Collection
- **Endpoint:** `POST /api/v1/collections`
- **Auth:** Session required
- **Request Body:**
  ```json
  {
    "title": "Algorithms & Data Structures",
    "description": "Handy snippets for coding challenges",
    "slug": "algo-ds",
    "visibility": "public"
  }
  ```
  *(visibility: `public` | `unlisted` | `private`, default `private`).*
- **Response (201 Created):**
  ```json
  {
    "collection": {
      "id": "019488b3-11a2-7fa3-bc12-d881ef123456",
      "slug": "algo-ds",
      "title": "Algorithms & Data Structures",
      "description": "Handy snippets for coding challenges",
      "visibility": "public",
      "ownerUsername": "dev_coder",
      "itemCount": 0,
      "createdAt": "2026-11-05T08:30:00.000Z",
      "updatedAt": "2026-11-05T08:30:00.000Z"
    }
  }
  ```
- **Component:** `src/components/collections/create-collection-modal.tsx`

#### 2. List Own Collections
- **Endpoint:** `GET /api/v1/collections`
- **Auth:** Session required
- **Response (200 OK):** `{ data: CollectionView[] }`
- **Component:** `src/components/collections/collections-grid.tsx`

#### 3. Get Collection Detail with Items
- **Endpoint:** `GET /api/v1/collections/:id` (`id` must be UUID)
- **Auth:** Anonymous OR Session
- **Response (200 OK):**
  ```json
  {
    "collection": {
      "id": "019488b3-11a2-7fa3-bc12-d881ef123456",
      "slug": "algo-ds",
      "title": "Algorithms & Data Structures",
      "description": "Handy snippets",
      "visibility": "public",
      "ownerUsername": "dev_coder",
      "createdAt": "2026-11-05T08:30:00.000Z",
      "updatedAt": "2026-11-05T08:30:00.000Z"
    },
    "items": [
      {
        "position": 0,
        "addedAt": "2026-11-05T08:35:00.000Z",
        "paste": {
          "id": "7k9xM2qL1v",
          "title": "Rust Threadpool Implementation",
          "language": "rust",
          "visibility": "public",
          "author": { "username": "dev_coder" }
        }
      },
      {
        "position": 1,
        "addedAt": "2026-11-05T08:36:00.000Z",
        "restricted": true
      }
    ]
  }
  ```
  *(Note: Items that caller has no access to are returned as `{ position, addedAt, restricted: true }` without leaking metadata).*
- **Component:** `src/components/collections/collection-detail-view.tsx`

#### 4. Update Collection
- **Endpoint:** `PATCH /api/v1/collections/:id`
- **Auth:** Session required (owner)
- **Request Body:** `{ title?: string, description?: string | null, slug?: string, visibility?: ... }`
- **Response (200 OK):** `{ collection: CollectionView }`

#### 5. Delete Collection
- **Endpoint:** `DELETE /api/v1/collections/:id`
- **Auth:** Session required (owner)
- **Response (204 No Content)**

#### 6. Add Paste to Collection
- **Endpoint:** `POST /api/v1/collections/:id/pastes`
- **Auth:** Session required (owner)
- **Request Body:** `{ "pasteId": "7k9xM2qL1v" }`
- **Response (201 Created):** `{ collectionId: string, pasteId: string, position: number }`

#### 7. Reorder Collection Pastes
- **Endpoint:** `PATCH /api/v1/collections/:id/pastes`
- **Auth:** Session required (owner)
- **Request Body:**
  ```json
  {
    "positions": [
      { "pasteId": "7k9xM2qL1v", "position": 0 },
      { "pasteId": "8b0yN3rM2w", "position": 1 }
    ]
  }
  ```
- **Response (200 OK):** `{ "status": "ok" }`

#### 8. Remove Paste from Collection
- **Endpoint:** `DELETE /api/v1/collections/:id/pastes/:pasteId`
- **Auth:** Session required (owner)
- **Response (204 No Content)**

#### 9. Add Bookmark
- **Endpoint:** `PUT /api/v1/pastes/:id/bookmark`
- **Auth:** Session required
- **Behavior:** Viewability-gated (fails if user cannot view paste), idempotent.
- **Response (204 No Content)**
- **Component:** `src/components/viewer/bookmark-button.tsx`

#### 10. Remove Bookmark
- **Endpoint:** `DELETE /api/v1/pastes/:id/bookmark`
- **Auth:** Session required
- **Response (204 No Content)**

#### 11. List My Bookmarks
- **Endpoint:** `GET /api/v1/users/me/bookmarks`
- **Auth:** Session required
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "pasteId": "7k9xM2qL1v",
        "title": "Rust Threadpool Implementation",
        "language": "rust",
        "createdAt": "2026-11-05T08:00:00.000Z",
        "addedAt": "2026-11-05T08:40:00.000Z"
      }
    ]
  }
  ```
- **Component:** `src/components/dashboard/bookmarks-table.tsx`

---

### 2.6 User Profiles & Account (`/api/v1/users`)

#### 1. Get Current User Profile (`/me`)
- **Endpoint:** `GET /api/v1/users/me`
- **Auth:** Session required
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "019488a1-8d4e-7b2a-89bc-9f33b1e35a11",
      "email": "developer@example.com",
      "username": "dev_coder",
      "displayName": "Dev Coder",
      "bio": "Systems engineer & Rust enthusiast",
      "avatarUrl": "https://avatars.githubusercontent.com/u/12345",
      "websiteUrl": "https://devcoder.io",
      "emailVerified": true,
      "role": "USER",
      "createdAt": "2026-11-05T08:00:00.000Z"
    }
  }
  ```
- **Component:** `src/hooks/use-auth.ts`, `src/components/settings/profile-settings-form.tsx`

#### 2. Update Profile (`PATCH /me`)
- **Endpoint:** `PATCH /api/v1/users/me`
- **Auth:** Session required
- **Request Body:**
  ```json
  {
    "displayName": "Dev Coder",
    "bio": "Systems engineer",
    "avatarUrl": "https://example.com/avatar.png",
    "websiteUrl": "https://devcoder.io"
  }
  ```
- **Response (200 OK):** `{ user: CurrentUser }`

#### 3. Delete Account (`DELETE /me`)
- **Endpoint:** `DELETE /api/v1/users/me`
- **Auth:** Session required
- **Request Body:** `{ "password": "currentPassword" }` (optional for OAuth-only users).
- **Behavior:** PII anonymization, email scrubbed to `deleted+{id}@invalid`, sessions & tokens revoked.
- **Response (204 No Content)**
- **Component:** `src/components/settings/danger-zone.tsx`

#### 4. List Active Sessions
- **Endpoint:** `GET /api/v1/users/me/sessions`
- **Auth:** Session required
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "8f7e6d5c4b3a...",
        "ip": "203.0.113.195",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "createdAt": "2026-11-05T08:00:00.000Z",
        "lastUsedAt": "2026-11-05T09:15:00.000Z",
        "expiresAt": "2026-12-05T09:15:00.000Z"
      }
    ]
  }
  ```
- **Component:** `src/components/settings/sessions-manager.tsx`

#### 5. Revoke One Session
- **Endpoint:** `DELETE /api/v1/users/me/sessions/:id`
- **Auth:** Session required
- **Response (204 No Content)**

#### 6. Revoke All Other Sessions
- **Endpoint:** `DELETE /api/v1/users/me/sessions`
- **Auth:** Session required
- **Response (200 OK):** `{ "revoked": 3 }`

#### 7. Public User Profile
- **Endpoint:** `GET /api/v1/users/:username`
- **Auth:** Anonymous
- **Response (200 OK):**
  ```json
  {
    "profile": {
      "username": "dev_coder",
      "displayName": "Dev Coder",
      "bio": "Systems engineer",
      "avatarUrl": "https://example.com/avatar.png",
      "websiteUrl": "https://devcoder.io",
      "createdAt": "2026-11-05T08:00:00.000Z"
    }
  }
  ```
- **Component:** `src/app/u/[username]/page.tsx`

#### 8. User's Public Pastes
- **Endpoint:** `GET /api/v1/users/:username/pastes`
- **Auth:** Anonymous
- **Query Params:** `sort=latest|popular`, `language`, `cursor`, `limit`
- **Response (200 OK):** `{ data: PasteSummary[], pagination: { cursor, hasMore } }`

#### 9. User's Public Collections
- **Endpoint:** `GET /api/v1/users/:username/collections`
- **Auth:** Anonymous
- **Response (200 OK):** `{ data: CollectionView[] }`

---

### 2.7 Developer API & API Keys (`/api/v1/api-keys`, `/api/v1/users/me/api-usage`)

#### 1. Create API Key
- **Endpoint:** `POST /api/v1/api-keys`
- **Auth:** Session required (cannot be created with an API key)
- **Rate Limit:** 10 keys/hour
- **Request Body:**
  ```json
  {
    "name": "CLI Tool Key",
    "expiresAt": "2027-01-01T00:00:00.000Z"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "apiKey": {
      "id": "019488c0-3b2a-71e9-91a0-123456789abc",
      "name": "CLI Tool Key",
      "prefix": "pb_9f8e7d",
      "apiKey": "pb_9f8e7d6c5b4a39281726354890123456789abcdef",
      "lastUsedAt": null,
      "expiresAt": "2027-01-01T00:00:00.000Z",
      "revokedAt": null,
      "createdAt": "2026-11-05T09:00:00.000Z"
    }
  }
  ```
  *(Note: `apiKey` is the full raw key disclosed ONCE; store safely).*
- **Component:** `src/components/settings/api-keys-manager.tsx`

#### 2. List Own API Keys
- **Endpoint:** `GET /api/v1/api-keys`
- **Auth:** Session required
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "019488c0-3b2a-71e9-91a0-123456789abc",
        "name": "CLI Tool Key",
        "prefix": "pb_9f8e7d",
        "lastUsedAt": "2026-11-05T09:12:00.000Z",
        "expiresAt": "2027-01-01T00:00:00.000Z",
        "revokedAt": null,
        "createdAt": "2026-11-05T09:00:00.000Z"
      }
    ]
  }
  ```

#### 3. Revoke API Key
- **Endpoint:** `DELETE /api/v1/api-keys/:id`
- **Auth:** Session required
- **Response (204 No Content)**

#### 4. Get Own API Usage
- **Endpoint:** `GET /api/v1/users/me/api-usage`
- **Auth:** Session required OR Bearer API Key
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "endpoint": "/pastes",
        "method": "POST",
        "statusCode": 201,
        "requestCount": 42,
        "avgLatencyMs": 18
      }
    ],
    "quota": {
      "dailyLimit": 1000,
      "window": "UTC day"
    },
    "windowDays": 30
  }
  ```
- **Component:** `src/components/settings/api-usage-chart.tsx`

---

### 2.8 Analytics (`/api/v1/pastes/:id/stats`, `/api/v1/users/me/analytics`)

#### 1. Paste Analytics
- **Endpoint:** `GET /api/v1/pastes/:id/stats`
- **Auth:** Session required (must be paste author or admin)
- **Response (200 OK):**
  ```json
  {
    "stats": {
      "totals": {
        "views": "1420",
        "uniqueVisitors": "890"
      },
      "daily": [
        {
          "day": "2026-11-05T00:00:00.000Z",
          "views": 150,
          "uniqueVisitors": 95
        },
        {
          "day": "2026-11-04T00:00:00.000Z",
          "views": 210,
          "uniqueVisitors": 140
        }
      ]
    }
  }
  ```
- **Component:** `src/components/analytics/paste-analytics-sheet.tsx`

#### 2. User Overall Analytics
- **Endpoint:** `GET /api/v1/users/me/analytics`
- **Auth:** Session required
- **Response (200 OK):**
  ```json
  {
    "totals": {
      "pastes": 38,
      "storageUsed": "1425890",
      "views": "28400",
      "uniqueVisitors": "18200"
    },
    "daily": [
      {
        "day": "2026-11-05T00:00:00.000Z",
        "views": 620,
        "uniqueVisitors": 410
      }
    ]
  }
  ```
- **Component:** `src/components/dashboard/analytics-overview.tsx`

---

### 2.9 Abuse Reports & Administration (`/api/v1/reports`, `/api/v1/admin`)

#### 1. Submit Abuse Report
- **Endpoint:** `POST /api/v1/reports`
- **Auth:** Anonymous OR Session
- **Rate Limit:** 10 req/hour
- **Request Body:**
  ```json
  {
    "pasteId": "7k9xM2qL1v",
    "reason": "MALWARE",
    "details": "Contains obfuscated phishing payload"
  }
  ```
  *(reason: `SPAM` | `MALWARE` | `HARASSMENT` | `COPYRIGHT` | `OTHER`).*
- **Response (201 Created):** `{ "id": "uuid", "status": "OPEN", "createdAt": "..." }`
- **Component:** `src/components/viewer/report-modal.tsx`

#### 2. Admin System Stats
- **Endpoint:** `GET /api/v1/admin/stats`
- **Auth:** Role `ADMIN` required
- **Response (200 OK):**
  ```json
  {
    "users": 154,
    "activePastes": 1289,
    "tombstones": 42,
    "openReports": 3,
    "activeBans": 2
  }
  ```
- **Component:** `src/components/admin/admin-stats-card.tsx`

#### 3. Admin Pastes List & Moderation
- **Endpoint:** `GET /api/v1/admin/pastes?q=&deleted=false&limit=50&offset=0`
- **Auth:** Role `ADMIN` required
- **Response (200 OK):** `{ data: AdminPasteView[] }`

#### 4. Hard Purge Paste
- **Endpoint:** `POST /api/v1/admin/pastes/:id/purge`
- **Auth:** Role `ADMIN` required
- **Response (204 No Content)**

#### 5. Admin Users List
- **Endpoint:** `GET /api/v1/admin/users?q=`
- **Auth:** Role `ADMIN` required
- **Response (200 OK):** `{ data: AdminUserView[] }`

#### 6. Suspend User
- **Endpoint:** `POST /api/v1/admin/users/:id/suspend`
- **Auth:** Role `ADMIN` required
- **Request Body:** `{ "reason": "Terms violation", "endsAt": "2026-12-01T00:00:00Z" }`
- **Response (204 No Content)**

#### 7. Unsuspend User
- **Endpoint:** `POST /api/v1/admin/users/:id/unsuspend`
- **Auth:** Role `ADMIN` required
- **Response (204 No Content)**

#### 8. List Abuse Reports
- **Endpoint:** `GET /api/v1/admin/reports?status=OPEN`
- **Auth:** Role `ADMIN` required
- **Response (200 OK):** `{ data: AbuseReportView[] }`

#### 9. Resolve Abuse Report
- **Endpoint:** `POST /api/v1/admin/reports/:id/resolve`
- **Auth:** Role `ADMIN` required
- **Request Body:** `{ "action": "delete_paste" | "dismiss", "note": "Verified malware" }`
- **Response (204 No Content)**

#### 10. Audit Logs Viewer
- **Endpoint:** `GET /api/v1/admin/audit-logs?limit=50&offset=0`
- **Auth:** Role `ADMIN` required
- **Response (200 OK):** `{ data: AuditLogEntry[], total: number }`

#### 11. IP Bans Management
- **Endpoints:**
  - `GET /api/v1/admin/ip-bans`
  - `POST /api/v1/admin/ip-bans` `{ "ip": "198.51.100.22", "reason": "Abuse bot", "expiresAt": null }`
  - `DELETE /api/v1/admin/ip-bans/:id`
- **Auth:** Role `ADMIN` required

---

### 2.10 Operational & Embed Routes

#### 1. Server-Rendered Paste Embed
- **Endpoint:** `GET /embed/:id`
- **Query Params:**
  - `theme`: `dark` (default) | `light`
  - `lines`: `on` (default) | `off`
  - `range`: e.g. `10-50` (up to 5,000 lines)
  - `share_token`: string (required if paste is `PRIVATE`)
- **Headers:** Rendered HTML with strict CSP `default-src 'none'; style-src 'unsafe-inline'` and `frame-ancestors *`.
- **Usage:** Used directly in iframe embed codes provided to users.
  ```html
  <iframe src="https://paste.example.com/embed/7k9xM2qL1v?theme=dark&lines=on" width="100%" height="400" frameborder="0"></iframe>
  ```

#### 2. Health & Readiness
- **Endpoints:** `GET /healthz`, `GET /readyz`
- **Response (200 OK):** `{ "status": "ok" }`

---

## 3. Discovered Backend Capability Gaps & Recommendations

Through line-by-line verification of the backend controllers and services, the following discrepancies and missing capabilities were identified:

| Discovered Item | Current Backend Implementation | Frontend Impact | Architecturally Sound Solution |
|---|---|---|---|
| **User Listing Own Unlisted & Private Pastes** | `GET /users/:username/pastes` executes `listPublicPastes` with `publicLiveWhere(now)` strictly filtering `visibility: 'PUBLIC'`. There is no `GET /users/me/pastes` endpoint. | The user dashboard cannot list the user's own `UNLISTED` or `PRIVATE` pastes via the public endpoint. | **Recommended Backend Addition:** Add `GET /api/v1/users/me/pastes` returning `authorId = req.auth.user.id` without the `visibility = 'PUBLIC'` filter.<br>**Interim Frontend Graceful Handling:** In the interim, the frontend displays public pastes from `GET /users/:username/pastes`, plus any pastes saved in user collections/bookmarks, and clearly labels unlisted pastes that are tracked locally. |
| **Anonymous Paste Persistence** | Anonymous pastes return `managementToken` once. There is no query to retrieve "my anonymous pastes" across sessions. | Strangers lose management capability if they navigate away or clear browser storage. | **Frontend Solution:** Provide a local `PasteVault` in browser `localStorage` storing `id`, `slug`, `title`, `createdAt`, and `managementToken` for anonymous creations on that device, with clear "Export / Clear Keys" buttons. |
| **Turnstile CAPTCHA Enforcement** | `verifyCaptcha` checks `env.CAPTCHA_PROVIDER === 'turnstile'`. If active and header `x-captcha-token` is missing, returns 400 `VALIDATION_ERROR`. | Anonymous paste creation and account registration fail in production if Turnstile is enabled on the backend. | **Frontend Solution:** Include Turnstile widget (`@marsidev/react-turnstile`) in registration and anonymous creation forms, passing token as `x-captcha-token` header when present. |
| **CSRF Origin Guard on Mutating Requests** | `originGuard` checks that mutating requests with session cookie carry `Origin` header matching `allowedOrigins` (`APP_BASE_URL` or `FRONTEND_ORIGIN`). | If `FRONTEND_ORIGIN` is not set or frontend runs on an unlisted dev port, POST/PUT/PATCH/DELETE returns 403 `FORBIDDEN`. | **Configuration Requirement:** In development, Vite/Next.js must either proxy requests through same-origin (`/api/v1`), or backend `.env` must define `FRONTEND_ORIGIN=http://localhost:3000`. |
| **Raw Content Omission on Creation** | `POST /pastes` returns `toPasteView(..., { includeContent: false })`. | Frontend does not receive the raw content back in the create response. | **Frontend Solution:** Frontend already has the content in its editor state, but navigates to `/p/:id` where `GET /pastes/:id` fetches the authoritative server-stored content. |
| **OpenAPI / Swagger Spec Discrepancies** | Collections, Bookmarks, and Admin routes are implemented in Express routes but omitted from `openapi.ts`. | Client generator tools reading Swagger UI would miss collections, bookmarks, and admin endpoints. | **Frontend Solution:** Do not rely solely on Swagger UI OpenAPI export; use this handwritten, verified integration matrix. |
