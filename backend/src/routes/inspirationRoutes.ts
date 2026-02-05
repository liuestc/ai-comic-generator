import { Router, Request, Response } from 'express';
import { INSPIRATIONS, CATEGORY_LABELS, DIFFICULTY_LABELS, STRUCTURE_LABELS } from '../data/inspirations';

const router = Router();

/**
 * GET /api/inspirations
 * 获取灵感库列表
 * 支持分类筛选和随机推荐
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, random } = req.query;
    
    let inspirations = INSPIRATIONS;
    
    // 分类筛选
    if (category && category !== 'all') {
      inspirations = inspirations.filter(i => i.category === category);
    }
    
    // 随机推荐
    if (random === 'true' && inspirations.length > 0) {
      const randomIndex = Math.floor(Math.random() * inspirations.length);
      const randomItem = inspirations[randomIndex];
      if (randomItem) {
        inspirations = [randomItem];
      }
    }
    
    res.json({
      success: true,
      data: {
        inspirations,
        categories: CATEGORY_LABELS,
        difficulties: DIFFICULTY_LABELS,
        structures: STRUCTURE_LABELS
      }
    });
  } catch (error) {
    console.error('Error getting inspirations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inspirations'
    });
  }
});

/**
 * GET /api/inspirations/:id
 * 获取单个灵感详情
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inspiration = INSPIRATIONS.find(i => i.id === id);
    
    if (!inspiration) {
      return res.status(404).json({
        success: false,
        error: 'Inspiration not found'
      });
    }
    
    res.json({
      success: true,
      data: inspiration
    });
  } catch (error) {
    console.error('Error getting inspiration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inspiration'
    });
  }
});

/**
 * GET /api/inspirations/random/one
 * 获取随机推荐
 */
router.get('/random/one', (req: Request, res: Response) => {
  try {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONS.length);
    const inspiration = INSPIRATIONS[randomIndex];
    
    res.json({
      success: true,
      data: inspiration
    });
  } catch (error) {
    console.error('Error getting random inspiration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get random inspiration'
    });
  }
});

export default router;
