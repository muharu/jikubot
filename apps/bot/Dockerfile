# Base image with Node.js Alpine Linux
FROM node:20.15-alpine AS base

# Stage 1: Builder ------------------------------------------------------------------------------------------
FROM base AS builder

# Update APK package manager and install compatibility libraries
RUN apk update && apk add --no-cache libc6-compat

# Install Turbo globally (Replace with the version you need)
RUN npm install -g turbo@^2

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Prune the monorepo and generate a partial monorepo with a pruned lockfile
RUN turbo prune bot --docker
# ------------------------------------------------------------------------------------------------------------

# Stage 2: Installer -----------------------------------------------------------------------------------------
FROM base AS installer

# Update APK package manager and install compatibility libraries
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy the pruned lockfile and workspace configuration from the builder stage
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install PNPM globally
RUN npm install -g pnpm

# Install project dependencies using PNPM
RUN pnpm install

# Copy the full pruned build output
COPY --from=builder /app/out/full/ /app/

# Setup environment variables (use build args to pass sensitive data securely)
ARG BOT_DISCORD_TOKEN
ENV BOT_DISCORD_TOKEN=$BOT_DISCORD_TOKEN

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

# Uncomment to enable remote caching if required
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Build the project
RUN pnpm turbo run build --filter=bot...
# ------------------------------------------------------------------------------------------------------------

# Stage 3: Runner --------------------------------------------------------------------------------------------
FROM base AS runner

# Set working directory
WORKDIR /app

# Create a non-root user and group for running the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bot && \
    chown bot:nodejs /app

# Copy the built application and set ownership for the non-root user
COPY --from=installer --chown=bot:nodejs /app/apps/bot/dist /app/apps/bot/dist

# Run the application as the non-root user
USER bot
CMD ["node", "apps/bot/dist/cluster.js"]
# -------------------------------------------------------------------------------------------------------------
