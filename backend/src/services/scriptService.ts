import fs from 'fs';
import path from 'path';
import { aiClient } from '../utils/aiClient';
import { logger } from '../utils/logger';
import { ComicScript } from '../types';

/**
 * 脚本生成服务
 * 负责根据用户创意生成四格漫画脚本
 */

export class ScriptService {
  private promptTemplate: string;

  constructor() {
    this.promptTemplate = this.loadPromptTemplate();
  }

  /**
   * 加载 Prompt 模板
   */
  private loadPromptTemplate(): string {
    const promptPath = path.join(__dirname, '../prompts/script_prompt.txt');
    return fs.readFileSync(promptPath, 'utf-8');
  }

  /**
   * 生成漫画脚本
   */
  async generateScript(topic: string): Promise<ComicScript> {
    try {
      logger.info(`🎬 开始生成漫画脚本，主题: ${topic.substring(0, 50)}...`);

      // 构建完整的 Prompt
      const prompt = this.promptTemplate.replace('{topic}', topic);

      // 调用 AI 生成脚本
      const startTime = Date.now();
      const response = await aiClient.generateText(prompt);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

      logger.debug(`AI 返回内容: ${response.substring(0, 200)}...`);

      // 解析 JSON 响应
      const script = this.parseScriptResponse(response);

      logger.success(`✅ 脚本生成成功，耗时 ${elapsed}s，标题: ${script.title}`);

      return script;
    } catch (error: any) {
      logger.error('脚本生成失败', error);
      throw new Error(`脚本生成失败: ${error.message}`);
    }
  }

  /**
   * 解析 AI 返回的脚本
   */
  private parseScriptResponse(response: string): ComicScript {
    try {
      // 清理可能的 markdown 代码块标记
      let cleanedResponse = response.trim();
      
      // 移除可能的 ```json 和 ``` 标记
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '');
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
      }

      // 解析 JSON
      const parsed = JSON.parse(cleanedResponse);

      // 验证必要字段
      if (!parsed.title || !parsed.characterDescription || !parsed.panels) {
        throw new Error('脚本格式不完整，缺少必要字段');
      }

      if (!Array.isArray(parsed.panels) || parsed.panels.length !== 4) {
        throw new Error('脚本必须包含恰好 4 个分镜');
      }

      // 验证每个分镜的字段
      parsed.panels.forEach((panel: any, index: number) => {
        if (!panel.sceneDescription || !panel.dialogue) {
          throw new Error(`第 ${index + 1} 个分镜缺少必要字段`);
        }
        panel.index = index + 1;
      });

      return parsed as ComicScript;
    } catch (error: any) {
      logger.error('解析脚本失败', error);
      logger.debug('原始响应:', response);
      throw new Error(`解析脚本失败: ${error.message}`);
    }
  }
}

// 导出单例
export const scriptService = new ScriptService();
