# 数据库设置说明

## 重要变更

从本次提交开始，`backend/data/comics.db` 不再提交到Git仓库。

### 为什么？

**问题**：
- 数据库被提交到Git，但图片被.gitignore忽略
- 导致多人协作时数据库有记录但图片不存在
- 造成图片404错误和数据不一致

**解决方案**：
- 数据库和图片都是本地生成的
- 每个开发者有独立的数据环境
- 避免合并冲突和数据混乱

## 首次设置

### 1. 克隆仓库
```bash
git clone https://github.com/liuestc/ai-comic-generator.git
cd ai-comic-generator
```

### 2. 安装依赖
```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

### 3. 配置环境变量
```bash
cd backend
cp .env.example .env
# 编辑.env文件，填入你的API密钥
```

### 4. 初始化数据库
```bash
cd backend
pnpm run init-db
```

输出示例：
```
🔧 Initializing database...

✅ Database initialized successfully!
📊 Tables created:
   - comics
   - panels

💡 You can now start the server with: pnpm dev
```

### 5. 启动服务
```bash
# 启动后端
cd backend
pnpm dev

# 启动前端（新终端）
cd frontend
pnpm dev
```

## 数据管理

### 检查孤立数据
```bash
cd backend
pnpm run clean-orphans
```

这个脚本会检查：
- 数据库中有记录但图片不存在的情况
- 文件系统中有图片但数据库无记录的情况

### 重置数据库
```bash
cd backend
rm data/comics.db
pnpm run init-db
```

### 备份数据
```bash
# 备份数据库
cp backend/data/comics.db backend/data/comics.db.backup

# 备份图片
cp -r backend/public/images backend/public/images.backup
```

## 常见问题

### Q: 为什么我拉取代码后历史记录是空的？
A: 因为数据库是本地的，不会同步。这是正常的。你可以：
- 自己生成漫画来填充数据
- 从其他开发者那里获取数据库备份

### Q: 为什么我看到图片404错误？
A: 可能的原因：
1. 数据库中有记录但图片文件不存在
2. 运行 `pnpm run clean-orphans` 检查

### Q: 如何与其他开发者共享数据？
A: 数据库和图片都是本地的，不建议共享。如果需要：
1. 导出数据库：`cp backend/data/comics.db shared/`
2. 导出图片：`cp -r backend/public/images shared/`
3. 其他开发者复制到对应位置

### Q: 生产环境怎么办？
A: 生产环境应该使用：
- 云数据库（PostgreSQL/MySQL）
- 云存储（S3/OSS）存储图片
- 不使用本地SQLite和本地文件系统

## 文件结构

```
backend/
├── data/
│   ├── comics.db          # ❌ 不提交到Git（本地生成）
│   ├── comics.db-journal  # ❌ 不提交到Git（SQLite临时文件）
│   └── comics.db-wal      # ❌ 不提交到Git（SQLite临时文件）
├── public/
│   └── images/
│       ├── *.png          # ❌ 不提交到Git（生成的图片）
│       ├── *.jpg          # ❌ 不提交到Git（生成的图片）
│       └── *.jpeg         # ❌ 不提交到Git（生成的图片）
└── src/
    └── scripts/
        ├── initDatabase.ts      # ✅ 数据库初始化脚本
        └── cleanOrphans.ts      # ✅ 数据清理脚本
```

## 迁移指南

### 如果你已经有本地数据

**选项1：保留本地数据（推荐）**
```bash
# 拉取最新代码
git pull origin main

# 你的数据库和图片不会被影响
# 继续使用即可
```

**选项2：重新开始**
```bash
# 删除旧数据
rm backend/data/comics.db
rm -rf backend/public/images/*

# 拉取最新代码
git pull origin main

# 初始化新数据库
cd backend
pnpm run init-db
```

## 技术细节

### 为什么不使用云存储？

**开发环境**：
- 使用本地SQLite + 本地文件系统
- 快速、简单、无需额外配置
- 每个开发者独立环境

**生产环境**：
- 应该使用云数据库 + 云存储
- 多实例共享状态
- 高可用、可扩展

### .gitignore配置

```gitignore
# Database (local development only)
backend/data/comics.db
backend/data/comics.db-journal
backend/data/comics.db-wal

# Generated images
backend/public/images/*.png
backend/public/images/*.jpg
backend/public/images/*.jpeg
```

## 支持

如果遇到问题，请：
1. 检查是否运行了 `pnpm run init-db`
2. 检查环境变量是否正确配置
3. 运行 `pnpm run clean-orphans` 检查数据一致性
4. 查看 [GitHub Issues](https://github.com/liuestc/ai-comic-generator/issues)
