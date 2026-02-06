import { DirectorAgent } from './DirectorAgent';
import { CriticAgent, ComicForCritique } from './CriticAgent';
import { ThoughtProcess, SelfReview, ComicCritique, AgentState } from './types';
import { ComicScript } from '../types';
import { EventEmitter } from 'events';
// Note: generateComicImages function is not needed, using internal generateImages method

export interface OrchestratorConfig {
  maxIterations: number;      // 最大迭代次数
  targetScore: number;         // 目标分数
  apiKey: string;              // Gemini API密钥
}

export interface OrchestratorResult {
  success: boolean;
  script: ComicScript;
  critique?: ComicCritique;
  iterations: number;
  history: Array<{
    iteration: number;
    score: number;
    improvements: string[];
  }>;
}

export class AgentOrchestrator extends EventEmitter {
  private director: DirectorAgent;
  private critic: CriticAgent;
  private config: OrchestratorConfig;
  private state: AgentState;
  
  constructor(config: OrchestratorConfig) {
    super();
    
    this.config = {
      maxIterations: config.maxIterations || 3,
      targetScore: config.targetScore || 8.0,
      apiKey: config.apiKey
    };
    
    this.director = new DirectorAgent(config.apiKey);
    this.critic = new CriticAgent(config.apiKey);
    
    this.state = {
      status: 'idle',
      currentStep: '',
      progress: 0
    };
    
    // 转发Agent事件
    this.director.on('thought', (thought) => this.emit('directorThought', thought));
    this.director.on('scriptGenerated', (script) => this.emit('directorScriptGenerated', script));
    this.director.on('reviewed', (review) => this.emit('directorReviewed', review));
    this.director.on('optimized', (script) => this.emit('directorOptimized', script));
    this.director.on('stateChange', (state) => this.emit('directorStateChange', state));
    
    this.critic.on('analyzed', (analysis) => this.emit('criticAnalyzed', analysis));
    this.critic.on('scored', (scores) => this.emit('criticScored', scores));
    this.critic.on('critiqued', (critique) => this.emit('criticCritiqued', critique));
    this.critic.on('stateChange', (state) => this.emit('criticStateChange', state));
  }
  
  /**
   * 创建漫画：完整的Agent协作流程
   */
  async createComic(idea: string): Promise<OrchestratorResult> {
    const history: OrchestratorResult['history'] = [];
    let bestScript: ComicScript | null = null;
    let bestScore = 0;
    let bestCritique: ComicCritique | null = null;
    
    try {
      this.updateState('thinking', '开始创作漫画...', 0);
      
      for (let iteration = 0; iteration < this.config.maxIterations; iteration++) {
        const iterationProgress = (iteration / this.config.maxIterations) * 100;
        
        this.emit('iterationStart', {
          iteration: iteration + 1,
          maxIterations: this.config.maxIterations
        });
        
        // 1. 导演生成脚本
        this.updateState('generating', `第${iteration + 1}次迭代：生成脚本...`, iterationProgress);
        const script = await this.director.execute(idea);
        
        // 2. 生成漫画图片
        this.updateState('generating', `第${iteration + 1}次迭代：生成图片...`, iterationProgress + 20);
        const comicWithImages = await this.generateImages(script);
        
        // 3. 评论家评分
        this.updateState('critiquing', `第${iteration + 1}次迭代：评论家评分...`, iterationProgress + 40);
        // Convert ComicScript to ComicForCritique format
        const comicForCritique: ComicForCritique = {
          id: script.id,
          scriptId: script.id,
          title: script.topic,
          topic: script.topic,
          characterDesign: script.characterDesign,
          characterDescription: script.characterDesign,
          panels: script.panels
        };
        const critique = await this.critic.execute(comicForCritique);
        
        // 4. 记录历史
        const lastHistory = history.length > 0 ? history[history.length - 1] : null;
        const previousScore = lastHistory ? lastHistory.score : 0;
        const improvements = this.identifyImprovements(
          previousScore,
          critique.scores.overall,
          critique
        );
        
        history.push({
          iteration: iteration + 1,
          score: critique.scores.overall,
          improvements
        });
        
        this.emit('iterationComplete', {
          iteration: iteration + 1,
          score: critique.scores.overall,
          improvements
        });
        
        // 5. 更新最佳结果
        if (critique.scores.overall > bestScore) {
          bestScore = critique.scores.overall;
          bestScript = comicWithImages;
          bestCritique = critique;
        }
        
        // 6. 判断是否达标
        if (critique.scores.overall >= this.config.targetScore) {
          this.updateState('completed', '达到目标分数，完成！', 100);
          this.emit('targetReached', {
            iteration: iteration + 1,
            score: critique.scores.overall
          });
          break;
        }
        
        // 7. 如果还有迭代次数，根据反馈调整创意
        if (iteration < this.config.maxIterations - 1) {
          idea = this.incorporateFeedback(idea, critique);
          this.emit('feedbackIncorporated', {
            iteration: iteration + 1,
            newIdea: idea
          });
        }
      }
      
      this.updateState('completed', '完成', 100);
      
      return {
        success: true,
        script: bestScript!,
        critique: bestCritique!,
        iterations: history.length,
        history
      };
      
    } catch (error) {
      this.updateState('failed', '失败', 0, error);
      throw error;
    }
  }
  
  /**
   * 生成图片：调用图像生成服务
   */
  private async generateImages(script: ComicScript): Promise<ComicScript> {
    // TODO: 实现图片生成
    // 暂时返回原script，不生成图片
    console.log('[AgentOrchestrator] 跳过图片生成（待实现）');
    return script;
  }
  
  /**
   * 识别改进点：对比前后分数，识别改进的地方
   */
  private identifyImprovements(
    previousScore: number,
    currentScore: number,
    critique: ComicCritique
  ): string[] {
    const improvements: string[] = [];
    
    if (currentScore > previousScore) {
      const scoreDiff = currentScore - previousScore;
      improvements.push(`总分提升了${scoreDiff.toFixed(1)}分`);
    }
    
    // 识别高分项
    const scores = critique.scores;
    if (scores.characterConsistency >= 9.0) {
      improvements.push('角色一致性表现优秀');
    }
    if (scores.shotLanguage >= 9.0) {
      improvements.push('镜头语言运用出色');
    }
    if (scores.emotionalImpact >= 9.0) {
      improvements.push('情感冲击力强');
    }
    if (scores.dialogueQuality >= 9.0) {
      improvements.push('对话质量上乘');
    }
    if (scores.visualImpact >= 9.0) {
      improvements.push('视觉效果震撼');
    }
    
    // 如果没有改进，列出优点
    if (improvements.length === 0 && critique.analysis?.strengths && critique.analysis.strengths.length > 0) {
      const firstStrength = critique.analysis.strengths[0];
      if (firstStrength) {
        improvements.push(firstStrength);
      }
    }
    
    return improvements;
  }
  
  /**
   * 整合反馈：根据评论家的建议调整创意
   */
  private incorporateFeedback(originalIdea: string, critique: ComicCritique): string {
    const suggestions = critique.suggestions
      .filter(s => s.priority === 'high')
      .map(s => s.description)
      .join('\n');
    
    const weaknesses = critique.analysis.weaknesses.join('、');
    
    return `
${originalIdea}

【改进要求】
之前的版本存在以下问题：${weaknesses}

请特别注意：
${suggestions}

请在保持原有创意的基础上，针对这些问题进行改进。
`.trim();
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
