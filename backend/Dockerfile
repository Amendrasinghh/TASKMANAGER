# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# Inject production API URL directly into frontend build
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Build Backend
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/ .

# Copy built frontend into the expected directory structure relative to backend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
