# Production Deployment Guide — Full-Stack Paste Platform

This guide provides complete instructions for deploying the Paste platform to production. The platform consists of five interconnected subsystems:

1. **PostgreSQL 16+** (Relational storage with Prisma ORM)
2. **Redis 7+** (Append-only persistence for BullMQ queues, rate limiting, and analytics view buffers)
3. **Backend API** (Express 5 + TypeScript on Node.js 22)
4. **Backend Worker** (BullMQ background processor for email, expiration sweepers, and view flushers)
5. **Frontend Application** (Next.js 15 standalone server)

---

## 1. Pre-Deployment Configuration Checklist

Before deploying, prepare your production environment configuration. Copy `.env.production.example` to `.env` and configure the following parameters:

### 1.1 Cryptographic Secrets Generation
Generate high-entropy CSPRNG secrets using Node.js:
```bash
# 1. SESSION_SECRET (64-character hex used for visitor HMAC hashing)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. COOKIE_KEYS (Base64 string used for cookie signing and encryption)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. POSTGRES & REDIS Passwords
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

### 1.2 Production Environment Variables Matrix

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment identifier | `production` |
| `PORT` | Backend internal port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/paste?sslmode=require` |
| `REDIS_URL` | Redis connection string with auth | `redis://:password@host:6379` |
| `TRUST_PROXY` | Number of trusted reverse proxy hops | `1` (for single Nginx/Cloudflare hop) |
| `FRONTEND_ORIGIN` | Public domain of the frontend | `https://paste.yourdomain.com` |
| `APP_BASE_URL` | Public base URL of API (or frontend) | `https://paste.yourdomain.com` |
| `SESSION_SECRET` | HMAC salt for visitor tracking | *(generated hex string)* |
| `COOKIE_KEYS` | Cookie encryption and signing keys | *(generated base64 string)* |
| `SMTP_HOST` | Production SMTP host | `smtp.resend.com` (or Postmark / SES / SendGrid) |
| `SMTP_PORT` | SMTP port | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | SMTP username | `resend` |
| `SMTP_PASSWORD` | SMTP API key or password | *(your provider key)* |
| `EMAIL_FROM` | Sender address | `Paste <no-reply@yourdomain.com>` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | *(optional)* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | *(optional)* |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | *(optional)* |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | *(optional)* |

---

## 2. Deployment Option A: Turnkey Docker Compose (Recommended for VPS / Dedicated)

The project includes production-ready multi-stage Dockerfiles for both Backend and Frontend, alongside a production `docker-compose.prod.yml`.

### Step 1: Clone Repository on Server
```bash
git clone https://github.com/your-username/paste.git /opt/paste
cd /opt/paste
```

### Step 2: Configure Environment
```bash
cp .env.production.example .env
nano .env
```

### Step 3: Launch Services & Run Migrations
```bash
# Build and start all 5 containers in the background:
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations:
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Step 4: Promote Initial Administrator (Optional)
To promote your initial account to `ADMIN`:
```bash
docker compose -f docker-compose.prod.yml exec api npx tsx -e "
import('./dist/lib/prisma.js').then(async ({ prisma }) => {
  await prisma.user.update({ where: { username: 'your_username' }, data: { role: 'ADMIN' } });
  console.log('Promoted to ADMIN');
  process.exit(0);
});"
```

---

## 3. Deployment Option B: Bare-Metal / VPS (PM2 + Nginx)

If deploying directly on an Ubuntu/Debian server without Docker:

### Step 1: System Prerequisites
- Node.js 22 LTS
- PostgreSQL 16
- Redis 7
- Nginx & Certbot

### Step 2: Build Artifacts
```bash
# Backend build
cd /opt/paste/Backend
npm ci
npx prisma generate
npm run build
npx prisma migrate deploy

# Frontend build
cd /opt/paste/Frontend
npm ci
npm run build
```

### Step 3: Process Management (PM2)
Create PM2 config or use `Backend/deploy/ecosystem.config.cjs`:
```javascript
module.exports = {
  apps: [
    {
      name: 'paste-api',
      cwd: '/opt/paste/Backend',
      script: 'dist/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3000 }
    },
    {
      name: 'paste-worker',
      cwd: '/opt/paste/Backend',
      script: 'dist/worker.js',
      instances: 1,
      kill_timeout: 30000,
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'paste-frontend',
      cwd: '/opt/paste/Frontend',
      script: 'npm',
      args: 'start -- -p 3001',
      instances: 1,
      env: { NODE_ENV: 'production', BACKEND_URL: 'http://localhost:3000' }
    }
  ]
};
```
Start processes:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Step 4: Nginx Reverse Proxy
Install Nginx config from `Backend/deploy/nginx.conf`:
- Point `location /` to `http://localhost:3001` (Next.js).
- Next.js proxies `/api/v1/` to `http://localhost:3000` (Express API).
- Run `certbot --nginx -d paste.yourdomain.com` for automated SSL certificate provisioning.

---

## 4. Deployment Option C: Cloud PaaS (Vercel + Railway / Render)

For managed serverless hosting:

1. **Frontend (Vercel):**
   - Connect GitHub repo, select `Frontend` root directory.
   - Build command: `npm run build`
   - Output directory: `.next`
   - Environment variables:
     - `BACKEND_URL`: URL of your deployed backend (e.g. `https://api.yourdomain.com`).
2. **Backend & Worker (Railway / Render / Fly.io):**
   - Service 1: API (Build from `Backend/`, command: `node dist/server.js`, port 3000).
   - Service 2: Worker (Build from `Backend/`, command: `node dist/worker.js`).
3. **Managed Databases:**
   - PostgreSQL: Supabase, Neon, or Railway PostgreSQL.
   - Redis: Upstash Redis (ensure persistence is enabled).

---

## 5. Post-Deployment Verification & Smoke Tests

After deployment, perform the following automated sanity checks:

```bash
# 1. API Health Check
curl -i https://paste.yourdomain.com/api/v1/healthz
# Expected: HTTP 200 OK {"status":"ok"}

# 2. API Readiness Gate (DB + Redis connectivity)
curl -i https://paste.yourdomain.com/api/v1/readyz
# Expected: HTTP 200 OK {"status":"ready","database":"connected","redis":"connected"}

# 3. Create Smoke Paste via API
curl -i -X POST https://paste.yourdomain.com/api/v1/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Deployment smoke test payload","syntax":"plaintext","visibility":"public"}'
# Expected: HTTP 201 Created with paste ID and URL
```

---

## 6. Backups & Disaster Recovery

- **Nightly Backups:** Run `Backend/deploy/backup.sh /var/backups/paste 30` via cron (`0 3 * * *`).
- **Recovery Drill:** Verified quarterly using `Backend/deploy/restore-drill.sh`. Restores database dump into isolated scratch database and verifies counts across all 18 tables.
- **RPO / RTO:** Recovery Point Objective: 24 hours. Recovery Time Objective: < 1 hour. Redis is purely ephemeral/reconstructable — upon Redis loss, worker sweeps automatically rebuild correctness.
