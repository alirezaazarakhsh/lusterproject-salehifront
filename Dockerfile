# =========================================================
# Multi-stage Dockerfile for Salehi Luxury Chandelier Platform
# Includes Vite Frontend build + Full-Stack Express Server + PostgreSQL
# =========================================================

# Stage 1: Build Frontend
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* bun.lock* ./
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies and tsx for execution
COPY package.json package-lock.json* bun.lock* ./
RUN npm install --omit=dev --legacy-peer-deps && npm install -g tsx

# Copy built application and required assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json
COPY --from=builder /app/firestore.rules ./firestore.rules

# Expose server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start full-stack server
CMD ["tsx", "server.ts"]
