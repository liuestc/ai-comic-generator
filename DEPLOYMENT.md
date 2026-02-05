# 🚀 部署指南

本文档提供了多种部署 AI 漫剧生成器的方法。

## 📋 前置要求

- Node.js 22+ 
- pnpm（用于前端）
- 有效的 AI API 密钥（Google Gemini 或 OpenAI）

## 🐳 Docker 部署（推荐）

### 1. 使用 Docker Compose

这是最简单的部署方式：

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd comic-ai

# 2. 创建 .env 文件
cp backend/.env.example backend/.env
# 编辑 .env 文件，填入你的 API 密钥

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down
```

访问 `http://localhost:3001` 即可使用。

### 2. 使用 Docker（手动）

```bash
# 构建镜像
docker build -t comic-ai:latest .

# 运行容器
docker run -d \
  -p 3001:3001 \
  -e GOOGLE_API_KEY=your_key_here \
  -e ACTIVE_PROVIDER=gemini \
  -v $(pwd)/backend/public/images:/app/public/images \
  --name comic-ai \
  comic-ai:latest
```

## 💻 本地开发部署

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
pnpm install
```

### 2. 配置环境变量

编辑 `backend/.env` 文件：

```bash
GOOGLE_API_KEY=your_google_api_key_here
ACTIVE_PROVIDER=gemini
```

### 3. 启动服务

**方式一：使用启动脚本**

```bash
./start.sh
```

**方式二：分别启动**

```bash
# 终端 1：后端
cd backend
npm run dev

# 终端 2：前端
cd frontend
pnpm dev
```

## ☁️ 云平台部署

### Vercel / Netlify（前端）

前端是纯静态应用，可以部署到 Vercel 或 Netlify：

```bash
cd frontend
pnpm build
# 将 dist/ 目录部署到 Vercel/Netlify
```

### Railway / Render（后端）

1. 连接你的 GitHub 仓库
2. 设置构建命令：`cd backend && npm install && npm run build`
3. 设置启动命令：`cd backend && npm start`
4. 添加环境变量（API 密钥等）

### AWS / Google Cloud / Azure

使用 Docker 镜像部署到云平台的容器服务：

1. 构建并推送镜像到容器注册表
2. 创建容器实例
3. 配置环境变量
4. 设置持久化存储（用于图片）

## 🔒 生产环境注意事项

### 1. 安全性

- **永远不要**将 `.env` 文件提交到 Git
- 使用环境变量管理敏感信息
- 配置 CORS 白名单（`CORS_ORIGIN` 环境变量）
- 考虑添加 API 速率限制

### 2. 性能优化

- 使用 CDN 加速静态资源
- 配置图片自动清理（避免磁盘占满）
- 考虑使用对象存储（如 S3）存储生成的图片
- 添加 Redis 缓存（可选）

### 3. 监控与日志

- 配置日志收集（如 Winston + LogStash）
- 设置错误监控（如 Sentry）
- 监控 API 调用次数和成本

### 4. 扩展性

- 使用负载均衡器（如 Nginx）
- 考虑将图像生成任务放入消息队列（如 RabbitMQ）
- 实现任务状态持久化（如 PostgreSQL）

## 📊 资源需求

### 最小配置
- CPU: 1 核
- 内存: 1GB
- 磁盘: 10GB

### 推荐配置
- CPU: 2 核
- 内存: 2GB
- 磁盘: 20GB（根据图片生成量调整）

## 🔧 故障排查

### 问题：后端启动失败

```bash
# 检查日志
docker logs comic-ai

# 或本地开发
cd backend && npm run dev
```

常见原因：
- API 密钥未配置或无效
- 端口被占用
- 依赖未正确安装

### 问题：图片生成失败

检查：
- API 密钥是否有效
- API 配额是否用尽
- 网络连接是否正常
- Prompt 是否符合 AI 服务商的内容政策

### 问题：前端无法连接后端

检查：
- 后端是否正常运行（访问 `http://localhost:3001/api/health`）
- CORS 配置是否正确
- 代理配置是否正确（`vite.config.ts`）

## 📞 获取帮助

如果遇到问题，请：
1. 查看项目 README.md
2. 检查 GitHub Issues
3. 提交新的 Issue（附带详细的错误信息和环境描述）

---

祝部署顺利！🎉
