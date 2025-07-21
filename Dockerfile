FROM node:24-alpine

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

# Build API
RUN pnpm run build:api

# Set working directory to API  
WORKDIR /app/apps/api

EXPOSE 3001

CMD ["pnpm", "start"]