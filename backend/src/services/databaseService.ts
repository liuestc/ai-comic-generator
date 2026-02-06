import Database from 'better-sqlite3';
import path from 'path';
import { ComicScript, ComicPanel } from '../types';

const DB_PATH = path.join(__dirname, '../../data/comics.db');

class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.initDatabase();
  }

  /**
   * 初始化数据库表
   */
  private initDatabase() {
    // 创建 comics 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS comics (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        character_design TEXT NOT NULL,
        character_image_url TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建 panels 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS panels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comic_id TEXT NOT NULL,
        panel_number INTEGER NOT NULL,
        scene TEXT NOT NULL,
        dialogue TEXT NOT NULL,
        shot_type TEXT NOT NULL,
        camera_angle TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
      )
    `);

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_comics_created_at ON comics(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_comics_status ON comics(status);
      CREATE INDEX IF NOT EXISTS idx_panels_comic_id ON panels(comic_id);
    `);

    console.log('✅ Database initialized successfully');
  }

  /**
   * 保存漫画到数据库
   */
  saveComic(script: ComicScript): void {
    const insertComic = this.db.prepare(`
      INSERT OR REPLACE INTO comics (id, topic, character_design, character_image_url, status, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const insertPanel = this.db.prepare(`
      INSERT OR REPLACE INTO panels (comic_id, panel_number, scene, dialogue, shot_type, camera_angle, image_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    // 使用事务确保数据一致性
    const transaction = this.db.transaction(() => {
      insertComic.run(
        script.id,
        script.topic,
        script.characterDesign,
        script.characterImageUrl || null,
        script.status
      );

      // 删除旧的分格记录
      this.db.prepare('DELETE FROM panels WHERE comic_id = ?').run(script.id);

      // 插入新的分格记录
      for (const panel of script.panels) {
        insertPanel.run(
          script.id,
          panel.id,
          panel.scene || '场景描述', // 提供默认值
          panel.dialogue || '', // 提供默认值
          panel.shotType || 'medium_shot', // 提供默认值
          panel.cameraAngle || 'eye_level', // 提供默认值
          panel.imageUrl || null
        );
      }
    });

    transaction();
    console.log(`✅ Comic saved: ${script.id}`);
  }

  /**
   * 获取单个漫画
   */
  getComic(comicId: string): ComicScript | null {
    const comic = this.db.prepare(`
      SELECT * FROM comics WHERE id = ?
    `).get(comicId) as any;

    if (!comic) {
      return null;
    }

    const panels = this.db.prepare(`
      SELECT * FROM panels WHERE comic_id = ? ORDER BY panel_number
    `).all(comicId) as any[];

    return {
      id: comic.id,
      topic: comic.topic,
      characterDesign: comic.character_design,
      characterImageUrl: comic.character_image_url,
      status: comic.status,
      panels: panels.map(p => ({
        id: p.panel_number,
        scene: p.scene,
        dialogue: p.dialogue,
        shotType: p.shot_type,
        cameraAngle: p.camera_angle,
        imageUrl: p.image_url
      })),
      createdAt: comic.created_at,
      updatedAt: comic.updated_at
    };
  }

  /**
   * 获取漫画列表（分页）
   */
  getComics(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): {
    comics: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (options.status) {
      whereClause = 'WHERE status = ?';
      params.push(options.status);
    }

    // 获取总数
    const countResult = this.db.prepare(`
      SELECT COUNT(*) as total FROM comics ${whereClause}
    `).get(...params) as any;
    const total = countResult.total;

    // 获取列表
    const comics = this.db.prepare(`
      SELECT 
        c.*,
        COUNT(p.id) as panel_count
      FROM comics c
      LEFT JOIN panels p ON c.id = p.comic_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as any[];

    return {
      comics: comics.map(c => ({
        id: c.id,
        topic: c.topic,
        characterImageUrl: c.character_image_url,
        status: c.status,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        panelCount: c.panel_count
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 删除漫画
   */
  deleteComic(comicId: string): boolean {
    const result = this.db.prepare(`
      DELETE FROM comics WHERE id = ?
    `).run(comicId);

    console.log(`✅ Comic deleted: ${comicId}`);
    return result.changes > 0;
  }

  /**
   * 更新漫画状态
   */
  updateComicStatus(comicId: string, status: string): void {
    this.db.prepare(`
      UPDATE comics SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, comicId);
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    this.db.close();
  }
}

// 导出单例
export const databaseService = new DatabaseService();
