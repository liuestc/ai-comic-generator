import express from 'express';
import { AgentOrchestrator } from '../agents';
import { config } from '../utils/config';

const router = express.Router();

// 存储正在进行的任务
const activeTasks = new Map<string, {
  orchestrator: AgentOrchestrator;
  status: string;
  result?: any;
}>();

/**
 * POST /api/agent/create-comic
 * 使用Agent系统创建漫画
 */
router.post('/create-comic', async (req, res) => {
  try {
    const { idea, maxIterations = 3, targetScore = 8.0 } = req.body;
    
    if (!idea) {
      return res.status(400).json({
        success: false,
        error: '请提供创意'
      });
    }
    
    // 生成任务ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建协调器
    const orchestrator = new AgentOrchestrator({
      maxIterations,
      targetScore,
      apiKey: config.google.apiKey
    });
    
    // 存储任务
    activeTasks.set(taskId, {
      orchestrator,
      status: 'running'
    });
    
    // 异步执行
    (async () => {
      try {
        const result = await orchestrator.createComic(idea);
        
        // 更新任务状态
        activeTasks.set(taskId, {
          orchestrator,
          status: 'completed',
          result
        });
        
        // 30分钟后清理任务
        setTimeout(() => {
          activeTasks.delete(taskId);
        }, 30 * 60 * 1000);
        
      } catch (error) {
        console.error('Agent创作失败:', error);
        activeTasks.set(taskId, {
          orchestrator,
          status: 'failed',
          result: { error: error instanceof Error ? error.message : '未知错误' }
        });
      }
    })();
    
    // 立即返回任务ID
    res.json({
      success: true,
      taskId,
      message: 'Agent开始创作，请使用taskId查询进度'
    });
    
  } catch (error) {
    console.error('创建Agent任务失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

/**
 * GET /api/agent/status/:taskId
 * 查询任务状态
 */
router.get('/status/:taskId', (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = activeTasks.get(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在或已过期'
      });
    }
    
    const state = task.orchestrator.getState();
    
    res.json({
      success: true,
      taskId,
      status: task.status,
      agentState: state,
      result: task.status === 'completed' ? task.result : undefined
    });
    
  } catch (error) {
    console.error('查询任务状态失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

/**
 * GET /api/agent/events/:taskId
 * SSE (Server-Sent Events) 实时推送Agent状态
 */
router.get('/events/:taskId', (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = activeTasks.get(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在或已过期'
      });
    }
    
    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // 发送初始状态
    const initialState = task.orchestrator.getState();
    res.write(`data: ${JSON.stringify({ type: 'state', data: initialState })}\n\n`);
    
    // 监听所有事件
    const events = [
      'directorThought',
      'directorScriptGenerated',
      'directorReviewed',
      'directorOptimized',
      'directorStateChange',
      'criticAnalyzed',
      'criticScored',
      'criticCritiqued',
      'criticStateChange',
      'iterationStart',
      'iterationComplete',
      'targetReached',
      'feedbackIncorporated',
      'stateChange'
    ];
    
    const listeners: Array<{ event: string; handler: Function }> = [];
    
    events.forEach(event => {
      const handler = (data: any) => {
        res.write(`data: ${JSON.stringify({ type: event, data })}\n\n`);
      };
      task.orchestrator.on(event, handler);
      listeners.push({ event, handler });
    });
    
    // 客户端断开连接时清理
    req.on('close', () => {
      listeners.forEach(({ event, handler }) => {
        task.orchestrator.removeListener(event, handler as any);
      });
    });
    
  } catch (error) {
    console.error('SSE连接失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

/**
 * POST /api/agent/test
 * 测试Agent系统（只运行导演Agent）
 */
router.post('/test', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea) {
      return res.status(400).json({
        success: false,
        error: '请提供创意'
      });
    }
    
    const { DirectorAgent } = await import('../agents');
    const director = new DirectorAgent(config.google.apiKey);
    
    // 收集所有事件
    const events: any[] = [];
    
    director.on('thought', (thought) => {
      events.push({ type: 'thought', data: thought });
    });
    
    director.on('scriptGenerated', (script) => {
      events.push({ type: 'scriptGenerated', data: script });
    });
    
    director.on('reviewed', (review) => {
      events.push({ type: 'reviewed', data: review });
    });
    
    director.on('optimized', (script) => {
      events.push({ type: 'optimized', data: script });
    });
    
    // 执行
    const script = await director.execute(idea);
    
    res.json({
      success: true,
      script,
      events
    });
    
  } catch (error) {
    console.error('测试Agent失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router;
