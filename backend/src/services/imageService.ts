import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { aiClient } from '../utils/aiClient';
import { logger } from '../utils/logger';
import { ComicPanel } from '../types';

/**
 * 图像生成服务
 * 负责生成角色设定图和漫画分镜图
 */

export class ImageService {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(__dirname, '../../public/images');
    this.ensureOutputDir();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 生成角色设定图
   */
  async generateCharacterImage(characterDescription: string): Promise<string> {
    try {
      logger.info(`🎨 生成角色设定图...`);

      // 构建角色设定图的 Prompt
      const prompt = this.buildCharacterPrompt(characterDescription);
      
      // 调用 AI 生成图片
      const imageUrl = await aiClient.generateImage(prompt);

      // 下载并保存图片
      const filename = `character_${Date.now()}.png`;
      const savedPath = await this.downloadAndSaveImage(imageUrl, filename);

      logger.success(`✅ 角色设定图生成成功: ${filename}`);

      return `/images/${filename}`;
    } catch (error: any) {
      logger.error('角色设定图生成失败', error);
      throw new Error(`角色设定图生成失败: ${error.message}`);
    }
  }

  /**
   * 批量生成漫画分镜图
   */
  async generatePanelImages(
    panels: ComicPanel[],
    characterDescription: string
  ): Promise<ComicPanel[]> {
    try {
      logger.info(`🎨 开始生成 ${panels.length} 个分镜图...`);

      // 并发生成所有分镜图
      const promises = panels.map(panel =>
        this.generateSinglePanelImage(panel, characterDescription)
      );

      const results = await Promise.all(promises);

      logger.success(`✅ 所有分镜图生成完成`);

      return results;
    } catch (error: any) {
      logger.error('分镜图生成失败', error);
      throw new Error(`分镜图生成失败: ${error.message}`);
    }
  }

  /**
   * 生成单个分镜图
   */
  private async generateSinglePanelImage(
    panel: ComicPanel,
    characterDescription: string
  ): Promise<ComicPanel> {
    try {
      logger.info(`  生成第 ${panel.id} 格分镜...`);

      // 构建分镜图的 Prompt
      const prompt = this.buildPanelPrompt(panel.scene, characterDescription);

      // 调用 AI 生成图片
      const imageUrl = await aiClient.generateImage(prompt);

      // 下载并保存图片
      const filename = `panel_${Date.now()}_${panel.id}.png`;
      const savedPath = await this.downloadAndSaveImage(imageUrl, filename);

      logger.success(`  ✅ 第 ${panel.id} 格完成: ${filename}`);

      return {
        ...panel,
        imagePrompt: prompt,
        imageUrl: `/images/${filename}`,
      };
    } catch (error: any) {
      logger.error(`第 ${panel.id} 格生成失败`, error);
      throw error;
    }
  }

  /**
   * 构建角色设定图的 Prompt
   */
  private buildCharacterPrompt(characterDescription: string): string {
    return `Create a character design sheet for a comic. 
Character description: ${characterDescription}

Style: Modern manga/anime style, clean lines, vibrant colors.
Layout: Full body character standing in a neutral pose, front view.
Background: Simple white or light gradient background.
Quality: High detail, professional comic book art style.`;
  }

  /**
   * 构建分镜图的 Prompt
   */
  private buildPanelPrompt(sceneDescription: string, characterDescription: string): string {
    return `Create a comic panel illustration.

Character: ${characterDescription}
Scene: ${sceneDescription}

Style: Modern manga/anime style, dynamic composition, expressive characters.
Quality: High detail, professional comic book art, vibrant colors.
Format: Single panel, suitable for a 4-panel comic strip.`;
  }

  /**
   * 下载并保存图片
   */
  private async downloadAndSaveImage(imageUrl: string, filename: string): Promise<string> {
    try {
      // 如果是 base64 数据
      if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid base64 image data');
        }
        const buffer = Buffer.from(base64Data, 'base64');
        const filepath = path.join(this.outputDir, filename);
        fs.writeFileSync(filepath, buffer);
        return filepath;
      }

      // 如果是 URL，下载图片
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      const filepath = path.join(this.outputDir, filename);
      fs.writeFileSync(filepath, buffer);
      return filepath;
    } catch (error: any) {
      logger.error('图片下载失败', error);
      throw new Error(`图片下载失败: ${error.message}`);
    }
  }

  /**
   * 为图片添加对话气泡（使用 sharp）
   */
  async addDialogueBubble(
    imagePath: string,
    dialogue: string
  ): Promise<string> {
    try {
      const fullPath = path.join(this.outputDir, path.basename(imagePath));
      
      // 读取原图
      const image = sharp(fullPath);
      const metadata = await image.metadata();
      const width = metadata.width || 1024;
      const height = metadata.height || 1024;

      // 创建对话气泡 SVG
      const bubbleSvg = this.createDialogueBubbleSVG(dialogue, width, height);

      // 合成图片
      const outputFilename = `bubble_${Date.now()}_${path.basename(imagePath)}`;
      const outputPath = path.join(this.outputDir, outputFilename);

      await image
        .composite([
          {
            input: Buffer.from(bubbleSvg),
            top: 0,
            left: 0,
          },
        ])
        .toFile(outputPath);

      return `/images/${outputFilename}`;
    } catch (error: any) {
      logger.error('添加对话气泡失败', error);
      // 如果失败，返回原图
      return imagePath;
    }
  }

  /**
   * 创建对话气泡 SVG
   */
  private createDialogueBubbleSVG(text: string, width: number, height: number): string {
    // 简化版对话气泡：白色矩形背景 + 黑色文字
    const bubbleWidth = Math.min(width * 0.8, 800);
    const bubbleHeight = 100;
    const x = (width - bubbleWidth) / 2;
    const y = height - bubbleHeight - 20;

    // 自动换行处理
    const maxCharsPerLine = 30;
    const lines = this.wrapText(text, maxCharsPerLine);
    const lineHeight = 30;
    const fontSize = 24;

    return `
      <svg width="${width}" height="${height}">
        <rect 
          x="${x}" 
          y="${y}" 
          width="${bubbleWidth}" 
          height="${bubbleHeight}" 
          fill="white" 
          stroke="black" 
          stroke-width="3" 
          rx="10"
        />
        ${lines.map((line, i) => `
          <text 
            x="${width / 2}" 
            y="${y + 30 + i * lineHeight}" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold"
            fill="black" 
            text-anchor="middle"
          >${this.escapeXml(line)}</text>
        `).join('')}
      </svg>
    `;
  }

  /**
   * 文本换行
   */
  private wrapText(text: string, maxChars: number): string[] {
    const lines: string[] = [];
    let currentLine = '';

    for (const char of text) {
      currentLine += char;
      if (currentLine.length >= maxChars) {
        lines.push(currentLine);
        currentLine = '';
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * 转义 XML 特殊字符
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// 导出单例
export const imageService = new ImageService();
