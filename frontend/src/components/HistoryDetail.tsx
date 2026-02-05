import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react';

interface ComicPanel {
  id: number;
  scene: string;
  dialogue: string;
  shotType: string;
  cameraAngle: string;
  imageUrl?: string;
  bubbleImageUrl?: string;
}

interface ComicScript {
  id: string;
  topic: string;
  characterDesign: string;
  characterImageUrl?: string;
  status: string;
  panels: ComicPanel[];
  createdAt: string;
  updatedAt: string;
}

interface HistoryDetailProps {
  comicId: string;
  onBack: () => void;
  onEdit: (script: ComicScript) => void;
}

export const HistoryDetail: React.FC<HistoryDetailProps> = ({
  comicId,
  onBack,
  onEdit,
}) => {
  const [comic, setComic] = useState<ComicScript | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载漫画详情
  useEffect(() => {
    const loadComic = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/history/${comicId}`);
        const data = await response.json();

        if (data.success) {
          setComic(data.data);
        }
      } catch (error) {
        console.error('加载漫画详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComic();
  }, [comicId]);

  // 删除漫画
  const handleDelete = async () => {
    if (!confirm('确定要删除这个漫画吗？')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/history/${comicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onBack();
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取镜头描述
  const getShotDescription = (shotType: string, cameraAngle: string) => {
    const shotTypes: Record<string, string> = {
      extreme_long: '极远景',
      long: '远景',
      medium: '中景',
      close_up: '近景',
      extreme_close_up: '特写',
    };

    const angles: Record<string, string> = {
      eye_level: '平视',
      high_angle: '俯视',
      low_angle: '仰视',
    };

    return `${shotTypes[shotType] || shotType} + ${angles[cameraAngle] || cameraAngle}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">漫画未找到</p>
        <Button onClick={onBack} className="mt-4">
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h2 className="text-3xl font-bold">漫画详情</h2>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(comic)}>
            <Edit className="h-4 w-4 mr-2" />
            重新编辑
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">创意主题</label>
            <p className="mt-1">{comic.topic}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">创建时间</label>
              <p className="mt-1">{formatDate(comic.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">更新时间</label>
              <p className="mt-1">{formatDate(comic.updatedAt)}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">状态</label>
            <div className="mt-1">
              <Badge>
                {comic.status === 'completed' ? '已完成' : comic.status === 'draft' ? '草稿' : '生成中'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 角色设定 */}
      <Card>
        <CardHeader>
          <CardTitle>角色设定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">角色描述</label>
            <p className="mt-1 text-sm">{comic.characterDesign}</p>
          </div>

          {comic.characterImageUrl && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">角色设定图</label>
              <div className="mt-2">
                <img
                  src={`http://localhost:3000${comic.characterImageUrl}`}
                  alt="角色设定"
                  className="w-64 h-64 object-cover rounded-lg border"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分格展示 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">分格内容</h3>

        {comic.panels.map((panel) => (
          <Card key={panel.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>第 {panel.id} 格</span>
                <Badge variant="outline">
                  {getShotDescription(panel.shotType, panel.cameraAngle)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 图片 */}
              {panel.bubbleImageUrl || panel.imageUrl ? (
                <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={`http://localhost:3000${panel.bubbleImageUrl || panel.imageUrl}`}
                    alt={`第 ${panel.id} 格`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                </div>
              )}

              {/* 场景描述 */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">场景描述</label>
                <p className="mt-1 text-sm">{panel.scene}</p>
              </div>

              {/* 对话 */}
              {panel.dialogue && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">对话</label>
                  <p className="mt-1 text-sm">{panel.dialogue}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 完整漫画展示（2x2网格） */}
      {comic.status === 'completed' && comic.panels.every(p => p.bubbleImageUrl || p.imageUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>完整漫画</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {comic.panels.map((panel) => (
                <div key={panel.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={`http://localhost:3000${panel.bubbleImageUrl || panel.imageUrl}`}
                    alt={`第 ${panel.id} 格`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
