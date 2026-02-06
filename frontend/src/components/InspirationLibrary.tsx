import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sparkles, Shuffle } from 'lucide-react';

interface Inspiration {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  structure: {
    type: string;
    acts: Array<{
      name: string;
      panelId: number;
      function: string;
      emotionIntensity: number;
    }>;
  };
  emotionCurve: number[];
  shotDesigns: Array<{
    panelId: number;
    shotType: string;
    cameraAngle: string;
    composition: string;
    visualFocus: string;
    designReason: string;
    visualEffects?: string;
  }>;
  dialogueDesigns: Array<{
    panelId: number;
    dialogue: string;
    technique: string;
    characterVoice: string;
    subtext: string;
  }>;
  colorSchemes: Array<{
    panelId: number;
    mainColor: string;
    mood: string;
    lighting: string;
  }>;
  character: {
    name: string;
    occupation: string;
    appearance: string;
    personality: string;
    catchphrase: string;
    deepDesire: string;
    greatestFear: string;
  };
  tags: {
    theme: string[];
    emotion: string[];
    visual: string[];
    technique: string[];
    audience: string[];
  };
  tested: boolean;
  testResult?: string;
}

interface InspirationLibraryProps {
  onSelect: (inspiration: Inspiration) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: '全部',
  funny: '🎭 日常搞笑',
  scifi: '🚀 科幻冒险',
  healing: '💕 温馨治愈',
  game: '🎮 游戏梗',
  pet: '🐱 萌宠日常',
  work: '💼 职场吐槽',
  romance: '💑 浪漫爱情',
  mystery: '🔍 悬疑推理'
};

const DIFFICULTY_STARS = ['⭐☆☆☆☆', '⭐⭐☆☆☆', '⭐⭐⭐☆☆', '⭐⭐⭐⭐☆', '⭐⭐⭐⭐⭐'];

export const InspirationLibrary: React.FC<InspirationLibraryProps> = ({ onSelect }) => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspirations();
  }, [selectedCategory]);

  const fetchInspirations = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await fetch(`/api/inspirations${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInspirations(data.data.inspirations);
      }
    } catch (error) {
      console.error('Error fetching inspirations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPick = async () => {
    try {
      const response = await fetch('/api/inspirations/random/one');
      const data = await response.json();
      
      if (data.success) {
        onSelect(data.data);
      }
    } catch (error) {
      console.error('Error getting random inspiration:', error);
    }
  };

  const handleViewDetails = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration);
    setShowDetails(true);
  };

  const handleUse = (inspiration: Inspiration) => {
    onSelect(inspiration);
  };

  return (
    <div className="w-full space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold">创意灵感库</h2>
          <Badge variant="secondary">{inspirations.length} 个创意</Badge>
        </div>
        <Button onClick={handleRandomPick} variant="outline" size="sm">
          <Shuffle className="w-4 h-4 mr-2" />
          随机推荐
        </Button>
      </div>

      {/* 分类标签 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 创意卡片网格 */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          加载中...
        </div>
      ) : inspirations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          暂无创意
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspirations.map((inspiration) => (
            <Card key={inspiration.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs truncate flex-shrink-0">
                    {CATEGORY_LABELS[inspiration.category]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {DIFFICULTY_STARS[inspiration.difficulty - 1]}
                  </Badge>
                </div>
                {inspiration.tested && (
                  <Badge variant="default" className="bg-green-500 text-xs w-fit">
                    ✓ 已测试
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-3 flex-1 overflow-hidden">
                <h3 className="font-bold text-lg truncate" title={inspiration.title}>
                  {inspiration.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {inspiration.description}
                </p>

                {/* 专业标签 */}
                <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                  {inspiration.tags.theme.slice(0, 2).map((tag, index) => (
                    <Badge key={`theme-${index}`} variant="outline" className="text-xs truncate max-w-[80px]" title={tag}>
                      {tag}
                    </Badge>
                  ))}
                  {inspiration.tags.emotion.slice(0, 2).map((tag, index) => (
                    <Badge key={`emotion-${index}`} variant="secondary" className="text-xs truncate max-w-[80px]" title={tag}>
                      {tag}
                    </Badge>
                  ))}
                  {inspiration.tags.visual.slice(0, 1).map((tag, index) => (
                    <Badge key={`visual-${index}`} variant="default" className="text-xs truncate max-w-[80px]" title={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* 情感曲线预览 */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">情感曲线：</p>
                  <div className="flex items-end gap-1 h-8">
                    {inspiration.emotionCurve.map((intensity, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t transition-all ${
                          intensity >= 8
                            ? 'bg-red-500'
                            : intensity >= 6
                            ? 'bg-purple-400'
                            : intensity >= 4
                            ? 'bg-blue-400'
                            : 'bg-blue-300'
                        }`}
                        style={{ height: `${(intensity / 10) * 100}%` }}
                        title={`第${index + 1}格: 强度${intensity}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-3 mt-auto">
                <Button
                  onClick={() => handleUse(inspiration)}
                  className="flex-1"
                  size="sm"
                >
                  使用这个创意 →
                </Button>
                <Button
                  onClick={() => handleViewDetails(inspiration)}
                  variant="outline"
                  size="sm"
                >
                  查看详情
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedInspiration && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedInspiration.title} - 创意详情
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="structure">故事结构</TabsTrigger>
                <TabsTrigger value="shots">分镜设计</TabsTrigger>
                <TabsTrigger value="character">角色设定</TabsTrigger>
                <TabsTrigger value="dialogue">对话设计</TabsTrigger>
                <TabsTrigger value="color">色彩方案</TabsTrigger>
              </TabsList>

              {/* 故事结构 */}
              <TabsContent value="structure" className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">故事结构：{selectedInspiration.structure.type === 'kishotenketsu' ? '起承转合' : selectedInspiration.structure.type}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedInspiration.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedInspiration.structure.acts.map((act, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm">第{act.panelId}格 - {act.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs">{act.function}</p>
                        <Badge variant="secondary">情感强度: {act.emotionIntensity}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 分镜设计 */}
              <TabsContent value="shots" className="space-y-4">
                <h3 className="font-bold">分镜设计</h3>
                <div className="space-y-4">
                  {selectedInspiration.shotDesigns.map((shot, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          第{shot.panelId}格 - {shot.shotType} + {shot.cameraAngle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p><strong>设计理由：</strong>{shot.designReason}</p>
                        <p><strong>视觉重点：</strong>{shot.visualFocus}</p>
                        <p><strong>构图法则：</strong>{shot.composition}</p>
                        {shot.visualEffects && (
                          <p><strong>视觉特效：</strong>{shot.visualEffects}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 角色设定 */}
              <TabsContent value="character" className="space-y-4">
                <h3 className="font-bold">角色设定</h3>
                <Card>
                  <CardContent className="pt-6 space-y-2 text-sm">
                    <p><strong>姓名：</strong>{selectedInspiration.character.name}</p>
                    <p><strong>职业：</strong>{selectedInspiration.character.occupation}</p>
                    <p><strong>外观：</strong>{selectedInspiration.character.appearance}</p>
                    <p><strong>性格：</strong>{selectedInspiration.character.personality}</p>
                    <p><strong>口头禅：</strong>"{selectedInspiration.character.catchphrase}"</p>
                    <p><strong>深层欲望：</strong>{selectedInspiration.character.deepDesire}</p>
                    <p><strong>最大恐惧：</strong>{selectedInspiration.character.greatestFear}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 对话设计 */}
              <TabsContent value="dialogue" className="space-y-4">
                <h3 className="font-bold">对话设计</h3>
                <div className="space-y-4">
                  {selectedInspiration.dialogueDesigns.map((dialogue, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-2">
                        <p className="font-bold text-lg">"{dialogue.dialogue}"</p>
                        <p className="text-sm text-muted-foreground">
                          <strong>写作技巧：</strong>{dialogue.technique}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>角色声音：</strong>{dialogue.characterVoice}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>潜台词：</strong>{dialogue.subtext}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 色彩方案 */}
              <TabsContent value="color" className="space-y-4">
                <h3 className="font-bold">色彩方案</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedInspiration.colorSchemes.map((color, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm">第{color.panelId}格</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p><strong>主色调：</strong>{color.mainColor}</p>
                        <p><strong>情绪：</strong>{color.mood}</p>
                        <p><strong>光影：</strong>{color.lighting}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button onClick={() => {
                handleUse(selectedInspiration);
                setShowDetails(false);
              }}>
                使用这个创意（包含所有设定）
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
