import { GoogleGenerativeAI } from '@google/generative-ai';
import { ThoughtProcess, SelfReview, AgentState } from './types';
import { ComicScript } from '../types';
import { EventEmitter } from 'events';

export class DirectorAgent extends EventEmitter {
  private model: any;
  private state: AgentState;
  
  constructor(apiKey: string) {
    super();
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    this.state = {
      status: 'idle',
      currentStep: '',
      progress: 0
    };
  }
  
  /**
   * 执行导演Agent的完整流程
   */
  async execute(idea: string): Promise<ComicScript> {
    try {
      this.updateState('thinking', '开始思考...', 0);
      
      // 1. 思维链推理
      const thought = await this.think(idea);
      this.emit('thought', thought);
      
      // 2. 生成脚本
      this.updateState('generating', '生成脚本...', 33);
      const script = await this.generateScript(idea, thought);
      this.emit('scriptGenerated', script);
      
      // 3. 自我审查
      this.updateState('reviewing', '自我审查...', 66);
      const review = await this.selfReview(script);
      this.emit('reviewed', review);
      
      // 4. 优化脚本（如果需要）
      if (review.needsImprovement && review.overallScore < 8.0) {
        this.updateState('optimizing', '优化脚本...', 80);
        const optimizedScript = await this.optimize(script, review);
        this.emit('optimized', optimizedScript);
        
        this.updateState('completed', '完成', 100);
        return optimizedScript;
      }
      
      this.updateState('completed', '完成', 100);
      return script;
      
    } catch (error) {
      this.updateState('failed', '失败', 0, error);
      throw error;
    }
  }
  
  /**
   * 思维链推理：逐步分析如何创作漫画
   */
  private async think(idea: string): Promise<ThoughtProcess> {
    const prompt = `
你是一位专业的漫画导演。请逐步思考如何创作这个漫画：

用户创意：${idea}

请按以下步骤思考，每一步都要详细说明：

1. 核心冲突分析
   - protagonist: 主角是谁？
   - goal: 主角想要什么？
   - obstacle: 遇到了什么阻碍？
   - stakes: 如果失败会怎样？

2. 故事结构选择
   - type: 应该用哪种结构？
     * "kishotenketsu" (起承转合，4格，适合短篇)
     * "three_act" (三幕剧，6-8格，适合中篇)
     * "hero_journey" (英雄之旅，12格，适合长篇)
   - reason: 为什么选择这个结构？
   - panelCount: 需要几格？

3. 角色设计
   - name: 角色名字
   - personality: 性格特点（数组，3-5个）
   - appearance: 外貌特征（详细描述，用于生成一致的角色）
   - catchphrase: 口头禅
   - motivation: 内在动机
   - fear: 内在恐惧

4. 镜头语言规划
   对每一格规划：
   - panelId: 格子编号
   - shotType: 镜头类型（extreme_long | long | medium | close_up | extreme_close_up）
   - cameraAngle: 拍摄角度（eye_level | high | low）
   - reason: 为什么选择这个镜头？
   - visualFocus: 视觉重点是什么？

5. 色彩基调
   - overall: 整体色彩（如"冷色调"、"暖色调"、"高对比"）
   - reason: 为什么选择这个色调？
   - mood: 想要传达的情绪

请严格按照以下JSON格式输出，不要输出任何其他内容：

{
  "coreConflict": {
    "protagonist": "string",
    "goal": "string",
    "obstacle": "string",
    "stakes": "string"
  },
  "structure": {
    "type": "kishotenketsu",
    "reason": "string",
    "panelCount": 4
  },
  "character": {
    "name": "string",
    "personality": ["string", "string", "string"],
    "appearance": "string",
    "catchphrase": "string",
    "motivation": "string",
    "fear": "string"
  },
  "shotPlanning": [
    {
      "panelId": 1,
      "shotType": "close_up",
      "cameraAngle": "eye_level",
      "reason": "string",
      "visualFocus": "string"
    }
  ],
  "colorScheme": {
    "overall": "string",
    "reason": "string",
    "mood": "string"
  }
}
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    // 提取JSON（处理可能的markdown代码块）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析思考结果');
    }
    
    return JSON.parse(jsonMatch[0]);
  }
  
  /**
   * 生成脚本：基于思考结果生成完整脚本
   */
  private async generateScript(idea: string, thought: ThoughtProcess): Promise<ComicScript> {
    const prompt = `
你是一位专业的漫画编剧。请基于以下思考结果，生成完整的漫画脚本：

用户创意：${idea}

思考结果：
${JSON.stringify(thought, null, 2)}

请生成${thought.structure.panelCount}格漫画的完整脚本，每一格包含：
- id: 格子编号
- sceneDescription: 场景描述（详细，用于图像生成）
- dialogue: 对话内容
- shotType: 镜头类型（从思考结果中获取）
- cameraAngle: 拍摄角度（从思考结果中获取）
- emotionLevel: 情感强度（1-10）
- colorMood: 色彩情绪（从思考结果中获取）

请严格按照以下JSON格式输出：

{
  "title": "漫画标题",
  "characterDescription": "${thought.character.appearance}",
  "panels": [
    {
      "id": 1,
      "sceneDescription": "string",
      "dialogue": "string",
      "shotType": "close_up",
      "cameraAngle": "eye_level",
      "emotionLevel": 5,
      "colorMood": "string"
    }
  ]
}
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析脚本');
    }
    
    const scriptData = JSON.parse(jsonMatch[0]);
    
    // 构造完整的ComicScript对象
    return {
      id: `script_${Date.now()}`,
      topic: idea,
      characterDesign: scriptData.characterDescription || scriptData.characterDesign,
      panels: scriptData.panels.map((panel: any) => ({
        ...panel,
        imageUrl: '',  // 稍后生成
        status: 'pending' as const
      })),
      status: 'draft' as const,
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * 自我审查：评估生成的脚本质量
   */
  private async selfReview(script: ComicScript): Promise<SelfReview> {
    const prompt = `
你是一位严格的漫画审查者。请评估以下脚本的质量：

脚本：
${JSON.stringify(script, null, 2)}

请从以下维度评分（0-10分）：

1. 故事结构 (structure)
   - 起承转合是否完整？
   - 节奏是否合理？

2. 情感曲线 (emotion)
   - 情感是否有起伏？
   - 高潮是否足够强烈？

3. 镜头语言 (shotLanguage)
   - 镜头选择是否合理？
   - 是否有视觉冲击力？

4. 对话质量 (dialogue)
   - 对话是否符合角色性格？
   - 是否推动剧情？

请诊断所有问题，并提出改进建议。

请严格按照以下JSON格式输出：

{
  "scores": {
    "structure": 8,
    "emotion": 7,
    "shotLanguage": 8,
    "dialogue": 7
  },
  "issues": [
    {
      "panelId": 2,
      "severity": "medium",
      "category": "emotion",
      "description": "第2格的情感表达不够强烈"
    }
  ],
  "suggestions": [
    {
      "panelId": 2,
      "category": "emotion",
      "suggestion": "可以增强角色的表情描述",
      "priority": "high"
    }
  ],
  "needsImprovement": true,
  "overallScore": 7.5
}
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析审查结果');
    }
    
    return JSON.parse(jsonMatch[0]);
  }
  
  /**
   * 优化脚本：根据审查结果改进脚本
   */
  private async optimize(script: ComicScript, review: SelfReview): Promise<ComicScript> {
    const prompt = `
你是一位专业的漫画编剧。请根据审查结果优化脚本：

原始脚本：
${JSON.stringify(script, null, 2)}

审查结果：
${JSON.stringify(review, null, 2)}

请针对每个问题进行优化，特别关注：
${review.suggestions.map(s => `- ${s.suggestion}`).join('\n')}

请输出优化后的完整脚本，格式与原脚本相同。

请严格按照以下JSON格式输出：

{
  "title": "string",
  "characterDescription": "string",
  "panels": [...]
}
`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析优化结果');
    }
    
    const optimizedData = JSON.parse(jsonMatch[0]);
    
    return {
      ...script,
      characterDesign: optimizedData.characterDesign || optimizedData.characterDescription,
      panels: optimizedData.panels.map((panel: any) => ({
        ...panel,
        imageUrl: '',
        status: 'pending' as const
      }))
    };
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
