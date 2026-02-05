# 多阶段构建 Dockerfile

# Stage 1: 构建前端
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ ./
RUN pnpm build

# Stage 2: 构建后端
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: 生产环境
FROM node:22-alpine
WORKDIR /app

# 安装生产依赖
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production

# 复制构建产物
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./public

# 创建图片存储目录
RUN mkdir -p ./public/images

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/server.js"]
