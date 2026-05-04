FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/ .
EXPOSE 5001
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
