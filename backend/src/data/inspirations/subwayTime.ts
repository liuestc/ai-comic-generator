import { Inspiration } from '../types';

/**
 * 地铁穿越
 * 上班族在地铁上睡着，醒来发现穿越到了古代
 */
export const subwayTime: Inspiration = {
  id: 'subway_time',
  title: '地铁穿越',
  description: '上班族在地铁上睡着，醒来发现穿越到了古代',
  category: 'scifi',
  difficulty: 3,
  
  structure: {
    type: 'kishotenketsu',
    acts: [
      { name: '起', panelId: 1, function: '疲惫的上班族在地铁上', emotionIntensity: 2 },
      { name: '承', panelId: 2, function: '睡着并做梦', emotionIntensity: 4 },
      { name: '转', panelId: 3, function: '醒来发现在古代', emotionIntensity: 9 },
      { name: '合', panelId: 4, function: '惊慌失措，留下悬念', emotionIntensity: 8 }
    ]
  },
  
  emotionCurve: [2, 4, 9, 8],
  
  shotDesigns: [
    {
      panelId: 1,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '拥挤的地铁车厢，人物在中间',
      visualFocus: '疲惫的表情、松垮的领带',
      designReason: '中景展现拥挤环境，建立现代都市感'
    },
    {
      panelId: 2,
      shotType: 'close_up',
      cameraAngle: 'eye_level',
      composition: '特写闭眼的脸，周围模糊',
      visualFocus: '闭上的眼睛、放松的表情',
      designReason: '近景展现入睡状态，模糊背景暗示意识模糊',
      visualEffects: '背景虚化、梦境般的光晕'
    },
    {
      panelId: 3,
      shotType: 'long',
      cameraAngle: 'high',
      composition: '俯视古代街道，人物在中心',
      visualFocus: '古代建筑、穿着古装的路人',
      designReason: '远景展现环境巨变，俯视角度强调人物的渺小和震惊'
    },
    {
      panelId: 4,
      shotType: 'close_up',
      cameraAngle: 'low',
      composition: '仰视人物惊恐的脸',
      visualFocus: '瞪大的眼睛、张开的嘴',
      designReason: '近景捕捉强烈情绪，仰视角度增强戏剧性'
    }
  ],
  
  dialogueDesigns: [
    {
      panelId: 1,
      speaker: 'protagonist',
      text: '又是加班到深夜...',
      subtext: '疲惫、无奈',
      characterVoice: '疲惫、自言自语',
      writingTip: '用省略号表达疲惫感'
    },
    {
      panelId: 2,
      speaker: 'narration',
      text: '迷迷糊糊中，他睡着了',
      subtext: '过渡到梦境',
      characterVoice: '温和的旁白',
      writingTip: '用简短的叙述推进情节'
    },
    {
      panelId: 3,
      speaker: 'protagonist',
      text: '这...这是哪里？！',
      subtext: '震惊、困惑',
      characterVoice: '惊慌、不可置信',
      writingTip: '用感叹号和省略号表达强烈情绪'
    },
    {
      panelId: 4,
      speaker: 'ancient_person',
      text: '这位客官，您没事吧？',
      subtext: '确认穿越的真实性',
      characterVoice: '古代口音、关切',
      writingTip: '用古代称呼强化时空错位感'
    }
  ],
  
  colorSchemes: [
    {
      panelId: 1,
      mainColor: '深灰色',
      mood: '压抑、疲惫',
      lighting: '地铁车厢的人造光'
    },
    {
      panelId: 2,
      mainColor: '紫色',
      mood: '梦幻、模糊',
      lighting: '梦境般的光晕'
    },
    {
      panelId: 3,
      mainColor: '古铜色',
      mood: '古朴、陌生',
      lighting: '古代街道的自然阳光'
    },
    {
      panelId: 4,
      mainColor: '红色',
      mood: '惊慌、混乱',
      lighting: '强烈的对比光'
    }
  ],
  
  character: {
    name: '李明（上班族）',
    occupation: '公司职员',
    appearance: '西装革履，提着公文包',
    personality: '勤奋、疲惫、适应力强',
    catchphrase: '我还要赶地铁...',
    deepDesire: '睡个好觉',
    greatestFear: '错过末班车'
  },
  
  tags: {
    theme: ['穿越', '现代与古代', '命运'],
    emotion: ['震惊', '困惑', '冒险'],
    visual: ['地铁', '古代街道', '时空对比'],
    technique: ['环境对比', '色调转换', '视角变化'],
    audience: ['穿越题材爱好者', '上班族', '年轻人']
  },
  
  tested: false
};
