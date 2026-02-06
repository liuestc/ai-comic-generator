import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Target, User, Camera, Palette } from 'lucide-react';

interface ThoughtProcess {
  coreConflict: {
    protagonist: string;
    goal: string;
    obstacle: string;
    stakes: string;
  };
  structure: {
    type: string;
    reason: string;
    panelCount: number;
  };
  character: {
    name: string;
    personality: string[];
    appearance: string;
    catchphrase: string;
    motivation: string;
    fear: string;
  };
  shotPlanning: Array<{
    panelId: number;
    shotType: string;
    cameraAngle: string;
    reason: string;
    visualFocus: string;
  }>;
  colorScheme: {
    overall: string;
    reason: string;
    mood: string;
  };
}

interface ThinkingProcessProps {
  thought: ThoughtProcess;
}

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ thought }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI导演的思考过程
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 核心冲突 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold">1. 核心冲突分析</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 pl-6">
              <div>
                <span className="text-sm text-gray-500">主角：</span>
                <p className="text-sm font-medium">{thought.coreConflict.protagonist}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">目标：</span>
                <p className="text-sm font-medium">{thought.coreConflict.goal}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">障碍：</span>
                <p className="text-sm font-medium">{thought.coreConflict.obstacle}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">赌注：</span>
                <p className="text-sm font-medium">{thought.coreConflict.stakes}</p>
              </div>
            </div>
          </div>

          {/* 故事结构 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold">2. 故事结构选择</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{thought.structure.type}</Badge>
                <span className="text-sm text-gray-500">共{thought.structure.panelCount}格</span>
              </div>
              <p className="text-sm text-gray-600">{thought.structure.reason}</p>
            </div>
          </div>

          {/* 角色设计 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold">3. 角色设计</h3>
            </div>
            <div className="pl-6 space-y-3">
              <div>
                <span className="text-sm text-gray-500">名字：</span>
                <span className="text-sm font-medium ml-2">{thought.character.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">性格：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {thought.character.personality.map((trait, i) => (
                    <Badge key={i} variant="secondary">{trait}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">外貌：</span>
                <p className="text-sm mt-1">{thought.character.appearance}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-gray-500">动机：</span>
                  <p className="text-sm">{thought.character.motivation}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">恐惧：</span>
                  <p className="text-sm">{thought.character.fear}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 镜头规划 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold">4. 镜头语言规划</h3>
            </div>
            <div className="pl-6 space-y-2">
              {thought.shotPlanning.map((shot) => (
                <div key={shot.panelId} className="border-l-2 border-orange-200 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">第{shot.panelId}格</span>
                    <Badge variant="outline" className="text-xs">
                      {shot.shotType} + {shot.cameraAngle}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{shot.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    视觉重点：{shot.visualFocus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 色彩基调 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-pink-500" />
              <h3 className="font-semibold">5. 色彩基调</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{thought.colorScheme.overall}</Badge>
                <span className="text-sm text-gray-500">情绪：{thought.colorScheme.mood}</span>
              </div>
              <p className="text-sm text-gray-600">{thought.colorScheme.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
