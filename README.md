# 🎨 AI Comic Generator

> 一句话创意，生成你的专属四格漫画

这是一个基于 AI 的专业漫画生成工具，用户只需输入一个简单的创意想法，系统将自动完成剧本创作、角色设计、分镜绘制和对话合成，最终生成一部完整的四格漫画作品。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ 核心特性

### 🎬 智能编剧系统
- AI 自动将一句话创意扩展成完整的四格漫画脚本
- 遵循专业的四幕结构理论（建立、推进、转折、高潮）
- 自动生成场景描述和对话内容

### 🎨 角色一致性保证
- 先生成详细的角色设定图
- 确保整个故事中角色外观统一
- 保持角色特征（服装、发型、表情）

### 🎥 专业镜头语言系统 ⭐ NEW
- **5种景别**：极远景、远景、中景、近景、特写
- **3种角度**：平视、俯视、仰视
- **智能推荐**：AI根据场景自动推荐最佳镜头
- **手动调整**：用户可以精确控制每个分格的镜头
- 基于StudioBinder电影镜头理论

### ✏️ 脚本编辑系统 ⭐ NEW
- 查看AI生成的完整脚本
- 编辑场景描述和对话内容
- 调整镜头类型和角度
- 重新生成单个分格
- 完整的编辑工作流

### 💬 对话气泡自动合成
- 自动将对话文字合成到漫画图片上
- 智能识别对话内容
- 支持多种气泡样式

### 📚 历史记录系统 ⭐ NEW
- **自动保存**：生成完成的漫画自动保存到本地数据库
- **历史查看**：随时浏览所有创作记录
- **重新编辑**：从历史记录加载脚本，继续创作
- **删除管理**：清理不需要的历史记录
- **搜索筛选**：按状态和关键词快速查找

### 📚 经典布局
- 2x2 网格展示
- 经典的四格漫画形式

---

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- pnpm（推荐）或 npm
- OpenAI API 密钥

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/liuestc/ai-comic-generator.git
cd ai-comic-generator
```

2. **配置 API 密钥**

编辑 `backend/.env` 文件：

```bash
# OpenAI API（推荐）
OPENAI_API_KEY=your_openai_api_key_here

# 或者使用 Google Gemini
ACTIVE_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key_here
```

3. **安装依赖**
```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

4. **启动应用**
```bash
# 启动后端服务（端口 3000）
cd backend
pnpm dev

# 在新终端启动前端服务（端口 5173）
cd frontend
pnpm dev
```

5. **访问应用**

打开浏览器访问：http://localhost:5173

---

## 🎮 使用指南

### 基本流程

1. **输入创意**
   - 在输入框中描述你的漫画创意
   - 例如："一个程序员在修复bug时，意外发现了通往数字世界的入口"

2. **生成脚本**
   - 点击"生成脚本"按钮
   - AI会自动生成4格漫画的完整脚本
   - 包含场景描述、对话和推荐的镜头

3. **编辑脚本**（可选）⭐ NEW
   - 查看生成的脚本
   - 编辑场景描述或对话
   - 调整镜头类型和角度
   - 查看AI的镜头推荐

4. **生成图像**
   - 确认脚本后，点击"生成图像"
   - AI会根据脚本生成4张图片
   - 自动添加对话气泡

5. **重新生成**（可选）
   - 如果对某个分格不满意
   - 可以单独重新生成该分格

6. **查看历史** ⭐ NEW
   - 点击“历史记录”标签
   - 浏览所有生成过的漫画
   - 点击任意漫画查看详情
   - 点击“重新编辑”继续创作

### 镜头选择指南 ⭐ NEW

#### 景别（Shot Type）

| 景别 | 用途 | 情感效果 |
|------|------|----------|
| **极远景** | 展示广阔的环境 | 孤独、渺小、史诗感 |
| **远景** | 建立场景和位置 | 客观、全局视角 |
| **中景** | 展示角色和环境的关系 | 平衡、自然 |
| **近景** | 展示角色表情和动作 | 亲密、情感连接 |
| **特写** | 强调细节和情绪 | 紧张、强烈情感 |

#### 角度（Camera Angle）

| 角度 | 用途 | 情感效果 |
|------|------|----------|
| **平视** | 中性视角 | 客观、平等 |
| **俯视** | 从上往下看 | 脆弱、渺小、压迫 |
| **仰视** | 从下往上看 | 强大、威严、英雄感 |

---

## 🏗️ 技术架构

### 前端技术栈

- **框架**：React 19.0.0
- **语言**：TypeScript 5.6.2
- **构建工具**：Vite 6.0.11
- **样式**：Tailwind CSS 3.4.17
- **UI组件**：shadcn/ui（基于Radix UI）
- **图标**：Lucide React

### 后端技术栈

- **运行时**：Node.js 22.13.0
- **框架**：Express 4.21.2
- **语言**：TypeScript 5.7.3
- **数据库**：SQLite (better-sqlite3) ⭐ NEW
- **图像处理**：Sharp 0.33.5
- **AI服务**：OpenAI SDK 4.77.3

### AI模型

- **文本生成**：GPT-4-turbo
- **图像生成**：DALL-E 3（1024x1024，高清质量）

---

## 📁 项目结构

```
ai-comic-generator/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScriptEditor.tsx    # 脚本编辑器 ⭐ NEW
│   │   │   ├── ShotSelector.tsx    # 镜头选择器 ⭐ NEW
│   │   │   ├── HistoryList.tsx     # 历史记录列表 ⭐ NEW
│   │   │   └── HistoryDetail.tsx   # 历史记录详情 ⭐ NEW
│   │   ├── App.tsx                 # 主应用组件
│   │   └── main.tsx                # 入口文件
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── config/
│   │   │   └── shotLanguage.ts     # 镜头语言配置
│   │   ├── services/
│   │   │   ├── scriptService.ts    # 脚本管理服务
│   │   │   ├── imageService.ts     # 图像生成服务
│   │   │   ├── shotRecommendation.ts # 镜头推荐算法
│   │   │   └── databaseService.ts  # 数据库服务 ⭐ NEW
│   │   ├── routes/
│   │   │   ├── comicRoutes.ts      # API路由
│   │   │   └── historyRoutes.ts    # 历史记录路由 ⭐ NEW
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript类型定义
│   │   └── server.ts               # 服务器入口
│   ├── data/
│   │   └── comics.db           # SQLite数据库 ⭐ NEW
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🔌 API 文档

### 生成脚本

```http
POST /api/generate-script
Content-Type: application/json

{
  "topic": "你的漫画创意"
}
```

**响应：**
```json
{
  "success": true,
  "scriptId": "uuid",
  "script": {
    "topic": "...",
    "characterDesign": "...",
    "characterImageUrl": "...",
    "panels": [
      {
        "id": 1,
        "scene": "...",
        "dialogue": "...",
        "shotType": "medium",
        "cameraAngle": "eye_level"
      }
    ]
  }
}
```

### 获取脚本 ⭐ NEW

```http
GET /api/script/:scriptId
```

### 更新脚本 ⭐ NEW

```http
PUT /api/script/:scriptId
Content-Type: application/json

{
  "panels": [
    {
      "id": 1,
      "dialogue": "新的对话",
      "shotType": "close_up"
    }
  ]
}
```

### 获取镜头推荐 ⭐ NEW

```http
GET /api/script/:scriptId/shot-recommendations
```

**响应：**
```json
{
  "success": true,
  "recommendations": [
    {
      "panelId": 1,
      "shotType": "medium",
      "cameraAngle": "eye_level",
      "reason": "建立场景，推荐中景展示环境"
    }
  ]
}
```

### 获取历史记录列表 ⭐ NEW

```http
GET /api/history?page=1&limit=10&status=completed
```

**响应：**
```json
{
  "success": true,
  "data": {
    "comics": [
      {
        "id": "uuid",
        "topic": "...",
        "characterImageUrl": "...",
        "status": "completed",
        "createdAt": "2026-02-05T12:00:00Z",
        "panelCount": 4
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 获取单个漫画详情 ⭐ NEW

```http
GET /api/history/:comicId
```

### 删除漫画 ⭐ NEW

```http
DELETE /api/history/:comicId
```

### 生成完整漫画

```http
POST /api/generate-comic
Content-Type: application/json

{
  "topic": "你的漫画创意",
  "characterDesign": "...",
  "characterImageUrl": "...",
  "panels": [...]
}
```

---

## 🎨 设计理念

### 产品定位

**不是**：简单的AI绘画工具

**而是**：专业的漫画创作辅助工具

### 核心差异

1. **完整的叙事流程**
   - 不只是生成单张图片
   - 而是生成完整的故事

2. **角色一致性**
   - 不是每张图都是独立的
   - 而是保持角色在所有分格中的一致性

3. **专业的分镜理论** ⭐ NEW
   - 不是随机生成构图
   - 而是基于电影镜头理论

4. **用户控制权** ⭐ NEW
   - 不是完全自动化
   - 而是AI辅助人类创作

### 理论基础

- **SFWA（科幻与奇幻作家协会）** - 四幕结构理论
- **Clip Studio** - 漫画分镜设计指南
- **StudioBinder** - 电影镜头语言理论 ⭐ NEW

---

## 🎯 设计亮点

### 1. 角色一致性方案
借鉴 RedInk 项目的优秀设计，我们首先生成一张详细的"角色设定图"，然后在生成每个分镜时都引用这个角色设定，确保主角在不同画面中的外观保持一致。

### 2. 可编辑的工作流 ⭐ NEW
在生成最终图片前，允许用户编辑脚本内容。这极大地提升了产品的可控性和用户满意度，用户可以：
- 查看完整脚本
- 编辑场景和对话
- 调整镜头类型和角度
- 重新生成单个分格

### 3. 专业镜头语言 ⭐ NEW
基于StudioBinder的电影镜头理论，实现了：
- 5种景别 × 3种角度 = 15种镜头组合
- 智能推荐系统根据场景自动选择
- 每种镜头都有明确的情感效果
- 符合专业漫画分镜标准

### 4. 对话气泡自动合成
使用 Sharp 图像处理库，自动将对话文字以"漫画气泡"的形式叠加到图片上，省去了用户手动添加文字的麻烦。

---

## 🧪 测试

### 手动测试

使用curl测试API：

```bash
# 生成脚本
curl -X POST http://localhost:3000/api/generate-script \
  -H "Content-Type: application/json" \
  -d '{"topic": "一个程序员的日常"}'

# 获取脚本
curl http://localhost:3000/api/script/{scriptId}

# 更新脚本
curl -X PUT http://localhost:3000/api/script/{scriptId} \
  -H "Content-Type: application/json" \
  -d '{"panels": [{"id": 1, "dialogue": "新对话"}]}'

# 获取镜头推荐
curl http://localhost:3000/api/script/{scriptId}/shot-recommendations
```

---

## 🔮 未来规划

### 短期（1周内）

- [x] 持久化存储（SQLite） ✅
- [x] 历史记录系统 ✅
- [ ] 前端历史记录UI测试
- [ ] 导出功能（PDF、图片）

### 中期（1个月内）

- [ ] 动态布局系统（2-6格）
- [ ] 更多风格选项
- [ ] 导出功能（PDF、图片）
- [ ] 用户历史记录

### 长期（3个月内）

- [ ] 用户系统（注册/登录）
- [ ] 社区分享功能
- [ ] 高级编辑功能
- [ ] API服务开放

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- **OpenAI** - 提供GPT-4和DALL-E 3 API
- **RedInk项目** - 角色一致性技术灵感和优秀的工作流设计
- **shadcn/ui** - 优秀的UI组件库
- **StudioBinder** - 专业的镜头语言理论

---

## 📧 联系方式

- GitHub: [@liuestc](https://github.com/liuestc)
- 项目链接: [https://github.com/liuestc/ai-comic-generator](https://github.com/liuestc/ai-comic-generator)

---

## 🌟 Star History

如果这个项目对你有帮助，请给它一个⭐️！

---

**Made with ❤️ by liuestc + Manus AI**
