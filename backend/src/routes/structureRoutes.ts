import { Router, Request, Response } from 'express';
import { STORY_STRUCTURES, recommendStructure, getStructureById } from '../data/storyStructures';

const router = Router();

/**
 * GET /api/structures
 * 获取所有故事结构模板
 */
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: STORY_STRUCTURES
    });
  } catch (error) {
    console.error('Error getting structures:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get structures'
    });
  }
});

/**
 * GET /api/structures/recommend
 * 根据格数推荐故事结构
 */
router.get('/recommend', (req: Request, res: Response) => {
  try {
    const panelCount = parseInt(req.query.panelCount as string) || 4;
    const structure = recommendStructure(panelCount);
    
    res.json({
      success: true,
      data: structure
    });
  } catch (error) {
    console.error('Error recommending structure:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to recommend structure'
    });
  }
});

/**
 * GET /api/structures/:id
 * 获取单个故事结构模板
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const structure = getStructureById(id);
    
    if (!structure) {
      return res.status(404).json({
        success: false,
        error: 'Structure not found'
      });
    }
    
    res.json({
      success: true,
      data: structure
    });
  } catch (error) {
    console.error('Error getting structure:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get structure'
    });
  }
});

export default router;
