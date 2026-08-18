FROM oven/bun:1-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application source
COPY . .
RUN mkdir -p public

# Build Next.js standalone application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_PREVIEW=true
ENV NEXT_PUBLIC_PREVIEW=$NEXT_PUBLIC_PREVIEW
ARG GRAVATAR_HASH=18c3d026295ecf736fc2e8a027163e5718e106d5643774c2d1ebe421458b3b58
ENV GRAVATAR_HASH=$GRAVATAR_HASH
RUN bun run build

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV GRAVATAR_HASH=18c3d026295ecf736fc2e8a027163e5718e106d5643774c2d1ebe421458b3b58

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=base /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
