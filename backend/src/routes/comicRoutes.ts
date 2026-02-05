import { Router, Request, Response } from 'express';
import { scriptService } from '../services/scriptService';
import { imageService } from '../services/imageService';
import { logger } from '../utils/logger';
import {
  GenerateScriptRequest,
  GenerateScriptResponse,
  GenerateComicRequest,
  GenerateComicResponse,
} from '../types';

const router = Router();

/**
 * POST /api/generate-script
 * 生成漫画脚本
 */
router.post('/generate-script', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { topic } = req.body as GenerateScriptRequest;

    // 验证参数
    if (!topic || topic.trim().length === 0) {
      logger.warn('缺少 topic 参数');
      return res.status(400).json({
        success: false,
        error: '请提供创意主题',
      } as GenerateScriptResponse);
    }

    logger.info(`📝 收到脚本生成请求: ${topic.substring(0, 50)}...`);

    // 生成脚本
    const script = await scriptService.generateScript(topic);

    // 生成角色设定图
    logger.info('🎨 生成角色设定图...');
    const characterImageUrl = await imageService.generateCharacterImage(
      script.characterDescription
    );

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✅ 脚本生成完成，耗时 ${elapsed}s`);

    res.json({
      success: true,
      script,
      characterImageUrl,
    } as GenerateScriptResponse);
  } catch (error: any) {
    logger.error('脚本生成失败', error);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    res.status(500).json({
      success: false,
      error: `脚本生成失败: ${error.message}`,
    } as GenerateScriptResponse);
  }
});

/**
 * POST /api/generate-comic
 * 根据脚本生成完整漫画
 */
router.post('/generate-comic', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { script, characterImageUrl } = req.body as GenerateComicRequest;

    // 验证参数
    if (!script || !script.panels || script.panels.length !== 4) {
      logger.warn('脚本格式不正确');
      return res.status(400).json({
        success: false,
        error: '脚本格式不正确，必须包含 4 个分镜',
      } as GenerateComicResponse);
    }

    logger.info(`🎬 收到漫画生成请求: ${script.title}`);

    // 生成所有分镜图
    const panelsWithImages = await imageService.generatePanelImages(
      script.panels,
      script.characterDescription
    );

    // 为每个分镜添加对话气泡
    logger.info('💬 添加对话气泡...');
    const finalPanels = await Promise.all(
      panelsWithImages.map(async panel => {
        if (panel.imageUrl && panel.dialogue) {
          const imageWithBubble = await imageService.addDialogueBubble(
            panel.imageUrl,
            panel.dialogue
          );
          return {
            ...panel,
            imageUrl: imageWithBubble,
          };
        }
        return panel;
      })
    );

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✅ 漫画生成完成，耗时 ${elapsed}s`);

    res.json({
      success: true,
      panels: finalPanels,
    } as GenerateComicResponse);
  } catch (error: any) {
    logger.error('漫画生成失败', error);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    res.status(500).json({
      success: false,
      error: `漫画生成失败: ${error.message}`,
    } as GenerateComicResponse);
  }
});

/**
 * GET /api/health
 * 健康检查
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
