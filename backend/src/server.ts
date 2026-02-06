import express from 'express';
import cors from 'cors';
import path from 'path';
import { config, validateConfig } from './utils/config';
import { logger } from './utils/logger';
import comicRoutes from './routes/comicRoutes';
import historyRoutes from './routes/historyRoutes';
import inspirationRoutes from './routes/inspirationRoutes';
import structureRoutes from './routes/structureRoutes';
import agentRoutes from './routes/agentRoutes';

/**
 * Express 服务器主文件
 */

function createApp() {
  const app = express();

  // 中间件
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 静态文件服务（图片）
  app.use('/images', express.static(path.join(__dirname, '../public/images')));

  // API 路由
  app.use('/api', comicRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/inspirations', inspirationRoutes);
  app.use('/api/structures', structureRoutes);
  app.use('/api/agent', agentRoutes);

  // 根路由
  app.get('/', (req, res) => {
    res.json({
      message: '🎨 AI Comic Generator API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /api/health',
        generateScript: 'POST /api/generate-script',
        generateComic: 'POST /api/generate-comic',
        history: 'GET /api/history',
        historyDetail: 'GET /api/history/:id',
        saveHistory: 'POST /api/history',
        deleteHistory: 'DELETE /api/history/:id',
        inspirations: 'GET /api/inspirations',
        inspirationDetail: 'GET /api/inspirations/:id',
        randomInspiration: 'GET /api/inspirations/random/one',
        structures: 'GET /api/structures',
        recommendStructure: 'GET /api/structures/recommend?panelCount=4',
        structureDetail: 'GET /api/structures/:id',
        agentCreateComic: 'POST /api/agent/create-comic',
        agentStatus: 'GET /api/agent/status/:taskId',
        agentEvents: 'GET /api/agent/events/:taskId',
        agentTest: 'POST /api/agent/test',
      },
    });
  });

  return app;
}

function startServer() {
  // 打印启动信息
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AI Comic Generator - Starting...');
  console.log('='.repeat(60));

  // 验证配置
  validateConfig();

  // 创建应用
  const app = createApp();

  // 启动服务器
  app.listen(config.port, () => {
    console.log('\n' + '✅ Server is running!');
    console.log(`📍 URL: http://localhost:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🤖 AI Provider: ${config.activeProvider}`);
    console.log(`📝 Text Model: ${config.models.text}`);
    console.log(`🎨 Image Model: ${config.models.image}`);
    console.log('\n' + '='.repeat(60) + '\n');
  });
}

// 启动服务器
startServer();
