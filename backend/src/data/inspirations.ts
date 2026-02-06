/**
 * 创意灵感库 - 主文件
 * 导入所有创意并导出
 */

import { Inspiration } from './types';
import { bugDigitalWorld } from './inspirations/bugDigitalWorld';
import { catMirror } from './inspirations/catMirror';
import { deliveryGhost } from './inspirations/deliveryGhost';
import { homeworkEscape } from './inspirations/homeworkEscape';
import { subwayTime } from './inspirations/subwayTime';

// 导出所有创意
export const INSPIRATIONS: Inspiration[] = [
  bugDigitalWorld,
  catMirror,
  deliveryGhost,
  homeworkEscape,
  subwayTime,
];

// 重新导出类型和常量
export * from './types';
