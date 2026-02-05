import express from 'express';
import { databaseService } from '../services/databaseService';

const router = express.Router();

/**
 * 获取历史记录列表
 * GET /api/history?page=1&limit=10&status=completed
 */
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = databaseService.getComics({ page, limit, status });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 获取单个漫画详情
 * GET /api/history/:comicId
 */
router.get('/:comicId', (req, res) => {
  try {
    const { comicId } = req.params;
    const comic = databaseService.getComic(comicId);

    if (!comic) {
      return res.status(404).json({
        success: false,
        error: 'Comic not found'
      });
    }

    res.json({
      success: true,
      data: comic
    });
  } catch (error: any) {
    console.error('❌ Error fetching comic:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 保存漫画到历史记录
 * POST /api/history
 */
router.post('/', (req, res) => {
  try {
    const script = req.body;

    if (!script.id || !script.topic || !script.characterDesign) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, topic, characterDesign'
      });
    }

    databaseService.saveComic(script);

    res.json({
      success: true,
      message: 'Comic saved successfully'
    });
  } catch (error: any) {
    console.error('❌ Error saving comic:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 删除漫画
 * DELETE /api/history/:comicId
 */
router.delete('/:comicId', (req, res) => {
  try {
    const { comicId } = req.params;
    const deleted = databaseService.deleteComic(comicId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Comic not found'
      });
    }

    res.json({
      success: true,
      message: 'Comic deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting comic:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
