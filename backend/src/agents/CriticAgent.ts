import { GoogleGenerativeAI } from '@google/generative-ai';
import { ComicCritique, AgentState } from './types';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export interface ComicForCritique {
  id: string;                      // 兼容ComicScript
  scriptId?: string;               // 可选
  title?: string;                  // 可选
  topic?: string;                  // 兼容ComicScript
  characterDesign?: string;        // 兼容ComicScript
  characterDescription?: string;   // 可选
  panels: Array<{
    id: number;
    scene?: string;                // 兼容ComicScript
    sceneDescription?: string;     // 可选
    dialogue: string;
    shotType: string;
    cameraAngle: string;
    emotionLevel?: number;         // 可选
    imageUrl?: string;             // 可选
  }>;
}

export class CriticAgent extends EventEmitter {
  private model: any;
  private state: AgentState;
  
  constructor(apiKey: string) {
    super();
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    this.state = {
      status: 'idle',
      currentStep: '',
      progress: 0
    };
  }
  
  /**
   * 执行评论家Agent的完整流程
   */
  async execute(comic: ComicForCritique): Promise<ComicCritique> {
    try {
      this.updateState('critiquing', '开始分析漫画...', 0);
      
      // 1. 多模态分析
      const analysis = await this.analyzeComic(comic);
      this.emit('analyzed', analysis);
      
      // 2. 多维度评分
      this.updateState('critiquing', '生成评分...', 50);
      const scores = await this.scoreComic(comic, analysis);
      this.emit('scored', scores);
      
      // 3. 生成改进建议
      this.updateState('critiquing', '生成建议...', 80);
      const critique: ComicCritique = {
        scores,
        analysis,
        suggestions: this.generateSuggestions(scores, analysis),
        evidence: this.extractEvidence(analysis)
      };
      
      this.emit('critiqued', critique);
      this.updateState('completed', '完成', 100);
      
      return critique;
      
    } catch (error) {
      this.updateState('failed', '失败', 0, error);
      throw error;
    }
  }
  
  /**
   * 多模态分析：同时分析图片和文本
   */
  private async analyzeComic(comic: ComicForCritique): Promise<ComicCritique['analysis']> {
    // 准备图片数据
    const imageParts = await Promise.all(
      comic.panels.map(async (panel) => {
        try {
          // 从URL读取图片
          const imagePath = path.join(process.cwd(), 'public', panel.imageUrl || '');
          const imageBuffer = fs.readFileSync(imagePath);
          const base64Image = imageBuffer.toString('base64');
          
          return {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png'
            }
          };
        } catch (error) {
          console.error(`读取图片失败: ${panel.imageUrl}`, error);
          return null;
        }
      })
    );
    
    // 过滤掉失败的图片
    const validImageParts = imageParts.filter(img => img !== null);
    
    const prompt = `
你是一位专业的漫画评论家。请评估这部漫画的质量。

漫画信息：
- 标题：${comic.title}
- 角色设定：${comic.characterDescription}
- 分格数：${comic.panels.length}

每一格的信息：
${comic.panels.map(p => `
第${p.id}格：
- 场景：${p.sceneDescription}
- 对话：${p.dialogue}
- 镜头：${p.shotType} + ${p.cameraAngle}
- 情感强度：${p.emotionLevel}/10
`).join('\n')}

现在请查看所有图片，并进行详细分析：

1. 整体优点（列出3个最突出的优点）

2. 整体缺点（列出3个最需要改进的地方）

3. 每一格的详细分析：
   对每一格评估：
   - characterConsistency: 角色外貌是否与设定一致？是否与其他格保持一致？
   - shotEffectiveness: 镜头选择是否有效？构图是否专业？
   - emotionalExpression: 角色表情是否到位？情感是否传达清晰？
   - dialogueNaturalness: 对话是否自然？是否推动剧情？

请严格按照以下JSON格式输出：

{
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["缺点1", "缺点2", "缺点3"],
  "panelAnalysis": [
    {
      "panelId": 1,
      "characterConsistency": "详细评价",
      "shotEffectiveness": "详细评价",
      "emotionalExpression": "详细评价",
      "dialogueNaturalness": "详细评价"
    }
  ]
}
`;

    // 多模态输入：文本 + 图片
    const parts = [prompt, ...validImageParts];
    const result = await this.model.generateContent(parts);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析分析结果');
    }
    
    return JSON.parse(jsonMatch[0]);
  }
  
  /**
   * 多维度评分：基于分析结果生成评分
   */
  private async scoreComic(
    comic: ComicForCritique,
    analysis: ComicCritique['analysis']
  ): Promise<ComicCritique['scores']> {
    const prompt = `
你是一位专业的漫画评论家。请基于以下分析结果，给出客观的评分。

漫画分析：
${JSON.stringify(analysis, null, 2)}

请从以下5个维度评分（0-10分）：

1. characterConsistency（角色一致性）
   - 同一角色在不同分格中的外貌是否一致？
   - 是否符合角色设定？
   - 评分标准：
     * 9-10分：完美一致
     * 7-8分：基本一致，有小瑕疵
     * 5-6分：有明显不一致
     * 0-4分：严重不一致

2. shotLanguage（镜头语言）
   - 镜头选择是否符合情节需要？
   - 构图是否专业？
   - 视觉节奏是否合理？
   - 评分标准：
     * 9-10分：专业级镜头运用
     * 7-8分：镜头运用合理
     * 5-6分：镜头选择平庸
     * 0-4分：镜头选择不当

3. emotionalImpact（情感冲击）
   - 角色表情是否到位？
   - 情感是否传达清晰？
   - 是否有情感高潮？
   - 评分标准：
     * 9-10分：情感冲击力极强
     * 7-8分：情感表达清晰
     * 5-6分：情感表达平淡
     * 0-4分：情感表达缺失

4. dialogueQuality（对话质量）
   - 对话是否自然？
   - 是否符合角色性格？
   - 是否推动剧情？
   - 评分标准：
     * 9-10分：对话精彩，有潜台词
     * 7-8分：对话自然流畅
     * 5-6分：对话平淡
     * 0-4分：对话生硬

5. visualImpact（视觉冲击）
   - 画面是否吸引人？
   - 是否有记忆点？
   - 色彩运用是否得当？
   - 评分标准：
     * 9-10分：视觉效果震撼
     * 7-8分：视觉效果良好
     * 5-6分：视觉效果平庸
     * 0-4分：视觉效果差

请严格按照以下JSON格式输出：

{
  "characterConsistency": 8.5,
  "shotLanguage": 8.0,
  "emotionalImpact": 7.5,
  "dialogueQuality": 8.0,
  "visualImpact": 9.0,
  "overall": 8.2
}

注意：overall是5个维度的平均分。
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析评分结果');
    }
    
    const scores = JSON.parse(jsonMatch[0]);
    
    // 确保overall是平均分
    scores.overall = (
      scores.characterConsistency +
      scores.shotLanguage +
      scores.emotionalImpact +
      scores.dialogueQuality +
      scores.visualImpact
    ) / 5;
    
    return scores;
  }
  
  /**
   * 生成改进建议：基于评分和分析生成具体建议
   */
  private generateSuggestions(
    scores: ComicCritique['scores'],
    analysis: ComicCritique['analysis']
  ): ComicCritique['suggestions'] {
    const suggestions: ComicCritique['suggestions'] = [];
    
    // 根据评分生成建议
    if (scores.characterConsistency < 8.0) {
      suggestions.push({
        category: '角色一致性',
        description: '建议：在生成图片时使用更详细的角色描述，确保每一格都包含完整的角色特征。',
        priority: 'high'
      });
    }
    
    if (scores.shotLanguage < 8.0) {
      suggestions.push({
        category: '镜头语言',
        description: '建议：重新审视镜头选择，确保每个镜头都服务于故事叙事。可以参考专业漫画的镜头运用。',
        priority: 'high'
      });
    }
    
    if (scores.emotionalImpact < 8.0) {
      suggestions.push({
        category: '情感表达',
        description: '建议：增强角色表情的描述，可以添加更多的情感细节，如"眼神惊恐"、"嘴角微微上扬"等。',
        priority: 'medium'
      });
    }
    
    if (scores.dialogueQuality < 8.0) {
      suggestions.push({
        category: '对话质量',
        description: '建议：简化对话，让对话更符合角色性格。可以添加潜台词，让对话更有深度。',
        priority: 'medium'
      });
    }
    
    if (scores.visualImpact < 8.0) {
      suggestions.push({
        category: '视觉冲击',
        description: '建议：增强视觉元素，可以使用更鲜明的色彩对比，或添加更多的视觉细节。',
        priority: 'low'
      });
    }
    
    // 根据缺点生成建议
    analysis.weaknesses.forEach(weakness => {
      suggestions.push({
        category: '整体改进',
        description: `针对"${weakness}"，建议进行针对性优化。`,
        priority: 'medium'
      });
    });
    
    return suggestions;
  }
  
  /**
   * 提取证据：从分析中提取具体证据
   */
  private extractEvidence(analysis: ComicCritique['analysis']): ComicCritique['evidence'] {
    const evidence: ComicCritique['evidence'] = [];
    
    analysis.panelAnalysis.forEach(panelAnalysis => {
      // 角色一致性证据
      if (panelAnalysis.characterConsistency.includes('一致') || 
          panelAnalysis.characterConsistency.includes('符合')) {
        evidence.push({
          panelId: panelAnalysis.panelId,
          observation: `角色一致性：${panelAnalysis.characterConsistency}`,
          score: 9
        });
      } else if (panelAnalysis.characterConsistency.includes('不一致') || 
                 panelAnalysis.characterConsistency.includes('不符')) {
        evidence.push({
          panelId: panelAnalysis.panelId,
          observation: `角色一致性问题：${panelAnalysis.characterConsistency}`,
          score: 6
        });
      }
      
      // 镜头效果证据
      if (panelAnalysis.shotEffectiveness.includes('有效') || 
          panelAnalysis.shotEffectiveness.includes('专业')) {
        evidence.push({
          panelId: panelAnalysis.panelId,
          observation: `镜头运用：${panelAnalysis.shotEffectiveness}`,
          score: 8
        });
      }
    });
    
    return evidence;
  }
  
  /**
   * 更新状态并触发事件
   */
  private updateState(
    status: AgentState['status'],
    currentStep: string,
    progress: number,
    data?: any
  ): void {
    this.state = {
      status,
      currentStep,
      progress,
      data
    };
    this.emit('stateChange', this.state);
  }
  
  /**
   * 获取当前状态
   */
  getState(): AgentState {
    return { ...this.state };
  }
}
