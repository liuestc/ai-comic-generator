// Agent系统类型定义

export interface ThoughtProcess {
  // 核心冲突分析
  coreConflict: {
    protagonist: string;           // 主角
    goal: string;                   // 目标
    obstacle: string;               // 障碍
    stakes: string;                 // 赌注
  };
  
  // 故事结构选择
  structure: {
    type: 'kishotenketsu' | 'three_act' | 'hero_journey';
    reason: string;
    panelCount: number;
  };
  
  // 角色设计
  character: {
    name: string;
    personality: string[];
    appearance: string;
    catchphrase: string;
    motivation: string;
    fear: string;
  };
  
  // 镜头语言规划
  shotPlanning: Array<{
    panelId: number;
    shotType: string;
    cameraAngle: string;
    reason: string;
    visualFocus: string;
  }>;
  
  // 色彩基调
  colorScheme: {
    overall: string;
    reason: string;
    mood: string;
  };
}

export interface SelfReview {
  // 评分
  scores: {
    structure: number;      // 故事结构 (0-10)
    emotion: number;        // 情感曲线 (0-10)
    shotLanguage: number;   // 镜头语言 (0-10)
    dialogue: number;       // 对话质量 (0-10)
  };
  
  // 问题诊断
  issues: Array<{
    panelId?: number;
    severity: 'high' | 'medium' | 'low';
    category: 'structure' | 'emotion' | 'shot' | 'dialogue';
    description: string;
  }>;
  
  // 改进建议
  suggestions: Array<{
    panelId?: number;
    category: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // 是否需要改进
  needsImprovement: boolean;
  overallScore: number;
}

export interface ComicCritique {
  // 多维度评分
  scores: {
    characterConsistency: number;  // 角色一致性 (0-10)
    shotLanguage: number;          // 镜头语言 (0-10)
    emotionalImpact: number;       // 情感冲击 (0-10)
    dialogueQuality: number;       // 对话质量 (0-10)
    visualImpact: number;          // 视觉冲击 (0-10)
    overall: number;               // 总分
  };
  
  // 详细分析
  analysis: {
    strengths: string[];           // 优点
    weaknesses: string[];          // 缺点
    panelAnalysis: Array<{         // 每格分析
      panelId: number;
      characterConsistency: string;
      shotEffectiveness: string;
      emotionalExpression: string;
      dialogueNaturalness: string;
    }>;
  };
  
  // 改进建议
  suggestions: Array<{
    category: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // 证据
  evidence: Array<{
    panelId: number;
    observation: string;
    score: number;
  }>;
}

export interface AgentState {
  status: 'idle' | 'thinking' | 'generating' | 'reviewing' | 'optimizing' | 'critiquing' | 'completed' | 'failed';
  currentStep: string;
  progress: number;
  data?: any;
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: string;
  state: AgentState;
}
