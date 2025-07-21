FROM node:24-alpine

# Use environment variable instead of build arg
ENV SERVICE=${SERVICE:-api}

# Install pnpm
RUN npm install -g pnpm@10.11.1

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all source code
COPY packages ./packages/
COPY apps ./apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm run build:shared

# Build the specified service
RUN pnpm run build:${SERVICE}

# Set working directory based on service
WORKDIR /app/apps/${SERVICE}

EXPOSE 3000

# Different start commands based on service
CMD if [ "$SERVICE" = "web" ]; then \
      pnpm preview --host 0.0.0.0 --port ${PORT:-3000}; \
    else \
      pnpm start; \
    fi