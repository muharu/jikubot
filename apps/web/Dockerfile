# Base image with Node.js Alpine Linux
FROM node:20.15-alpine AS base

# Stage 1: Builder ------------------------------------------------------------------------------------------
FROM base AS builder

# Update APK package manager and install compatibility libraries
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install Turbo globally (Replace with the version you need)
RUN npm install -g turbo@^2

# Copy project files
COPY . .

# Prune the monorepo and generate a partial monorepo with a pruned lockfile
RUN turbo prune web --docker
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
COPY --from=builder /app/out/full/ .

# Setup environment variables (use build args to pass sensitive data securely)
ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL

ARG AUTH_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

# Uncomment to enable remote caching if required
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Build the project
RUN pnpm turbo run build --filter=web...
# ------------------------------------------------------------------------------------------------------------

# Stage 3: Runner --------------------------------------------------------------------------------------------
FROM base AS runner

# Set working directory
WORKDIR /app

# Create a non-root user and group for running the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown nextjs:nodejs /app

# Copy the built application and set ownership for the non-root user
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Run the application as the non-root user
USER nextjs
CMD ["node", "apps/web/server.js"]
# -------------------------------------------------------------------------------------------------------------
