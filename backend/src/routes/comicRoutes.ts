import { Router, Request, Response } from 'express';
import { scriptService } from '../services/scriptService';
import { imageService } from '../services/imageService';
import { logger } from '../utils/logger';
import { recommendShotSequence } from '../services/shotRecommendation';
import {
  GenerateScriptRequest,
  GenerateScriptResponse,
  GenerateComicRequest,
  GenerateComicResponse,
  ComicPanel,
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

    // 更新脚本中的角色图URL
    script.characterImageUrl = characterImageUrl;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✅ 脚本生成完成，耗时 ${elapsed}s`);

    res.json({
      success: true,
      script,
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
 * GET /api/script/:scriptId
 * 获取脚本详情
 */
router.get('/script/:scriptId', async (req: Request, res: Response) => {
  try {
    const scriptId = req.params.scriptId as string;

    logger.info(`📖 获取脚本: ${scriptId}`);

    const script = await scriptService.getScript(scriptId);

    if (!script) {
      return res.status(404).json({
        success: false,
        error: '脚本未找到',
      });
    }

    res.json({
      success: true,
      script,
    });
  } catch (error: any) {
    logger.error('获取脚本失败', error);
    res.status(500).json({
      success: false,
      error: `获取脚本失败: ${error.message}`,
    });
  }
});

/**
 * PUT /api/script/:scriptId
 * 更新脚本
 */
router.put('/script/:scriptId', async (req: Request, res: Response) => {
  try {
    const scriptId = req.params.scriptId as string;
    const { panels } = req.body;

    logger.info(`✏️ 更新脚本: ${scriptId}`);

    if (!panels || !Array.isArray(panels)) {
      return res.status(400).json({
        success: false,
        error: '请提供要更新的分格数据',
      });
    }

    const updatedScript = await scriptService.updateScript(scriptId, panels);

    res.json({
      success: true,
      script: updatedScript,
    });
  } catch (error: any) {
    logger.error('更新脚本失败', error);
    res.status(500).json({
      success: false,
      error: `更新脚本失败: ${error.message}`,
    });
  }
});

/**
 * POST /api/script/:scriptId/panel/:panelId/regenerate
 * 重新生成单个分格
 */
router.post('/script/:scriptId/panel/:panelId/regenerate', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const scriptId = req.params.scriptId as string;
    const panelId = req.params.panelId as string;
    const panelIdNum = parseInt(panelId);

    logger.info(`🔄 重新生成分格: 脚本=${scriptId}, 分格=${panelId}`);

    // 获取脚本
    const script = await scriptService.getScript(scriptId);
    if (!script) {
      return res.status(404).json({
        success: false,
        error: '脚本未找到',
      });
    }

    // 查找分格
    const panel = script.panels.find((p: ComicPanel) => p.id === panelIdNum);
    if (!panel) {
      return res.status(404).json({
        success: false,
        error: '分格未找到',
      });
    }

    // 生成图像 (单个分格)
    logger.info(`🎨 生成分格 ${panelId} 的图像...`);
    const panelsWithImages = await imageService.generatePanelImages(
      [panel],
      script.characterDescription
    );

    const updatedPanel = panelsWithImages[0];
    if (!updatedPanel) {
      throw new Error('分格生成失败');
    }

    // 添加对话气泡
    if (updatedPanel.imageUrl && updatedPanel.dialogue) {
      logger.info(`💬 添加对话气泡...`);
      const bubbleImageUrl = await imageService.addDialogueBubble(
        updatedPanel.imageUrl,
        updatedPanel.dialogue
      );
      updatedPanel.bubbleImageUrl = bubbleImageUrl;
    }

    updatedPanel.generatedAt = new Date();

    // 更新脚本中的分格
    const panelIndex = script.panels.findIndex((p: ComicPanel) => p.id === panelIdNum);
    if (panelIndex !== -1) {
      script.panels[panelIndex] = updatedPanel;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✅ 分格重新生成完成，耗时 ${elapsed}s`);

    res.json({
      success: true,
      panel: updatedPanel,
    });
  } catch (error: any) {
    logger.error('重新生成分格失败', error);
    res.status(500).json({
      success: false,
      error: `重新生成分格失败: ${error.message}`,
    });
  }
});

/**
 * GET /api/script/:scriptId/shot-recommendations
 * 获取镜头推荐
 */
router.get('/script/:scriptId/shot-recommendations', async (req: Request, res: Response) => {
  try {
    const scriptId = req.params.scriptId as string;

    logger.info(`💡 获取镜头推荐: ${scriptId}`);

    const script = await scriptService.getScript(scriptId);
    if (!script) {
      return res.status(404).json({
        success: false,
        error: '脚本未找到',
      });
    }

    const recommendations = recommendShotSequence(script.panels);

    res.json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    logger.error('获取镜头推荐失败', error);
    res.status(500).json({
      success: false,
      error: `获取镜头推荐失败: ${error.message}`,
    });
  }
});

/**
 * POST /api/generate-comic
 * 根据脚本生成完整漫画
 */
router.post('/generate-comic', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { script } = req.body as GenerateComicRequest;

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
      panelsWithImages.map(async (panel: ComicPanel) => {
        if (panel.imageUrl && panel.dialogue) {
          const bubbleImageUrl = await imageService.addDialogueBubble(
            panel.imageUrl,
            panel.dialogue
          );
          return {
            ...panel,
            bubbleImageUrl,
          };
        }
        return panel;
      })
    );

    // 更新脚本
    script.panels = finalPanels;
    script.status = 'completed';
    script.updatedAt = new Date();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✅ 漫画生成完成，耗时 ${elapsed}s`);

    res.json({
      success: true,
      script,
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
