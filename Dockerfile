FROM node:24-alpine

# Use environment variable (available at both build and runtime)
ARG SERVICE
ENV SERVICE=${SERVICE:-api}

# Add this for Vite environment variables
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

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

EXPOSE 5173

# Different start commands based on service
CMD if [ "$SERVICE" = "web" ]; then \
      echo "Starting web service in directory: $(pwd)" && \
      echo "Railway assigned PORT: $PORT" && \
      echo "Contents of dist:" && ls -la dist/ && \
      echo "Testing if port $PORT is available..." && \
      echo "Starting vite preview..." && \
      vite preview --host 0.0.0.0 --port $PORT --strictPort & \
      VITE_PID=$! && \
      sleep 5 && \
      echo "Checking if vite is still running..." && \
      ps aux | grep vite && \
      echo "Testing local connection..." && \
      wget -O- http://localhost:$PORT/ || echo "Local connection failed" && \
      wait $VITE_PID; \
    else \
      pnpm start; \
    fi
    