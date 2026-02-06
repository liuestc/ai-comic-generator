/**
 * 灵感库数据类型定义
 */

export interface ShotDesign {
  panelId: number;
  shotType: 'extreme_long' | 'long' | 'medium' | 'close_up' | 'extreme_close_up';
  cameraAngle: 'eye_level' | 'high' | 'low';
  composition: string;
  visualFocus: string;
  designReason: string;
  visualEffects?: string;
}

export interface DialogueDesign {
  panelId: number;
  dialogue: string;
  technique: string;
  characterVoice: string;
  subtext: string;
}

export interface ColorScheme {
  panelId: number;
  mainColor: string;
  mood: string;
  lighting: string;
}

export interface StoryAct {
  name: string;
  panelId: number;
  function: string;
  emotionIntensity: number;
}

export interface CharacterProfile {
  name: string;
  occupation: string;
  appearance: string;
  personality: string;
  catchphrase: string;
  deepDesire: string;
  greatestFear: string;
}

export interface Inspiration {
  id: string;
  title: string;
  description: string;
  category: 'funny' | 'scifi' | 'healing' | 'game' | 'pet' | 'work' | 'romance' | 'mystery';
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // 故事结构
  structure: {
    type: 'kishotenketsu' | 'three_act' | 'hero_journey';
    acts: StoryAct[];
  };
  
  // 情感曲线
  emotionCurve: number[];
  
  // 分镜设计
  shotDesigns: ShotDesign[];
  
  // 对话设计
  dialogueDesigns: DialogueDesign[];
  
  // 色彩方案
  colorSchemes: ColorScheme[];
  
  // 角色设定
  character: CharacterProfile;
  
  // 专业标签
  tags: {
    theme: string[];
    emotion: string[];
    visual: string[];
    technique: string[];
    audience: string[];
  };
  
  // 测试验证
  tested: boolean;
  testResult?: string;
}

// 分类映射
export const CATEGORY_LABELS = {
  funny: '🎭 日常搞笑',
  scifi: '🚀 科幻冒险',
  healing: '💕 温馨治愈',
  game: '🎮 游戏梗',
  pet: '🐱 萌宠日常',
  work: '💼 职场吐槽',
  romance: '💑 浪漫爱情',
  mystery: '🔍 悬疑推理'
};

// 难度映射
export const DIFFICULTY_LABELS = {
  1: '⭐☆☆☆☆ 简单',
  2: '⭐⭐☆☆☆ 较易',
  3: '⭐⭐⭐☆☆ 中等',
  4: '⭐⭐⭐⭐☆ 较难',
  5: '⭐⭐⭐⭐⭐ 困难'
};

// 故事结构映射
export const STRUCTURE_LABELS = {
  kishotenketsu: '起承转合（4格）',
  three_act: '三幕剧（6-8格）',
  hero_journey: '英雄之旅（12格）'
};
