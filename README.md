# 🎨 AI 漫剧生成器

> 一句话创意，生成你的专属四格漫画

这是一个基于 AI 的漫画生成工具，用户只需输入一个简单的创意想法，系统将自动完成剧本创作、角色设计、分镜绘制和对话合成，最终生成一部完整的四格漫画作品。

## ✨ 核心特性

- **🎬 智能编剧**：AI 自动将一句话创意扩展成完整的四格漫画脚本
- **🎨 角色一致性**：先生成角色设定图，确保整个故事中角色外观统一
- **💬 对话气泡**：自动将对话文字合成到漫画图片上
- **✏️ 可编辑脚本**：在生成图片前，用户可以修改和优化脚本内容
- **📖 经典布局**：2x2 网格展示，经典的四格漫画形式

## 🛠 技术栈

### 后端
- **Node.js** + **Express** + **TypeScript**
- **OpenAI API** / **Google Gemini API**（文本生成 + 图像生成）
- **Sharp**（图像处理和对话气泡合成）

### 前端
- **Vue 3** + **TypeScript**
- **Vite**（构建工具）
- **Axios**（API 通信）

## 📦 项目结构

```
comic-ai/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── services/       # 业务服务（脚本生成、图像生成）
│   │   ├── utils/          # 工具类（AI 客户端、配置、日志）
│   │   ├── types/          # TypeScript 类型定义
│   │   ├── prompts/        # AI Prompt 模板
│   │   └── server.ts       # 服务器入口
│   ├── public/images/      # 生成的图片存储
│   ├── .env                # 环境变量配置
│   └── package.json
│
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # Vue 组件
│   │   ├── api/           # API 客户端
│   │   ├── types/         # TypeScript 类型
│   │   ├── App.vue        # 主应用组件
│   │   └── main.ts        # 应用入口
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🚀 快速开始

### 1. 配置 API 密钥

编辑 `backend/.env` 文件，填入你的 API 密钥：

```bash
# 如果使用 Google Gemini（推荐）
ACTIVE_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key_here

# 或者使用 OpenAI
ACTIVE_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
pnpm install
```

### 3. 启动服务

**方式一：分别启动（推荐开发时使用）**

```bash
# 终端 1：启动后端
cd backend
npm run dev

# 终端 2：启动前端
cd frontend
pnpm dev
```

**方式二：使用启动脚本**

```bash
# 在项目根目录
./start.sh
```

### 4. 访问应用

打开浏览器访问：`http://localhost:5173`

## 📖 使用指南

1. **输入创意**：在输入框中输入你的创意想法（例如："一个程序员在修复bug时，意外发现了通往数字世界的入口"）
2. **生成脚本**：点击"生成脚本"按钮，AI 将自动创作四格漫画脚本和角色设定
3. **编辑脚本**：查看并编辑每一格的画面描述和对话内容
4. **生成漫画**：点击"生成漫画"按钮，AI 将绘制所有分镜并合成对话气泡
5. **下载作品**：查看完成的四格漫画，并下载保存

## 🎯 设计亮点

### 1. 角色一致性方案
借鉴 RedInk 项目的优秀设计，我们首先生成一张详细的"角色设定图"，然后在生成每个分镜时都引用这个角色设定，确保主角在不同画面中的外观保持一致。

### 2. 可编辑的工作流
在生成最终图片前，允许用户编辑脚本内容。这极大地提升了产品的可控性和用户满意度，是从 RedInk 项目中学到的关键经验。

### 3. 对话气泡自动合成
使用 Sharp 图像处理库，自动将对话文字以"漫画气泡"的形式叠加到图片上，省去了用户手动添加文字的麻烦。

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 后端服务端口 | `3001` |
| `CORS_ORIGIN` | 前端地址（CORS） | `http://localhost:5173` |
| `ACTIVE_PROVIDER` | AI 服务商 (`openai` 或 `gemini`) | `gemini` |
| `GOOGLE_API_KEY` | Google Gemini API 密钥 | - |
| `OPENAI_API_KEY` | OpenAI API 密钥 | - |
| `TEXT_MODEL` | 文本生成模型 | `gemini-2.0-flash-exp` |
| `IMAGE_MODEL` | 图像生成模型 | `imagen-3.0-generate-001` |

## 📝 API 文档

### POST /api/generate-script
生成漫画脚本

**请求体：**
```json
{
  "topic": "一个程序员的奇幻冒险"
}
```

**响应：**
```json
{
  "success": true,
  "script": {
    "title": "程序员的奇幻冒险",
    "characterDescription": "...",
    "panels": [...]
  },
  "characterImageUrl": "/images/character_xxx.png"
}
```

### POST /api/generate-comic
生成完整漫画

**请求体：**
```json
{
  "script": { ... },
  "characterImageUrl": "/images/character_xxx.png"
}
```

**响应：**
```json
{
  "success": true,
  "panels": [
    {
      "index": 1,
      "sceneDescription": "...",
      "dialogue": "...",
      "imageUrl": "/images/panel_xxx_1.png"
    },
    ...
  ]
}
```

## 🎓 学习与参考

本项目深度借鉴了 [RedInk](https://github.com/HisMax/RedInk) 项目的优秀设计：
- ✅ 清晰的工作流（输入 → 生成草稿 → 用户编辑 → 最终生成）
- ✅ 灵活的 AI 服务商配置系统
- ✅ 详细的错误处理和日志记录
- ✅ 前后端分离架构

在此基础上，我们针对"漫画"场景做出了创新：
- 🎨 角色一致性方案（先生成角色设定图）
- 💬 对话气泡自动合成
- 📖 四格漫画专属布局

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢 [RedInk](https://github.com/HisMax/RedInk) 项目提供的优秀参考
- 感谢 OpenAI 和 Google 提供的强大 AI 能力

---

**Made with ❤️ for creators**
