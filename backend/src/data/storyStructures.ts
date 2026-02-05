/**
 * 故事结构模板
 * 基于专业漫画编剧理论
 */

export interface StoryStructureTemplate {
  id: string;
  name: string;
  description: string;
  panelCount: number;
  suitableFor: string[];
  acts: {
    name: string;
    panelRange: [number, number]; // [开始格, 结束格]
    function: string;
    emotionRange: [number, number]; // [最低强度, 最高强度]
    recommendedShots: string[];
    tips: string;
  }[];
}

export const STORY_STRUCTURES: StoryStructureTemplate[] = [
  // 1. 起承转合（4格）
  {
    id: 'kishotenketsu',
    name: '起承转合',
    description: '经典的4格漫画结构，适合短篇故事，节奏明快，转折有力',
    panelCount: 4,
    suitableFor: ['日常搞笑', '温馨治愈', '短篇故事', '四格漫画'],
    acts: [
      {
        name: '起',
        panelRange: [1, 1],
        function: '建立情境和角色状态',
        emotionRange: [3, 5],
        recommendedShots: ['medium', 'long'],
        tips: '介绍主角和日常世界，展示角色的欲望或问题'
      },
      {
        name: '承',
        panelRange: [2, 2],
        function: '发展情节，引入变化',
        emotionRange: [5, 6],
        recommendedShots: ['close_up', 'medium'],
        tips: '事件发生，角色开始反应，情节开始发展'
      },
      {
        name: '转',
        panelRange: [3, 3],
        function: '意外转折，打破预期',
        emotionRange: [8, 10],
        recommendedShots: ['extreme_close_up', 'close_up'],
        tips: '高潮时刻，意外发生，打破读者预期，制造冲击'
      },
      {
        name: '合',
        panelRange: [4, 4],
        function: '结局反转或情感落点',
        emotionRange: [6, 7],
        recommendedShots: ['medium', 'long'],
        tips: '笑点、感悟或余韵，给读者留下印象'
      }
    ]
  },

  // 2. 三幕剧（6-8格）
  {
    id: 'three_act',
    name: '三幕剧',
    description: '经典的电影叙事结构，适合中篇故事，情节完整，情感深刻',
    panelCount: 8,
    suitableFor: ['科幻冒险', '职场故事', '成长故事', '剧情漫画'],
    acts: [
      {
        name: '第一幕：建立',
        panelRange: [1, 3],
        function: '介绍主角和日常世界，展示主角的欲望或问题',
        emotionRange: [3, 5],
        recommendedShots: ['long', 'medium', 'close_up'],
        tips: '用2-3格建立世界观、角色和初始冲突'
      },
      {
        name: '第二幕：对抗',
        panelRange: [4, 6],
        function: '引入冲突或障碍，主角尝试解决但遇到挫折',
        emotionRange: [6, 9],
        recommendedShots: ['close_up', 'extreme_close_up', 'medium'],
        tips: '冲突升级，情感逐渐升高，展现角色的挣扎'
      },
      {
        name: '第三幕：解决',
        panelRange: [7, 8],
        function: '高潮时刻，问题解决或情感升华',
        emotionRange: [9, 7],
        recommendedShots: ['extreme_close_up', 'medium'],
        tips: '第7格是高潮（情感强度9-10），第8格是余韵（6-7）'
      }
    ]
  },

  // 3. 英雄之旅（12格）
  {
    id: 'hero_journey',
    name: '英雄之旅',
    description: '史诗级叙事结构，适合长篇故事，完整的成长弧光',
    panelCount: 12,
    suitableFor: ['史诗冒险', '成长故事', '奇幻故事', '长篇漫画'],
    acts: [
      {
        name: '日常世界',
        panelRange: [1, 1],
        function: '展示主角的平凡生活',
        emotionRange: [3, 4],
        recommendedShots: ['medium', 'long'],
        tips: '建立主角的日常状态和世界观'
      },
      {
        name: '冒险召唤',
        panelRange: [2, 2],
        function: '出现改变的契机',
        emotionRange: [5, 6],
        recommendedShots: ['close_up'],
        tips: '引入冲突或机会'
      },
      {
        name: '拒绝召唤',
        panelRange: [3, 3],
        function: '主角犹豫不决',
        emotionRange: [4, 5],
        recommendedShots: ['close_up'],
        tips: '展现主角的恐惧或疑虑'
      },
      {
        name: '遇见导师',
        panelRange: [4, 4],
        function: '获得帮助或启发',
        emotionRange: [6, 7],
        recommendedShots: ['medium'],
        tips: '引入导师角色或关键信息'
      },
      {
        name: '跨越门槛',
        panelRange: [5, 5],
        function: '主角决定行动',
        emotionRange: [7, 8],
        recommendedShots: ['medium', 'close_up'],
        tips: '主角做出关键决定'
      },
      {
        name: '试炼',
        panelRange: [6, 8],
        function: '面对挑战和考验',
        emotionRange: [7, 9],
        recommendedShots: ['close_up', 'extreme_close_up'],
        tips: '冲突升级，情感高涨'
      },
      {
        name: '最深的洞穴',
        panelRange: [9, 9],
        function: '接近核心问题',
        emotionRange: [9, 10],
        recommendedShots: ['extreme_close_up'],
        tips: '最紧张的时刻'
      },
      {
        name: '磨难与奖赏',
        panelRange: [10, 10],
        function: '高潮战斗或关键选择',
        emotionRange: [10, 10],
        recommendedShots: ['extreme_close_up', 'close_up'],
        tips: '故事的最高潮'
      },
      {
        name: '回归之路',
        panelRange: [11, 11],
        function: '带着收获返回',
        emotionRange: [7, 8],
        recommendedShots: ['medium'],
        tips: '展现主角的改变'
      },
      {
        name: '复活与归来',
        panelRange: [12, 12],
        function: '新的开始或感悟',
        emotionRange: [6, 7],
        recommendedShots: ['medium', 'long'],
        tips: '展现成长后的新状态'
      }
    ]
  }
];

// 根据格数推荐结构
export function recommendStructure(panelCount: number): StoryStructureTemplate {
  if (panelCount === 4) {
    return STORY_STRUCTURES[0]!; // 起承转合
  } else if (panelCount >= 6 && panelCount <= 8) {
    return STORY_STRUCTURES[1]!; // 三幕剧
  } else if (panelCount >= 10) {
    return STORY_STRUCTURES[2]!; // 英雄之旅
  } else {
    // 默认返回起承转合
    return STORY_STRUCTURES[0]!;
  }
}

// 根据结构ID获取模板
export function getStructureById(id: string): StoryStructureTemplate | undefined {
  return STORY_STRUCTURES.find(s => s.id === id);
}
