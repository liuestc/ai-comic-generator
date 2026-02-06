import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface Scores {
  characterConsistency: number;
  shotLanguage: number;
  emotionalImpact: number;
  dialogueQuality: number;
  visualImpact: number;
  overall: number;
}

interface ScoreRadarProps {
  scores: Scores;
  previousScore?: number;
}

export const ScoreRadar: React.FC<ScoreRadarProps> = ({ scores, previousScore }) => {
  const dimensions = [
    { key: 'characterConsistency', label: '角色一致性', color: 'bg-blue-500' },
    { key: 'shotLanguage', label: '镜头语言', color: 'bg-green-500' },
    { key: 'emotionalImpact', label: '情感冲击', color: 'bg-purple-500' },
    { key: 'dialogueQuality', label: '对话质量', color: 'bg-orange-500' },
    { key: 'visualImpact', label: '视觉冲击', color: 'bg-pink-500' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return '优秀';
    if (score >= 8) return '良好';
    if (score >= 7) return '中等';
    return '需改进';
  };

  const scoreDiff = previousScore ? scores.overall - previousScore : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            AI评论家的评分
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}>
              {scores.overall.toFixed(1)}
            </span>
            <Badge variant={scores.overall >= 8 ? 'default' : 'secondary'}>
              {getScoreLabel(scores.overall)}
            </Badge>
            {previousScore && scoreDiff !== 0 && (
              <div className="flex items-center gap-1 text-sm">
                {scoreDiff > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">+{scoreDiff.toFixed(1)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">{scoreDiff.toFixed(1)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dimensions.map(({ key, label, color }) => {
          const score = scores[key as keyof Omit<Scores, 'overall'>];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getScoreLabel(score)}
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
