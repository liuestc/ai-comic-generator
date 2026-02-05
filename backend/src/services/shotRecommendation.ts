/**
 * 智能镜头推荐服务
 * 根据故事内容推荐最佳的镜头序列
 */

import { ComicPanel, ShotType, CameraAngle, ShotRecommendation } from '../types';

// 根据故事内容推荐镜头序列
export function recommendShotSequence(panels: ComicPanel[]): ShotRecommendation[] {
  const recommendations: ShotRecommendation[] = [];
  
  // 经典四格结构推荐
  if (panels.length === 4) {
    // 默认推荐序列：远景 → 中景 → 近景 → 特写
    const defaultSequence: ShotRecommendation[] = [
      {
        panelId: 1,
        shotType: ShotType.WIDE_SHOT,
        cameraAngle: CameraAngle.EYE_LEVEL,
        reason: '第一格用远景建立环境和情境'
      },
      {
        panelId: 2,
        shotType: ShotType.MEDIUM_SHOT,
        cameraAngle: CameraAngle.EYE_LEVEL,
        reason: '第二格用中景展示对话或动作'
      },
      {
        panelId: 3,
        shotType: ShotType.CLOSE_UP,
        cameraAngle: CameraAngle.EYE_LEVEL,
        reason: '第三格（转折）用近景表现情感变化'
      },
      {
        panelId: 4,
        shotType: ShotType.EXTREME_CLOSE_UP,
        cameraAngle: CameraAngle.LOW_ANGLE,
        reason: '第四格（高潮）用特写+仰视强调结局'
      }
    ];
    
    // 复制默认序列
    recommendations.push(...defaultSequence);
  }
  
  // 根据场景关键词智能调整推荐
  panels.forEach((panel, index) => {
    const scene = panel.sceneDescription.toLowerCase();
    const dialogue = panel.dialogue.toLowerCase();
    
    if (!recommendations[index]) {
      recommendations[index] = {
        panelId: panel.id,
        shotType: ShotType.MEDIUM_SHOT,
        cameraAngle: CameraAngle.EYE_LEVEL,
        reason: '默认推荐'
      };
    }
    
    // 检测环境描述 → 推荐远景
    if (scene.includes('房间') || scene.includes('街道') || scene.includes('环境') || 
        scene.includes('办公室') || scene.includes('公园') || scene.includes('商店')) {
      recommendations[index].shotType = ShotType.WIDE_SHOT;
      recommendations[index].reason = '场景包含环境描述，推荐远景建立空间感';
    }
    
    // 检测对话 → 推荐中景
    if (dialogue && dialogue.length > 10) {
      recommendations[index].shotType = ShotType.MEDIUM_SHOT;
      recommendations[index].reason = '包含对话，推荐中景展示互动';
    }
    
    // 检测情感词 → 推荐近景
    if (scene.includes('哭') || scene.includes('笑') || scene.includes('惊讶') || 
        scene.includes('愤怒') || scene.includes('震惊') || scene.includes('感动')) {
      recommendations[index].shotType = ShotType.CLOSE_UP;
      recommendations[index].reason = '包含情感表达，推荐近景捕捉面部表情';
    }
    
    // 检测细节描述 → 推荐特写
    if (scene.includes('眼睛') || scene.includes('手') || scene.includes('细节') || 
        scene.includes('注视') || scene.includes('盯着')) {
      recommendations[index].shotType = ShotType.EXTREME_CLOSE_UP;
      recommendations[index].reason = '强调细节，推荐特写增强视觉冲击';
    }
    
    // 检测弱势情境 → 推荐俯视
    if (scene.includes('无助') || scene.includes('失败') || scene.includes('崩溃') || 
        scene.includes('跪') || scene.includes('倒下') || scene.includes('绝望')) {
      recommendations[index].cameraAngle = CameraAngle.HIGH_ANGLE;
      recommendations[index].reason += '，俯视角度表现弱势和无力感';
    }
    
    // 检测强势情境 → 推荐仰视
    if (scene.includes('强大') || scene.includes('胜利') || scene.includes('威严') || 
        scene.includes('站立') || scene.includes('高大') || scene.includes('自信')) {
      recommendations[index].cameraAngle = CameraAngle.LOW_ANGLE;
      recommendations[index].reason += '，仰视角度表现权威和力量感';
    }
    
    // 检测紧张/冲突 → 推荐特殊角度
    if (scene.includes('紧张') || scene.includes('冲突') || scene.includes('对峙')) {
      if (index % 2 === 0) {
        recommendations[index].cameraAngle = CameraAngle.LOW_ANGLE;
      } else {
        recommendations[index].cameraAngle = CameraAngle.HIGH_ANGLE;
      }
      recommendations[index].reason += '，对比角度增强戏剧张力';
    }
  });
  
  return recommendations;
}

// 为单个分格推荐镜头
export function recommendShotForPanel(panel: ComicPanel): ShotRecommendation {
  const scene = panel.sceneDescription.toLowerCase();
  const dialogue = panel.dialogue.toLowerCase();
  
  let shotType = ShotType.MEDIUM_SHOT;
  let cameraAngle = CameraAngle.EYE_LEVEL;
  let reason = '默认推荐：中景平视';
  
  // 优先级：特写 > 近景 > 远景 > 中景
  
  // 检测细节
  if (scene.includes('眼睛') || scene.includes('手') || scene.includes('细节')) {
    shotType = ShotType.EXTREME_CLOSE_UP;
    reason = '强调细节，推荐特写';
  }
  // 检测情感
  else if (scene.includes('哭') || scene.includes('笑') || scene.includes('惊讶') || scene.includes('愤怒')) {
    shotType = ShotType.CLOSE_UP;
    reason = '包含情感表达，推荐近景';
  }
  // 检测环境
  else if (scene.includes('房间') || scene.includes('街道') || scene.includes('环境')) {
    shotType = ShotType.WIDE_SHOT;
    reason = '场景包含环境描述，推荐远景';
  }
  // 检测对话
  else if (dialogue && dialogue.length > 10) {
    shotType = ShotType.MEDIUM_SHOT;
    reason = '包含对话，推荐中景';
  }
  
  // 检测角度
  if (scene.includes('无助') || scene.includes('失败') || scene.includes('崩溃')) {
    cameraAngle = CameraAngle.HIGH_ANGLE;
    reason += '，俯视角度表现弱势';
  } else if (scene.includes('强大') || scene.includes('胜利') || scene.includes('威严')) {
    cameraAngle = CameraAngle.LOW_ANGLE;
    reason += '，仰视角度表现权威';
  }
  
  return {
    panelId: panel.id,
    shotType,
    cameraAngle,
    reason
  };
}
