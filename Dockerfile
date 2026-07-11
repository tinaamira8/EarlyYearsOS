FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY src/ ./src/
COPY tsconfig.json ./
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080
CMD ["npx", "tsx", "src/server.ts"]
