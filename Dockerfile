# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Install dependencies
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# SPA needs env vars at build time. Pass through as build arg
ARG VITE_SERVER_API_ENDPOINT


# Set environment variables during the build process
ENV VITE_SERVER_API_ENDPOINT=$VITE_SERVER_API_ENDPOINT


# Build the application
RUN pnpm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
