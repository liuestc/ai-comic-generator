/**
 * 创意灵感库 - 主文件
 * 导入所有创意并导出
 */

import { Inspiration } from './types';
import { bugDigitalWorld } from './inspirations/bugDigitalWorld';

// 导出所有创意
export const INSPIRATIONS: Inspiration[] = [
  bugDigitalWorld,
  // 其他创意待补充
];

// 重新导出类型和常量
export * from './types';
