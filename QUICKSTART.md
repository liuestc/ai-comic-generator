# ⚡ 快速开始指南

5 分钟内启动你的 AI 漫剧生成器！

## 📋 准备工作

你需要：
1. ✅ Node.js 22+（[下载地址](https://nodejs.org/)）
2. ✅ pnpm（运行 `npm install -g pnpm` 安装）
3. ✅ Google Gemini API Key（[获取地址](https://aistudio.google.com/app/apikey)）

## 🚀 三步启动

### Step 1: 配置 API 密钥

打开 `backend/.env` 文件，填入你的 API 密钥：

```bash
GOOGLE_API_KEY=你的密钥
ACTIVE_PROVIDER=gemini
```

> 💡 **提示：** 如果使用 OpenAI，将 `ACTIVE_PROVIDER` 改为 `openai`，并填入 `OPENAI_API_KEY`。

### Step 2: 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
pnpm install
```

### Step 3: 启动服务

**最简单的方式（推荐）：**

```bash
# 在项目根目录
./start.sh
```

**或者分别启动：**

```bash
# 终端 1：后端
cd backend
npm run dev

# 终端 2：前端
cd frontend
pnpm dev
```

## 🎉 开始使用

1. 打开浏览器访问：`http://localhost:5173`
2. 输入你的创意（例如："一只猫咪成为了程序员"）
3. 点击"生成脚本"
4. 编辑脚本（可选）
5. 点击"生成漫画"
6. 等待 AI 绘制你的专属四格漫画！

## ⏱ 预计时间

- 脚本生成：约 10-20 秒
- 角色设定图：约 10-15 秒
- 四格漫画：约 30-60 秒（并发生成）

**总计：** 约 1-2 分钟完成整个创作流程

## 🎨 创意示例

不知道输入什么？试试这些：

1. "一个程序员在修复 bug 时，意外发现了通往数字世界的入口"
2. "一只猫咪学会了使用电脑，开始给主人发邮件"
3. "一个咖啡杯突然有了生命，开始在办公室里冒险"
4. "一个设计师的灵感精灵罢工了，他必须想办法哄它回来"
5. "一个外卖员在送餐途中，遇到了来自未来的自己"

## 🐛 遇到问题？

### 后端无法启动

```bash
# 检查 API 密钥是否正确配置
cat backend/.env

# 检查端口是否被占用
lsof -i :3001
```

### 前端无法连接后端

```bash
# 测试后端是否正常运行
curl http://localhost:3001/api/health
```

### 图片生成失败

- 检查 API 密钥是否有效
- 检查 API 配额是否用尽
- 查看后端日志获取详细错误信息

## 📚 下一步

- 阅读 [README.md](./README.md) 了解项目详情
- 阅读 [FEATURES.md](./FEATURES.md) 了解技术亮点
- 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署方案

## 💡 小贴士

1. **首次生成可能较慢**：AI 模型需要"预热"
2. **编辑脚本很重要**：微调后的效果往往更好
3. **保存你的作品**：点击"下载漫画"保存图片
4. **尝试不同风格**：在脚本中加入"赛博朋克风格"、"水墨画风格"等描述

---

祝你创作愉快！🎨✨
