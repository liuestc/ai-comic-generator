import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Eye, Search } from 'lucide-react';

interface ComicHistoryItem {
  id: string;
  topic: string;
  characterImageUrl?: string;
  status: 'draft' | 'generating' | 'completed';
  createdAt: string;
  panelCount: number;
}

interface HistoryListProps {
  onSelectComic: (comicId: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onSelectComic }) => {
  const [comics, setComics] = useState<ComicHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 加载历史记录
  const loadHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`http://localhost:3000/api/history?${params}`);
      const data = await response.json();

      if (data.success) {
        setComics(data.data.comics);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除漫画
  const deleteComic = async (comicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('确定要删除这个漫画吗？')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/history/${comicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 重新加载列表
        loadHistory();
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 初始加载和筛选变化时重新加载
  useEffect(() => {
    loadHistory();
  }, [page, statusFilter]);

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

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: '草稿', variant: 'secondary' },
      generating: { label: '生成中', variant: 'outline' },
      completed: { label: '已完成', variant: 'default' },
    };

    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // 筛选漫画
  const filteredComics = comics.filter(comic =>
    comic.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">历史记录</h2>
        <div className="flex items-center gap-4">
          {/* 搜索框 */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索漫画..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* 筛选按钮 */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          全部
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('completed')}
        >
          已完成
        </Button>
        <Button
          variant={statusFilter === 'draft' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('draft')}
        >
          草稿
        </Button>
      </div>

      {/* 漫画网格 */}
      {filteredComics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">暂无历史记录</p>
          <p className="text-sm text-muted-foreground mt-2">
            生成你的第一个漫画吧！
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComics.map((comic) => (
            <Card
              key={comic.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectComic(comic.id)}
            >
              <CardHeader className="p-4">
                {/* 缩略图 */}
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                  {comic.characterImageUrl ? (
                    <img
                      src={`http://localhost:3000${comic.characterImageUrl}`}
                      alt={comic.topic}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                </div>

                {/* 标题 */}
                <CardTitle className="text-base line-clamp-2">
                  {comic.topic}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                {/* 状态和分格数 */}
                <div className="flex items-center justify-between text-sm">
                  {getStatusBadge(comic.status)}
                  <span className="text-muted-foreground">
                    {comic.panelCount} 格
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                {/* 时间 */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(comic.createdAt)}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComic(comic.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => deleteComic(comic.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {page} / {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
};
