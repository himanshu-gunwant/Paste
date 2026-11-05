# Multi-stage production Dockerfile for Pastebin Backend (API & Worker)
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (argon2)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig*.json ./
COPY src ./src/

RUN npm run build

# ---- Production Runner Stage ----
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install curl for docker healthchecks
RUN apk add --no-cache curl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

# Non-root security
USER node

EXPOSE 3000

# Default command starts the API; can be overridden to "node dist/worker.js"
CMD ["node", "dist/server.js"]
