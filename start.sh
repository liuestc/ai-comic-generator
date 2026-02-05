#!/bin/bash

echo "=========================================="
echo "🚀 AI 漫剧生成器 - 启动脚本"
echo "=========================================="
echo ""

# 检查是否安装了依赖
if [ ! -d "backend/node_modules" ]; then
    echo "📦 检测到后端依赖未安装，正在安装..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 检测到前端依赖未安装，正在安装..."
    cd frontend && pnpm install && cd ..
fi

echo ""
echo "✅ 依赖检查完成"
echo ""
echo "🔧 正在启动服务..."
echo ""

# 启动后端（后台运行）
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo "   日志文件: backend.log"
echo ""

# 等待后端启动
sleep 3

# 启动前端（前台运行）
cd frontend
echo "✅ 前端服务正在启动..."
echo ""
echo "=========================================="
echo "🎉 应用已启动！"
echo "=========================================="
echo ""
echo "📍 前端地址: http://localhost:5173"
echo "📍 后端地址: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

pnpm dev

# 前端停止后，清理后端进程
echo ""
echo "🛑 正在停止后端服务..."
kill $BACKEND_PID 2>/dev/null
echo "✅ 所有服务已停止"
