# Multi-stage production Dockerfile for Pastebin Backend (API & Worker)
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (argon2)
RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig*.json prisma.config.ts ./
COPY prisma ./prisma/

RUN npm ci

COPY src ./src/

RUN npm run build

# Remove development dependencies to keep production footprint minimal
RUN npm prune --omit=dev

# ---- Production Runner Stage ----
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install curl for docker healthchecks
RUN apk add --no-cache curl

COPY package*.json prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Non-root security
USER node

EXPOSE 3000

# Default command starts the API; can be overridden to "node dist/worker.js"
CMD ["node", "dist/server.js"]
