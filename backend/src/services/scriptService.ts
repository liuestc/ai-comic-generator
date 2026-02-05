import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { aiClient } from '../utils/aiClient';
import { logger } from '../utils/logger';
import { ComicScript, ComicPanel, ShotType, CameraAngle } from '../types';
import { recommendShotSequence } from './shotRecommendation';

/**
 * 脚本生成和管理服务
 * 负责根据用户创意生成四格漫画脚本，并支持脚本编辑
 */

// 内存存储（生产环境应使用数据库）
const scriptStore = new Map<string, ComicScript>();

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
      const parsedScript = this.parseScriptResponse(response);

      // 创建完整的脚本对象
      const scriptId = uuidv4();
      const script: ComicScript = {
        id: scriptId,
        topic,
        title: parsedScript.title,
        characterDescription: parsedScript.characterDescription,
        panels: parsedScript.panels.map((p: any, index: number) => ({
          id: index + 1,
          sceneDescription: p.sceneDescription,
          dialogue: p.dialogue,
          shotType: ShotType.MEDIUM_SHOT,      // 默认中景
          cameraAngle: CameraAngle.EYE_LEVEL   // 默认平视
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft'
      };

      // 智能推荐镜头序列
      const recommendations = recommendShotSequence(script.panels);
      recommendations.forEach((rec, index) => {
        if (script.panels[index]) {
          script.panels[index].shotType = rec.shotType;
          script.panels[index].cameraAngle = rec.cameraAngle;
        }
      });

      // 保存到存储
      scriptStore.set(scriptId, script);

      logger.success(`✅ 脚本生成成功，耗时 ${elapsed}s，标题: ${script.title}，ID: ${scriptId}`);

      return script;
    } catch (error: any) {
      logger.error('脚本生成失败', error);
      throw new Error(`脚本生成失败: ${error.message}`);
    }
  }

  /**
   * 获取脚本
   */
  async getScript(scriptId: string): Promise<ComicScript | null> {
    const script = scriptStore.get(scriptId);
    if (!script) {
      logger.warn(`脚本未找到: ${scriptId}`);
      return null;
    }
    return script;
  }

  /**
   * 更新脚本
   */
  async updateScript(scriptId: string, panels: Partial<ComicPanel>[]): Promise<ComicScript> {
    const script = scriptStore.get(scriptId);
    if (!script) {
      throw new Error('脚本未找到');
    }

    logger.info(`📝 更新脚本: ${scriptId}`);

    // 更新分格
    panels.forEach(updatedPanel => {
      const panelIndex = script.panels.findIndex(p => p.id === updatedPanel.id);
      if (panelIndex !== -1) {
        const originalPanel = script.panels[panelIndex];
        if (!originalPanel) return;
        
        // 合并更新
        script.panels[panelIndex] = {
          id: originalPanel.id,
          sceneDescription: updatedPanel.sceneDescription || originalPanel.sceneDescription,
          dialogue: updatedPanel.dialogue || originalPanel.dialogue,
          imagePrompt: updatedPanel.imagePrompt || originalPanel.imagePrompt,
          shotType: updatedPanel.shotType || originalPanel.shotType,
          cameraAngle: updatedPanel.cameraAngle || originalPanel.cameraAngle,
          // 如果场景或对话改变，清除已生成的图片
          imageUrl: updatedPanel.sceneDescription !== originalPanel.sceneDescription 
            ? undefined 
            : originalPanel.imageUrl,
          bubbleImageUrl: updatedPanel.sceneDescription !== originalPanel.sceneDescription || 
                         updatedPanel.dialogue !== originalPanel.dialogue
            ? undefined 
            : originalPanel.bubbleImageUrl,
          generatedAt: originalPanel.generatedAt
        };

        logger.debug(`更新分格 ${updatedPanel.id}: 场景=${!!updatedPanel.sceneDescription}, 对话=${!!updatedPanel.dialogue}, 景别=${updatedPanel.shotType}, 角度=${updatedPanel.cameraAngle}`);
      }
    });

    script.updatedAt = new Date();
    scriptStore.set(scriptId, script);

    logger.success(`✅ 脚本更新成功: ${scriptId}`);

    return script;
  }

  /**
   * 删除脚本
   */
  async deleteScript(scriptId: string): Promise<boolean> {
    const deleted = scriptStore.delete(scriptId);
    if (deleted) {
      logger.info(`🗑️ 脚本已删除: ${scriptId}`);
    }
    return deleted;
  }

  /**
   * 列出所有脚本
   */
  async listScripts(): Promise<ComicScript[]> {
    return Array.from(scriptStore.values());
  }

  /**
   * 解析 AI 返回的脚本
   */
  private parseScriptResponse(response: string): any {
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
      });

      return parsed;
    } catch (error: any) {
      logger.error('解析脚本失败', error);
      logger.debug('原始响应:', response);
      throw new Error(`解析脚本失败: ${error.message}`);
    }
  }
}

// 导出单例
export const scriptService = new ScriptService();
