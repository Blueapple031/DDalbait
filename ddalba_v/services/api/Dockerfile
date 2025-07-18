# Base stage with Node.js
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies needed for node-gyp
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY packages/config/package.json ./packages/config/
COPY packages/graphql-client/package.json ./packages/graphql-client/
COPY services/api/package.json ./services/api/

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the API
RUN yarn workspace @hoops-platform/api build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/services/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/services/api/package.json ./package.json
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 3001

ENV NODE_ENV production
ENV PORT 3001

CMD ["node", "dist/main.js"] 