/**
 * 类型定义文件
 */

// ========================================
// 镜头语言类型
// ========================================

// 景别枚举
export enum ShotType {
  WIDE_SHOT = 'wide_shot',              // 远景
  FULL_SHOT = 'full_shot',              // 全景
  MEDIUM_SHOT = 'medium_shot',          // 中景
  CLOSE_UP = 'close_up',                // 近景
  EXTREME_CLOSE_UP = 'extreme_close_up' // 特写
}

// 角度枚举
export enum CameraAngle {
  EYE_LEVEL = 'eye_level',      // 平视
  HIGH_ANGLE = 'high_angle',    // 俯视
  LOW_ANGLE = 'low_angle'       // 仰视
}

// ========================================
// 核心数据模型
// ========================================

export interface ComicPanel {
  id: number;                      // 分格ID（1-4）
  scene: string;                   // 场景描述（可编辑）
  dialogue: string;                // 对话（可编辑）
  imagePrompt?: string;            // 生成图像的完整Prompt
  imageUrl?: string;               // 生成的图片URL
  bubbleImageUrl?: string;         // 带对话气泡的图片URL
  shotType: string;                // 景别
  cameraAngle: string;             // 角度
  generatedAt?: Date;              // 生成时间
}

export interface ComicScript {
  id: string;                      // 脚本ID
  userId?: string;                 // 用户ID（可选）
  topic: string;                   // 原始创意
  characterDesign: string;         // 角色描述
  characterImageUrl?: string;      // 角色设定图URL
  panels: ComicPanel[];            // 分格数组
  createdAt?: string;              // 创建时间
  updatedAt?: string;              // 更新时间
  status: 'draft' | 'generating' | 'completed'; // 状态
}

// ========================================
// API 请求/响应类型
// ========================================

export interface GenerateScriptRequest {
  topic: string;
}

export interface GenerateScriptResponse {
  success: boolean;
  script?: ComicScript;
  error?: string;
}

export interface UpdateScriptRequest {
  panels: Partial<ComicPanel>[];
}

export interface UpdateScriptResponse {
  success: boolean;
  script?: ComicScript;
  error?: string;
}

export interface RegeneratePanelRequest {
  // 空对象，panelId从URL参数获取
}

export interface RegeneratePanelResponse {
  success: boolean;
  panel?: ComicPanel;
  error?: string;
}

export interface GenerateComicRequest {
  script: ComicScript;
}

export interface GenerateComicResponse {
  success: boolean;
  script?: ComicScript;  // 返回更新后的完整脚本
  error?: string;
}

// ========================================
// 镜头推荐类型
// ========================================

export interface ShotRecommendation {
  panelId: number;
  shotType: ShotType;
  cameraAngle: CameraAngle;
  reason: string;
}

// ========================================
// AI 配置类型
// ========================================

export interface AIProviderConfig {
  provider: 'openai' | 'gemini';
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}
