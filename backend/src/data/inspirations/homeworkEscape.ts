import { Inspiration } from '../types';

/**
 * 作业本逃跑
 * 小学生的作业本长出了腿，趁他不注意逃跑了
 */
export const homeworkEscape: Inspiration = {
  id: 'homework_escape',
  title: '作业本逃跑',
  description: '小学生的作业本长出了腿，趁他不注意逃跑了',
  category: 'funny',
  difficulty: 2,
  
  structure: {
    type: 'kishotenketsu',
    acts: [
      { name: '起', panelId: 1, function: '小学生不想写作业', emotionIntensity: 3 },
      { name: '承', panelId: 2, function: '作业本长出腿开始逃跑', emotionIntensity: 6 },
      { name: '转', panelId: 3, function: '追逐作业本的搞笑场面', emotionIntensity: 8 },
      { name: '合', panelId: 4, function: '最终和解，乖乖写作业', emotionIntensity: 5 }
    ]
  },
  
  emotionCurve: [3, 6, 8, 5],
  
  shotDesigns: [
    {
      panelId: 1,
      shotType: 'medium',
      cameraAngle: 'high',
      composition: '俯视小学生趴在桌上',
      visualFocus: '无精打采的表情、空白的作业本',
      designReason: '中景展现懒散状态，俯视角度强调无奈'
    },
    {
      panelId: 2,
      shotType: 'close_up',
      cameraAngle: 'low',
      composition: '仰视作业本长出腿',
      visualFocus: '作业本的小腿、惊讶的表情',
      designReason: '近景捕捉魔幻瞬间，仰视角度增强趣味性',
      visualEffects: '作业本拟人化、动态线条'
    },
    {
      panelId: 3,
      shotType: 'long',
      cameraAngle: 'eye_level',
      composition: '追逐场景，对角线构图',
      visualFocus: '小学生追赶作业本的动态',
      designReason: '远景展现追逐动作，制造喜剧效果'
    },
    {
      panelId: 4,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      composition: '小学生和作业本和解',
      visualFocus: '小学生认真写作业、作业本乖乖躺着',
      designReason: '中景展现和谐画面，完美收尾'
    }
  ],
  
  dialogueDesigns: [
    {
      panelId: 1,
      speaker: 'student',
      text: '唉，又是一堆作业...',
      subtext: '抗拒、无奈',
      characterVoice: '无精打采、叹气',
      writingTip: '用叹气词表达抗拒情绪'
    },
    {
      panelId: 2,
      speaker: 'student',
      text: '等等！你要去哪里？！',
      subtext: '震惊、不可置信',
      characterVoice: '惊讶、大喊',
      writingTip: '用感叹号表达强烈情绪'
    },
    {
      panelId: 3,
      speaker: 'homework',
      text: '我受够了！我要自由！',
      subtext: '作业本的"反抗"',
      characterVoice: '拟人化、搞笑',
      writingTip: '用拟人化对话增加趣味性'
    },
    {
      panelId: 4,
      speaker: 'student',
      text: '好吧好吧，我写还不行吗...',
      subtext: '妥协、接受',
      characterVoice: '无奈、认真',
      writingTip: '用妥协的语气表达成长'
    }
  ],
  
  colorSchemes: [
    {
      panelId: 1,
      mainColor: '多色',
      mood: '无聊、慵懒'
    },
    {
      panelId: 2,
      mainColor: '多色',
      mood: '惊讶、魔幻'
    },
    {
      panelId: 3,
      mainColor: '多色',
      mood: '活泼、搞笑'
    },
    {
      panelId: 4,
      mainColor: '多色',
      mood: '和谐、平静'
    }
  ],
  
  character: {
      name: '小明（小学生）',
      personality: '调皮、懒惰但善良'
    , occupation: '未知', appearance: '待补充', catchphrase: '待补充', deepDesire: '待补充', greatestFear: '待补充'},
  
  tags: {
    theme: ['责任', '成长', '童趣'],
    emotion: ['搞笑', '无奈', '温馨'],
    visual: ['作业本', '追逐', '拟人化'],
    technique: ['拟人化', '动态表现', '喜剧效果'],
    audience: ['儿童', '学生', '家长']
  },
  
  tested: false
};
