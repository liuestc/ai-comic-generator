/**
 * 镜头语言配置
 * 定义不同景别和角度的描述、情感效果和Prompt
 */

import { ShotType, CameraAngle } from '../types';

export interface ShotTypeConfig {
  id: ShotType;
  name: string;
  description: string;
  emotion: string;
  prompt: string;
  example: string;
}

export interface CameraAngleConfig {
  id: CameraAngle;
  name: string;
  description: string;
  emotion: string;
  prompt: string;
  example: string;
}

// 景别配置
export const SHOT_TYPES: Record<ShotType, ShotTypeConfig> = {
  [ShotType.WIDE_SHOT]: {
    id: ShotType.WIDE_SHOT,
    name: '远景',
    description: '展示完整环境，角色较小',
    emotion: '孤立、环境关系、场景建立',
    prompt: 'Wide shot showing the full environment and setting',
    example: '整个房间、街道全景'
  },
  [ShotType.FULL_SHOT]: {
    id: ShotType.FULL_SHOT,
    name: '全景',
    description: '角色从头到脚，平衡角色和环境',
    emotion: '展示多个角色、动作场景',
    prompt: 'Full shot showing the character from head to toe',
    example: '角色全身可见'
  },
  [ShotType.MEDIUM_SHOT]: {
    id: ShotType.MEDIUM_SHOT,
    name: '中景',
    description: '从腰部往上',
    emotion: '对话、互动、最常见',
    prompt: 'Medium shot from waist up',
    example: '对话场景'
  },
  [ShotType.CLOSE_UP]: {
    id: ShotType.CLOSE_UP,
    name: '近景',
    description: '聚焦面部',
    emotion: '情感、反应、重要时刻',
    prompt: 'Close-up shot focusing on the face and expression',
    example: '面部表情特写'
  },
  [ShotType.EXTREME_CLOSE_UP]: {
    id: ShotType.EXTREME_CLOSE_UP,
    name: '特写',
    description: '眼睛或特定细节',
    emotion: '细节、紧张、高潮',
    prompt: 'Extreme close-up of eyes or specific important detail',
    example: '眼睛、手、物品细节'
  }
};

// 角度配置
export const CAMERA_ANGLES: Record<CameraAngle, CameraAngleConfig> = {
  [CameraAngle.EYE_LEVEL]: {
    id: CameraAngle.EYE_LEVEL,
    name: '平视',
    description: '与角色眼睛齐平',
    emotion: '自然、中性、最常见',
    prompt: 'at eye level, neutral perspective',
    example: '正常视角'
  },
  [CameraAngle.HIGH_ANGLE]: {
    id: CameraAngle.HIGH_ANGLE,
    name: '俯视',
    description: '从高处向下拍摄',
    emotion: '渺小、脆弱、被压迫',
    prompt: 'from high angle looking down',
    example: '表现弱势、无助'
  },
  [CameraAngle.LOW_ANGLE]: {
    id: CameraAngle.LOW_ANGLE,
    name: '仰视',
    description: '从低处向上拍摄',
    emotion: '强大、威胁、权威',
    prompt: 'from low angle looking up',
    example: '表现权力、威严'
  }
};

// 获取景别描述
export function getShotTypeDescription(shotType: ShotType): string {
  return SHOT_TYPES[shotType].prompt;
}

// 获取角度描述
export function getCameraAngleDescription(angle: CameraAngle): string {
  return CAMERA_ANGLES[angle].prompt;
}

// 构建完整的镜头描述
export function buildShotDescription(shotType: ShotType, angle: CameraAngle): string {
  return `${getShotTypeDescription(shotType)} ${getCameraAngleDescription(angle)}`;
}
