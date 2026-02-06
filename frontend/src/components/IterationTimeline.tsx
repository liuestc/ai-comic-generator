import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

interface Iteration {
  iteration: number;
  score: number;
  improvements: string[];
}

interface IterationTimelineProps {
  iterations: Iteration[];
  targetScore: number;
}

export const IterationTimeline: React.FC<IterationTimelineProps> = ({
  iterations,
  targetScore
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          迭代优化历史
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {iterations.map((iter, index) => {
            const isLast = index === iterations.length - 1;
            const reachedTarget = iter.score >= targetScore;
            
            return (
              <div key={iter.iteration} className="relative">
                {/* 连接线 */}
                {!isLast && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                <div className="flex gap-4">
                  {/* 图标 */}
                  <div className="flex-shrink-0">
                    {reachedTarget ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">第{iter.iteration}次迭代</span>
                      <Badge variant={reachedTarget ? 'default' : 'secondary'}>
                        {iter.score.toFixed(1)}分
                      </Badge>
                      {reachedTarget && (
                        <Badge variant="default" className="bg-green-500">
                          ✓ 达标
                        </Badge>
                      )}
                    </div>
                    
                    {iter.improvements.length > 0 && (
                      <div className="space-y-1">
                        {iter.improvements.map((improvement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-green-500 text-xs mt-0.5">✓</span>
                            <span className="text-sm text-gray-600">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
