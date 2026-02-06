import { Inspiration } from '../types';

/**
 * 外卖灵魂
 * 外卖员送餐时发现顾客是幽灵，但幽灵只是想吃一顿热饭
 */
export const deliveryGhost: Inspiration = {
  id: 'delivery_ghost',
  title: '外卖灵魂',
  description: '外卖员送餐时发现顾客是幽灵，但幽灵只是想吃一顿热饭',
  category: 'funny',
  difficulty: 3,
  
  structure: {
    type: 'kishotenketsu',
    acts: [
      { name: '起', panelId: 1, function: '外卖员送餐到老旧小区', emotionIntensity: 3 },
      { name: '承', panelId: 2, function: '发现顾客是幽灵', emotionIntensity: 7 },
      { name: '转', panelId: 3, function: '幽灵讲述自己的故事', emotionIntensity: 6 },
      { name: '合', panelId: 4, function: '温馨送餐，感动结局', emotionIntensity: 8 }
    ]
  },
  
  emotionCurve: [3, 7, 6, 8],
  
  shotDesigns: [
    {
      panelId: 1,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '外卖员站在老旧楼道前',
      visualFocus: '昏暗的楼道、破旧的门牌',
      designReason: '中景建立阴森氛围，为后续惊吓做铺垫'
    },
    {
      panelId: 2,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '外卖员和幽灵面对面',
      visualFocus: '幽灵半透明的身体、外卖员惊恐的表情',
      designReason: '近景捕捉惊吓瞬间，制造视觉冲击',
      visualEffects: '幽灵半透明效果、冷光'
    },
    {
      panelId: 3,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '两人坐下对话',
      visualFocus: '幽灵温和的表情、外卖袋',
      designReason: '中景展现情感交流，缓和紧张气氛'
    },
    {
      panelId: 4,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '幽灵满足地吃着外卖',
      visualFocus: '幽灵幸福的笑容、热气腾腾的食物',
      designReason: '近景展现温馨瞬间，传递治愈感'
    }
  ],
  
  dialogueDesigns: [
    {
      panelId: 1,
      speaker: 'delivery_guy',
      text: '404号...这栋楼好久没人住了吧',
      subtext: '感到不安',
      characterVoice: '疑惑、谨慎',
      writingTip: '用环境描写暗示异常'
    },
    {
      panelId: 2,
      speaker: 'delivery_guy',
      text: '你...你是...！',
      subtext: '惊吓、恐惧',
      characterVoice: '惊恐、结巴',
      writingTip: '用省略号和感叹号表达惊吓'
    },
    {
      panelId: 3,
      speaker: 'ghost',
      text: '别怕，我只是想吃一顿热饭...',
      subtext: '孤独、渴望',
      characterVoice: '温和、悲伤',
      writingTip: '用简单的愿望打动人心'
    },
    {
      panelId: 4,
      speaker: 'ghost',
      text: '谢谢你，这是我这么多年来最好吃的一顿',
      subtext: '感激、满足',
      characterVoice: '真诚、温暖',
      writingTip: '用感谢的话语传递温情'
    }
  ],
  
  colorSchemes: [
    {
      panelId: 1,
      mainColor: '深蓝色',
      mood: '阴森、不安',
      lighting: '昏暗的楼道灯光'
    },
    {
      panelId: 2,
      mainColor: '青色',
      mood: '惊吓、超自然',
      lighting: '幽灵发出的冷光'
    },
    {
      panelId: 3,
      mainColor: '暖黄色',
      mood: '缓和、倾听',
      lighting: '温馨的室内灯光'
    },
    {
      panelId: 4,
      mainColor: '橙色',
      mood: '温馨、治愈',
      lighting: '柔和的暖光'
    }
  ],
  
  character: {
    name: '小王（外卖员）',
    occupation: '外卖员',
    appearance: '穿着黄色制服，戴着头盔',
    personality: '善良、勇敢、富有同情心',
    catchphrase: '您的外卖到了！',
    deepDesire: '准时送达每一份温暖',
    greatestFear: '差评'
  },
  
  tags: {
    theme: ['孤独', '温情', '超自然'],
    emotion: ['惊吓', '感动', '治愈'],
    visual: ['幽灵', '老旧建筑', '外卖'],
    technique: ['反转', '情感转折', '视觉对比'],
    audience: ['灵异爱好者', '治愈系爱好者', '成年人']
  },
  
  tested: false
};
