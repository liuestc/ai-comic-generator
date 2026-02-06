import { Inspiration } from '../types';

/**
 * Bug数字世界
 * 一个程序员在修复bug时，意外发现了通往数字世界的入口
 * 
 * 已测试 ⭐⭐⭐⭐⭐
 */
export const bugDigitalWorld: Inspiration = {
  id: 'bug_digital_world',
  title: 'Bug数字世界',
  description: '一个程序员在修复bug时，意外发现了通往数字世界的入口',
  category: 'scifi',
  difficulty: 3,
  
  structure: {
    type: 'kishotenketsu',
    acts: [
      { name: '起', panelId: 1, function: '建立情境和角色状态', emotionIntensity: 3 },
      { name: '承', panelId: 2, function: '引入异常事件', emotionIntensity: 5 },
      { name: '转', panelId: 3, function: '意外转折，打破预期', emotionIntensity: 9 },
      { name: '合', panelId: 4, function: '展现新世界，留下悬念', emotionIntensity: 7 }
    ]
  },
  
  emotionCurve: [3, 5, 9, 7],
  
  shotDesigns: [
    {
      panelId: 1,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '三分法，人物在右，屏幕在左',
      visualFocus: '疲惫的表情、屏幕上的红色错误提示',
      designReason: '近景展现角色状态，建立共鸣。平视角度让读者感同身受。'
    },
    {
      panelId: 2,
      shotType: 'extreme_close_up',
      cameraAngle: 'eye_level',
      composition: '中心构图，焦点在屏幕',
      visualFocus: '屏幕上的代码开始扭曲变形',
      designReason: '特写制造紧张感，让读者注意到异常。视觉冲击强。',
      visualEffects: '代码扭曲、闪光效果'
    },
    {
      panelId: 3,
      shotType: 'long',
      cameraAngle: 'high',
      composition: '对角线构图，展现空间深度',
      visualFocus: '程序员被吸入屏幕，数字世界的入口',
      designReason: '远景展现完整场景，俯视角度增强视觉冲击。高潮时刻。',
      visualEffects: '光芒、粒子效果、空间扭曲'
    },
    {
      panelId: 4,
      shotType: 'medium',
      cameraAngle: 'low',
      composition: '仰视构图，展现新世界的宏伟',
      visualFocus: '程序员站在数字世界中，周围是代码构成的建筑',
      designReason: '中景展现角色和环境关系，仰视角度增强震撼感。留下悬念。',
      visualEffects: '数字粒子、霓虹光效'
    }
  ],
  
  dialogueDesigns: [
    {
      panelId: 1,
      dialogue: '又是这个bug...已经第10次了...',
      technique: '省略号表现疲惫，数字强调重复性',
      characterVoice: '程序员的自言自语，疲惫无奈',
      subtext: '工作压力大，渴望改变'
    },
    {
      panelId: 2,
      dialogue: '等等...代码在...动？',
      technique: '省略号制造悬念，短句增强紧张感',
      characterVoice: '困惑中带着警觉',
      subtext: '理性思维遇到超自然现象'
    },
    {
      panelId: 3,
      dialogue: '什么！？这...这是...！',
      technique: '感叹号和问号混用，表现震惊。破碎的句子表现思维混乱。',
      characterVoice: '惊恐的尖叫',
      subtext: '三观崩塌的瞬间'
    },
    {
      panelId: 4,
      dialogue: '欢迎来到...数字世界。',
      technique: '省略号制造神秘感，句号表现确定性',
      characterVoice: '来自数字世界的声音，神秘而威严',
      subtext: '新的冒险即将开始'
    }
  ],
  
  colorSchemes: [
    {
      panelId: 1,
      mainColor: '冷色调（蓝灰色）',
      mood: '疲惫、压抑、焦虑',
      lighting: '屏幕光照亮脸部，周围昏暗'
    },
    {
      panelId: 2,
      mainColor: '红色+蓝色（警告色）',
      mood: '紧张、不安、警觉',
      lighting: '屏幕闪烁，红色警告光'
    },
    {
      panelId: 3,
      mainColor: '白色+蓝色（强光）',
      mood: '震撼、恐惧、兴奋',
      lighting: '强烈的白光，高对比度'
    },
    {
      panelId: 4,
      mainColor: '霓虹色（紫色、青色、粉色）',
      mood: '神秘、奇幻、未知',
      lighting: '霓虹光效，赛博朋克风格'
    }
  ],
  
  character: {
    name: '李程',
    occupation: '程序员',
    appearance: '眼镜、格子衬衫、黑眼圈',
    personality: '理性、专注、有点社恐',
    catchphrase: '这个bug我能修！',
    deepDesire: '写出完美的代码',
    greatestFear: '永远修不完的bug'
  },
  
  tags: {
    theme: ['程序员生活', '虚拟与现实', '探索未知'],
    emotion: ['焦虑', '震惊', '兴奋'],
    visual: ['赛博朋克', '数字世界', '霸虹灯'],
    technique: ['起承转合', '情感曲线强', '视觉冲击'],
    audience: ['程序员', '科幻爱好者', '年轻人']
  },
  tested: true,
  testResult: '⭐⭐⭐⭐⭐ 完美！角色一致性优秀，镜头语言应用到位，情感曲线完整。'
};
