import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ThinkingProcess } from './ThinkingProcess';
import { ScoreRadar } from './ScoreRadar';
import { IterationTimeline } from './IterationTimeline';

interface AgentModeProps {
  onComplete?: (result: any) => void;
}

export const AgentMode: React.FC<AgentModeProps> = ({ onComplete }) => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Agent状态
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Agent数据
  const [thought, setThought] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [critique, setCritique] = useState<any>(null);
  const [iterations, setIterations] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!idea.trim()) {
      setError('请输入创意');
      return;
    }

    setLoading(true);
    setError('');
    setTaskId(null);
    setThought(null);
    setScript(null);
    setReview(null);
    setCritique(null);
    setIterations([]);
    setResult(null);

    try {
      // 1. 创建任务
      const response = await fetch('/api/agent/create-comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          maxIterations: 3,
          targetScore: 8.0
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '创建任务失败');
      }

      const newTaskId = data.taskId;
      setTaskId(newTaskId);

      // 2. 使用SSE监听事件
      const eventSource = new EventSource(`/api/agent/events/${newTaskId}`);

      eventSource.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          
          console.log('Agent事件:', event);
          
          switch (event.type) {
            case 'state':
            case 'stateChange':
              setStatus(event.data.status);
              setCurrentStep(event.data.currentStep);
              setProgress(event.data.progress);
              break;
              
            case 'directorThought':
              setThought(event.data);
              break;
              
            case 'directorScriptGenerated':
              setScript(event.data);
              break;
              
            case 'directorReviewed':
              setReview(event.data);
              break;
              
            case 'criticCritiqued':
              setCritique(event.data);
              break;
              
            case 'iterationComplete':
              setIterations(prev => [...prev, event.data]);
              break;
              
            case 'targetReached':
              console.log('达到目标分数！', event.data);
              break;
          }
        } catch (err) {
          console.error('解析事件失败:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('SSE连接错误:', err);
        eventSource.close();
        
        // SSE断开后，轮询获取最终结果
        pollResult(newTaskId);
      };

      // 3. 定时轮询状态（作为SSE的备份）
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/agent/status/${newTaskId}`);
          const statusData = await statusRes.json();
          
          if (statusData.success && statusData.status === 'completed') {
            clearInterval(pollInterval);
            eventSource.close();
            
            setResult(statusData.result);
            setLoading(false);
            
            if (onComplete) {
              onComplete(statusData.result);
            }
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval);
            eventSource.close();
            
            setError(statusData.result?.error || '创作失败');
            setLoading(false);
          }
        } catch (err) {
          console.error('轮询状态失败:', err);
        }
      }, 2000);

      // 5分钟后超时
      setTimeout(() => {
        clearInterval(pollInterval);
        eventSource.close();
        
        if (loading) {
          setError('任务超时');
          setLoading(false);
        }
      }, 5 * 60 * 1000);

    } catch (err) {
      console.error('创建任务失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
      setLoading(false);
    }
  };

  const pollResult = async (taskId: string) => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('获取结果超时');
        setLoading(false);
        return;
      }
      
      attempts++;
      
      try {
        const statusRes = await fetch(`/api/agent/status/${taskId}`);
        const statusData = await statusRes.json();
        
        if (statusData.success && statusData.status === 'completed') {
          setResult(statusData.result);
          setLoading(false);
          
          if (onComplete) {
            onComplete(statusData.result);
          }
        } else if (statusData.status === 'failed') {
          setError(statusData.result?.error || '创作失败');
          setLoading(false);
        } else {
          setTimeout(poll, 2000);
        }
      } catch (err) {
        setTimeout(poll, 2000);
      }
    };
    
    poll();
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI导演+评论家模式
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="输入你的创意，AI导演会逐步思考如何创作..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !idea.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {currentStep || '创作中...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始AI创作
              </>
            )}
          </Button>
          
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{currentStep}</span>
                <Badge variant="outline">{progress}%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 思考过程 */}
      {thought && (
        <ThinkingProcess thought={thought} />
      )}

      {/* 评分 */}
      {critique && (
        <ScoreRadar
          scores={critique.scores}
          previousScore={iterations.length > 1 ? iterations[iterations.length - 2].score : undefined}
        />
      )}

      {/* 迭代历史 */}
      {iterations.length > 0 && (
        <IterationTimeline iterations={iterations} targetScore={8.0} />
      )}

      {/* 最终结果 */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>🎉 创作完成！</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>总分：<span className="font-bold text-lg">{result.critique?.scores.overall.toFixed(1)}</span></p>
              <p>迭代次数：{result.iterations}</p>
              <Button
                onClick={() => onComplete && onComplete(result)}
                className="w-full mt-4"
              >
                查看完整漫画
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
