import { Inspiration } from '../types';

/**
 * 镜子猫咪
 * 一只猫咪发现镜子里的自己会独立行动，展开了一场奇妙的对话
 */
export const catMirror: Inspiration = {
  id: 'cat_mirror',
  title: '镜子猫咪',
  description: '一只猫咪发现镜子里的自己会独立行动，展开了一场奇妙的对话',
  category: 'funny',
  difficulty: 2,
  
  structure: {
    type: 'kishotenketsu',
    acts: [
      { name: '起', panelId: 1, function: '猫咪照镜子的日常', emotionIntensity: 3 },
      { name: '承', panelId: 2, function: '镜子里的猫咪做出不同动作', emotionIntensity: 5 },
      { name: '转', panelId: 3, function: '两只猫咪开始对话', emotionIntensity: 8 },
      { name: '合', panelId: 4, function: '达成友谊，温馨结局', emotionIntensity: 7 }
    ]
  },
  
  emotionCurve: [3, 5, 8, 7],
  
  shotDesigns: [
    {
      panelId: 1,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '对称构图，猫咪和镜子各占一半',
      visualFocus: '猫咪好奇地看着镜子',
      designReason: '中景建立场景，对称构图强调镜子的重要性'
    },
    {
      panelId: 2,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '分屏构图，左右对比',
      visualFocus: '猫咪歪头，镜子里的猫咪没歪头',
      designReason: '近景捕捉细节差异，制造悬念',
      visualEffects: '分屏线条，强调对比'
    },
    {
      panelId: 3,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '对话构图，气泡交错',
      visualFocus: '两只猫咪的对话气泡',
      designReason: '近景展现情感交流，气泡设计增加趣味性'
    },
    {
      panelId: 4,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '温馨构图，猫咪和镜子和谐共存',
      visualFocus: '猫咪满足地趴着，镜子里的猫咪微笑',
      designReason: '中景展现温馨氛围，完美收尾'
    }
  ],
  
  dialogueDesigns: [
    {
      panelId: 1,
      speaker: 'narration',
      text: '小花每天都会照镜子',
      subtext: '建立日常场景',
      characterVoice: '温和的旁白',
      writingTip: '用简单的陈述句建立日常感'
    },
    {
      panelId: 2,
      speaker: 'cat',
      text: '咦？你怎么不跟着我动？',
      subtext: '发现异常，产生疑惑',
      characterVoice: '好奇、困惑',
      writingTip: '用疑问句表达角色的困惑'
    },
    {
      panelId: 3,
      speaker: 'mirror_cat',
      text: '因为我是真正的你啊！',
      subtext: '揭示真相，制造惊喜',
      characterVoice: '神秘、友善',
      writingTip: '用反转的对话制造惊喜'
    },
    {
      panelId: 4,
      speaker: 'cat',
      text: '那我们可以一起玩吗？',
      subtext: '接受现实，寻求友谊',
      characterVoice: '期待、温暖',
      writingTip: '用简单的请求表达角色的渴望'
    }
  ],
  
  colorSchemes: [
    {
      panelId: 1,
      mainColor: '米色+橙色',
      mood: '温暖、日常',
      lighting: '自然光从窗户照入'
    },
    {
      panelId: 2,
      mainColor: '米色+红色',
      mood: '好奇、疑惑',
      lighting: '镜子反光增强'
    },
    {
      panelId: 3,
      mainColor: '金色+粉色',
      mood: '奇幻、惊喜',
      lighting: '镜子发出柔和的光'
    },
    {
      panelId: 4,
      mainColor: '米色+粉色',
      mood: '温馨、治愈',
      lighting: '柔和的暖光'
    }
  ],
  
  character: {
    name: '小花（猫咪）',
    occupation: '宠物',
    appearance: '三花猫，眼睛圆圆的',
    personality: '好奇、友善、容易接受新事物',
    catchphrase: '喵？',
    deepDesire: '探索镜子里的世界',
    greatestFear: '吸尘器'
  },
  
  tags: {
    theme: ['友谊', '孤独', '自我认知'],
    emotion: ['温馨', '治愈', '惊喜'],
    visual: ['镜子', '对称', '猫咪'],
    technique: ['分屏', '对话', '对比'],
    audience: ['儿童', '治愈系爱好者', '猫奴']
  },
  
  tested: false
};
