/**
 * 创意灵感库数据
 * 每个创意都包含完整的专业分析
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
  tags: string[];
  
  // 测试验证
  tested: boolean;
  testResult?: string;
}

export const INSPIRATIONS: Inspiration[] = [
  // 1. Bug数字世界（已测试）
  {
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
        { name: '合', panelId: 4, function: '展现新世界，留下悬念', emotionIntensity: 7 },
      ]
    },
    
    emotionCurve: [3, 5, 9, 7],
    
    shotDesigns: [
      {
        panelId: 1,
        shotType: 'close_up',
        cameraAngle: 'eye_level',
        composition: '三分法，焦点在人物脸部',
        visualFocus: '疲惫的表情、屏幕红色错误提示',
        designReason: '近景展现角色状态，建立共鸣'
      },
      {
        panelId: 2,
        shotType: 'extreme_close_up',
        cameraAngle: 'eye_level',
        composition: '中心构图，焦点在屏幕',
        visualFocus: '绿色代码、闪烁效果',
        designReason: '特写强调异常细节，制造悬念'
      },
      {
        panelId: 3,
        shotType: 'close_up',
        cameraAngle: 'high',
        composition: '对角线构图，制造动感',
        visualFocus: '惊恐表情、后倒动作',
        designReason: '俯视增强戏剧性，对角线表现动作',
        visualEffects: '速度线、集中线'
      },
      {
        panelId: 4,
        shotType: 'extreme_close_up',
        cameraAngle: 'low',
        composition: '辐射构图，焦点在漩涡中心',
        visualFocus: '数字世界、绿色漩涡',
        designReason: '仰视表现宏大场景，特写增强冲击力',
        visualEffects: '放射线、光效'
      }
    ],
    
    dialogueDesigns: [
      {
        panelId: 1,
        dialogue: '该死！这个BUG已经折磨我三天了！',
        technique: '短句、感叹，表现焦虑',
        characterVoice: '程序员的口吻，技术词汇',
        subtext: '我快崩溃了'
      },
      {
        panelId: 2,
        dialogue: '等等...这代码...不对劲...',
        technique: '省略号、断句，制造悬念',
        characterVoice: '自言自语，逐渐意识到异常',
        subtext: '发现了什么不寻常的东西'
      },
      {
        panelId: 3,
        dialogue: '什么！？屏幕怎么裂开了！？',
        technique: '问号、感叹号，表现惊恐',
        characterVoice: '失控的尖叫',
        subtext: '这超出了我的理解'
      },
      {
        panelId: 4,
        dialogue: '这...这是...数字世界？',
        technique: '省略号、疑问，表现震撼',
        characterVoice: '敬畏的低语',
        subtext: '我的世界观被颠覆了'
      }
    ],
    
    colorSchemes: [
      {
        panelId: 1,
        mainColor: '冷色调（蓝色）',
        mood: '压抑、焦虑',
        lighting: '低调光，强阴影'
      },
      {
        panelId: 2,
        mainColor: '绿色（异常代码）',
        mood: '神秘、不安',
        lighting: '屏幕发光，脸部被照亮'
      },
      {
        panelId: 3,
        mainColor: '强烈绿色+白色',
        mood: '惊恐、冲击',
        lighting: '强烈对比，爆发感'
      },
      {
        panelId: 4,
        mainColor: '绿色+蓝色渐变',
        mood: '宏大、神秘',
        lighting: '背光，剪影效果'
      }
    ],
    
    character: {
      name: '小林',
      occupation: '程序员',
      appearance: '黑眼圈，Keep Calm and Debug T恤，乱发',
      personality: '执着的技术宅',
      catchphrase: '该死的bug...',
      deepDesire: '证明自己的技术能力',
      greatestFear: '永远解决不了问题'
    },
    
    tags: ['起承转合', '情感曲线强', '视觉冲击', '程序员共鸣'],
    tested: true,
    testResult: '⭐⭐⭐⭐⭐ 完美'
  },

  // 2. 镜子里的猫咪
  {
    id: 'mirror_cat',
    title: '镜子里的猫咪',
    description: '一只猫咪第一次看到镜子里的自己，以为是另一只猫',
    category: 'funny',
    difficulty: 1,
    
    structure: {
      type: 'kishotenketsu',
      acts: [
        { name: '起', panelId: 1, function: '猫咪发现镜子', emotionIntensity: 4 },
        { name: '承', panelId: 2, function: '好奇地靠近', emotionIntensity: 6 },
        { name: '转', panelId: 3, function: '以为是敌人，炸毛', emotionIntensity: 8 },
        { name: '合', panelId: 4, function: '主人笑了，猫咪困惑', emotionIntensity: 5 },
      ]
    },
    
    emotionCurve: [4, 6, 8, 5],
    
    shotDesigns: [
      {
        panelId: 1,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '三分法，猫咪在左侧',
        visualFocus: '猫咪好奇的眼神',
        designReason: '中景建立场景，展示猫咪与镜子的关系'
      },
      {
        panelId: 2,
        shotType: 'close_up',
        cameraAngle: 'eye_level',
        composition: '对称构图，猫咪和镜像对称',
        visualFocus: '猫咪鼻子贴近镜子',
        designReason: '近景展现好奇心，对称构图强调镜像'
      },
      {
        panelId: 3,
        shotType: 'close_up',
        cameraAngle: 'low',
        composition: '中心构图，猫咪占据画面',
        visualFocus: '炸毛、弓背、瞪眼',
        designReason: '仰视让猫咪显得威武，近景展现炸毛细节',
        visualEffects: '震动线、汗滴'
      },
      {
        panelId: 4,
        shotType: 'medium',
        cameraAngle: 'high',
        composition: '框架构图，主人在背景',
        visualFocus: '猫咪困惑的表情',
        designReason: '俯视展现猫咪的无辜，中景展示主人反应'
      }
    ],
    
    dialogueDesigns: [
      {
        panelId: 1,
        dialogue: '喵？那是什么？',
        technique: '疑问句，表现好奇',
        characterVoice: '猫咪的内心独白',
        subtext: '发现了新奇的东西'
      },
      {
        panelId: 2,
        dialogue: '咦...这家伙长得好像我...',
        technique: '省略号，表现思考',
        characterVoice: '自言自语',
        subtext: '开始意识到相似性'
      },
      {
        panelId: 3,
        dialogue: '喵啊啊！！敌人！！',
        technique: '拉长音、多个感叹号，表现惊恐',
        characterVoice: '炸毛的尖叫',
        subtext: '误以为是敌人'
      },
      {
        panelId: 4,
        dialogue: '主人：哈哈哈，傻猫！',
        technique: '笑声，表现轻松',
        characterVoice: '主人的调侃',
        subtext: '觉得猫咪很可爱'
      }
    ],
    
    colorSchemes: [
      {
        panelId: 1,
        mainColor: '温暖黄色',
        mood: '好奇、温馨',
        lighting: '自然光，柔和'
      },
      {
        panelId: 2,
        mainColor: '黄色+蓝色（镜子反光）',
        mood: '好奇、探索',
        lighting: '镜面反光'
      },
      {
        panelId: 3,
        mainColor: '红色+黑色',
        mood: '惊恐、紧张',
        lighting: '高对比度'
      },
      {
        panelId: 4,
        mainColor: '温暖黄色',
        mood: '轻松、搞笑',
        lighting: '恢复柔和光线'
      }
    ],
    
    character: {
      name: '小橘',
      occupation: '宠物猫',
      appearance: '橘色短毛猫，圆圆的眼睛',
      personality: '好奇但胆小',
      catchphrase: '喵？',
      deepDesire: '探索新事物',
      greatestFear: '未知的威胁'
    },
    
    tags: ['起承转合', '日常搞笑', '萌宠', '简单有趣'],
    tested: false
  },

  // 3. 地铁穿越
  {
    id: 'subway_time_travel',
    title: '地铁穿越',
    description: '上班族坐错地铁，发现自己穿越到了古代',
    category: 'scifi',
    difficulty: 2,
    
    structure: {
      type: 'kishotenketsu',
      acts: [
        { name: '起', panelId: 1, function: '匆忙赶地铁', emotionIntensity: 5 },
        { name: '承', panelId: 2, function: '地铁变得奇怪', emotionIntensity: 6 },
        { name: '转', panelId: 3, function: '门打开，古代街道', emotionIntensity: 9 },
        { name: '合', panelId: 4, function: '古人围观，主角傻眼', emotionIntensity: 7 },
      ]
    },
    
    emotionCurve: [5, 6, 9, 7],
    
    shotDesigns: [
      {
        panelId: 1,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '对角线构图，表现奔跑',
        visualFocus: '匆忙的表情、手表',
        designReason: '中景展现动作，对角线制造动感',
        visualEffects: '速度线'
      },
      {
        panelId: 2,
        shotType: 'close_up',
        cameraAngle: 'eye_level',
        composition: '中心构图，焦点在窗外',
        visualFocus: '窗外景色变化、困惑表情',
        designReason: '近景展现角色反应，窗外景色制造悬念'
      },
      {
        panelId: 3,
        shotType: 'long',
        cameraAngle: 'eye_level',
        composition: '框架构图，地铁门框住古代街道',
        visualFocus: '古代建筑、服饰',
        designReason: '远景展现场景对比，框架构图强调穿越',
        visualEffects: '闪光效果'
      },
      {
        pantelId: 4,
        shotType: 'medium',
        cameraAngle: 'high',
        composition: '三分法，主角在中心',
        visualFocus: '主角震惊表情、古人围观',
        designReason: '俯视展现主角的渺小和无助'
      }
    ],
    
    dialogueDesigns: [
      {
        panelId: 1,
        dialogue: '糟了！要迟到了！',
        technique: '短句、感叹，表现急迫',
        characterVoice: '上班族的焦虑',
        subtext: '又要被老板骂了'
      },
      {
        panelId: 2,
        dialogue: '咦...窗外的景色...不对劲...',
        technique: '省略号，表现困惑',
        characterVoice: '自言自语',
        subtext: '发现异常但不敢相信'
      },
      {
        panelId: 3,
        dialogue: '这...这是哪里！？',
        technique: '问号、感叹号，表现震惊',
        characterVoice: '惊恐的质问',
        subtext: '世界观崩塌'
      },
      {
        panelId: 4,
        dialogue: '古人：此人衣着怪异，莫非是妖怪？',
        technique: '古代口吻，制造反差',
        characterVoice: '古人的疑惑',
        subtext: '文化冲突'
      }
    ],
    
    colorSchemes: [
      {
        panelId: 1,
        mainColor: '冷色调（蓝灰）',
        mood: '匆忙、现代感',
        lighting: '地铁站荧光灯'
      },
      {
        panelId: 2,
        mainColor: '蓝色渐变到暖色',
        mood: '困惑、转变',
        lighting: '窗外光线变化'
      },
      {
        panelId: 3,
        mainColor: '暖色调（黄褐）',
        mood: '震撼、古代感',
        lighting: '自然光，阳光明媚'
      },
      {
        panelId: 4,
        mainColor: '暖色调',
        mood: '尴尬、搞笑',
        lighting: '户外自然光'
      }
    },
    
    character: {
      name: '小王',
      occupation: '上班族',
      appearance: '西装、公文包、疲惫',
      personality: '普通社畜',
      catchphrase: '又要迟到了...',
      deepDesire: '逃离996',
      greatestFear: '被老板骂'
    },
    
    tags: ['起承转合', '穿越梗', '上班族共鸣', '搞笑'],
    tested: false
  },

  // 4. 外卖的灵魂
  {
    id: 'delivery_soul',
    title: '外卖的灵魂',
    description: '外卖小哥发现自己送的外卖里住着食物的灵魂',
    category: 'funny',
    difficulty: 2,
    
    structure: {
      type: 'kishotenketsu',
      acts: [
        { name: '起', panelId: 1, function: '送外卖', emotionIntensity: 3 },
        { name: '承', panelId: 2, function: '听到盒子里有声音', emotionIntensity: 6 },
        { name: '转', panelId: 3, function: '打开发现食物在说话', emotionIntensity: 9 },
        { name: '合', panelId: 4, function: '食物请求不要被吃', emotionIntensity: 7 },
      ]
    },
    
    emotionCurve: [3, 6, 9, 7],
    
    shotDesigns: [
      {
        panelId: 1,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '三分法，外卖小哥在左',
        visualFocus: '外卖箱、疲惫表情',
        designReason: '中景建立日常场景'
      },
      {
        panelId: 2,
        shotType: 'close_up',
        cameraAngle: 'eye_level',
        composition: '中心构图，焦点在外卖盒',
        visualFocus: '外卖盒震动、困惑表情',
        designReason: '近景展现异常，制造悬念',
        visualEffects: '震动线'
      },
      {
        panelId: 3,
        shotType: 'extreme_close_up',
        cameraAngle: 'high',
        composition: '俯视构图，看到盒内',
        visualFocus: '拟人化的食物、惊恐表情',
        designReason: '特写展现食物灵魂，俯视视角自然',
        visualEffects: '闪光、灵魂光环'
      },
      {
        panelId: 4,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '对话构图，人和食物对视',
        visualFocus: '外卖小哥震惊、食物哀求',
        designReason: '中景展现对话场景'
      }
    ],
    
    dialogueDesigns: [
      {
        panelId: 1,
        dialogue: '今天第50单了...累死了...',
        technique: '省略号，表现疲惫',
        characterVoice: '外卖小哥的自言自语',
        subtext: '太辛苦了'
      },
      {
        panelId: 2,
        dialogue: '嗯？这盒子...在动？',
        technique: '疑问句、省略号，表现困惑',
        characterVoice: '疑惑的自问',
        subtext: '发现异常'
      },
      {
        panelId: 3,
        dialogue: '天啊！你...你会说话！？',
        technique: '感叹号、问号，表现震惊',
        characterVoice: '惊恐的尖叫',
        subtext: '三观崩塌'
      },
      {
        panelId: 4,
        dialogue: '炸鸡：大哥！别送我去！我不想被吃掉！',
        technique: '拟人化、哀求语气',
        characterVoice: '食物的哀求',
        subtext: '食物也有感情'
      }
    ],
    
    colorSchemes: [
      {
        panelId: 1,
        mainColor: '灰色调',
        mood: '疲惫、日常',
        lighting: '阴天，平淡光线'
      },
      {
        panelId: 2,
        mainColor: '灰色+黄色（盒子发光）',
        mood: '困惑、神秘',
        lighting: '盒子内发光'
      },
      {
        panelId: 3,
        mainColor: '金黄色（食物光环）',
        mood: '震撼、奇幻',
        lighting: '灵魂光芒'
      },
      {
        panelId: 4,
        mainColor: '暖色调',
        mood: '搞笑、温馨',
        lighting: '柔和光线'
      }
    },
    
    character: {
      name: '小李',
      occupation: '外卖小哥',
      appearance: '外卖制服、头盔、疲惫',
      personality: '勤劳但疲惫',
      catchphrase: '又要送单了...',
      deepDesire: '多赚点钱',
      greatestFear: '差评'
    },
    
    tags: ['起承转合', '灵异搞笑', '外卖小哥', '温馨'],
    tested: false
  },

  // 5. 作业本逃跑
  {
    id: 'homework_escape',
    title: '作业本逃跑',
    description: '小学生的作业本长腿跑了，不想被写作业',
    category: 'funny',
    difficulty: 1,
    
    structure: {
      type: 'kishotenketsu',
      acts: [
        { name: '起', panelId: 1, function: '准备写作业', emotionIntensity: 3 },
        { name: '承', panelId: 2, function: '作业本长腿', emotionIntensity: 6 },
        { name: '转', panelId: 3, function: '作业本逃跑', emotionIntensity: 8 },
        { name: '合', panelId: 4, function: '追逐战', emotionIntensity: 7 },
      ]
    },
    
    emotionCurve: [3, 6, 8, 7],
    
    shotDesigns: [
      {
        panelId: 1,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '三分法，学生在右',
        visualFocus: '不情愿的表情、作业本',
        designReason: '中景建立场景，展现学生心情'
      },
      {
        panelId: 2,
        shotType: 'close_up',
        cameraAngle: 'high',
        composition: '俯视构图，看到作业本',
        visualFocus: '作业本长出小腿',
        designReason: '近景展现奇幻元素，俯视视角自然',
        visualEffects: '闪光、魔法效果'
      },
      {
        panelId: 3,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        composition: '对角线构图，表现奔跑',
        visualFocus: '作业本逃跑、学生震惊',
        designReason: '中景展现动作，对角线制造动感',
        visualEffects: '速度线'
      },
      {
        panelId: 4,
        shotType: 'long',
        cameraAngle: 'high',
        composition: '俯视构图，展现追逐',
        visualFocus: '学生追作业本',
        designReason: '远景展现完整追逐场景，俯视增加趣味性'
      }
    ],
    
    dialogueDesigns: [
      {
        panelId: 1,
        dialogue: '唉...又要写作业了...',
        technique: '叹气、省略号，表现不情愿',
        characterVoice: '小学生的抱怨',
        subtext: '不想写作业'
      },
      {
        panelId: 2,
        dialogue: '咦！？作业本...长腿了！？',
        technique: '感叹号、问号，表现震惊',
        characterVoice: '惊讶的发现',
        subtext: '不敢相信'
      },
      {
        panelId: 3,
        dialogue: '作业本：我不要被写！拜拜！',
        technique: '拟人化、逃跑语气',
        characterVoice: '作业本的叛逆',
        subtext: '作业本也不想被写'
      },
      {
        panelId: 4,
        dialogue: '等等！回来！妈妈会骂我的！',
        technique: '急迫、哀求',
        characterVoice: '学生的焦急',
        subtext: '害怕被家长责备'
      }
    ],
    
    colorSchemes: [
      {
        panelId: 1,
        mainColor: '暖黄色',
        mood: '温馨、日常',
        lighting: '台灯光'
      },
      {
        panelId: 2,
        mainColor: '黄色+紫色（魔法）',
        mood: '惊讶、奇幻',
        lighting: '魔法光芒'
      },
      {
        panelId: 3,
        mainColor: '明亮色调',
        mood: '紧张、搞笑',
        lighting: '室内明亮'
      },
      {
        panelId: 4,
        mainColor: '明亮色调',
        mood: '搞笑、动感',
        lighting: '室内光线'
      }
    ],
    
    character: {
      name: '小明',
      occupation: '小学生',
      appearance: '校服、书包、天真',
      personality: '贪玩但善良',
      catchphrase: '不想写作业...',
      deepDesire: '快乐玩耍',
      greatestFear: '被妈妈骂'
    },
    
    tags: ['起承转合', '童趣', '奇幻', '简单有趣'],
    tested: false
  },

  // 6-30: 继续添加其他创意...
  // 为了节省篇幅，这里先实现5个完整的案例
  // 实际使用时需要补充到30个

];

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
