import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Edit2, Wand2, Camera, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { ScriptEditor, ComicScript as ScriptEditorScript } from '@/components/ScriptEditor'
import { ShotSelector } from '@/components/ShotSelector'
import { HistoryList } from '@/components/HistoryList'
import { HistoryDetail } from '@/components/HistoryDetail'
import { InspirationLibrary } from '@/components/InspirationLibrary'
import { AgentMode } from '@/components/AgentMode'

function App() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<ScriptEditorScript | null>(null)
  const [generatingImages, setGeneratingImages] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'edit' | 'shot' | 'comic'>('input')
  const [currentView, setCurrentView] = useState<'create' | 'history' | 'detail' | 'agent'>('create')
  const [selectedComicId, setSelectedComicId] = useState<string | null>(null)

  const generateScript = async () => {
    if (!topic.trim()) {
      toast.error('请输入一个创意想法')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      if (!response.ok) throw new Error('生成失败')

      const data = await response.json()
      setScript(data.script)
      setCurrentStep('edit')
      toast.success('脚本生成成功！')
    } catch (error) {
      toast.error('生成失败，请重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleScriptUpdate = (updatedScript: ScriptEditorScript) => {
    setScript(updatedScript)
  }

  const goToShotSelection = () => {
    setCurrentStep('shot')
  }

  const handlePanelsUpdate = (panels: any[]) => {
    if (script) {
      setScript({
        ...script,
        panels
      })
    }
  }

  const generateComic = async () => {
    if (!script) return

    setGeneratingImages(true)
    setCurrentStep('comic')
    
    try {
      const response = await fetch('/api/generate-comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
      })

      if (!response.ok) throw new Error('生成失败')

      const data = await response.json()
      setScript(data.script)
      toast.success('漫画生成成功！')
    } catch (error) {
      toast.error('生成失败，请重试')
      console.error(error)
      setCurrentStep('shot')
    } finally {
      setGeneratingImages(false)
    }
  }

  const downloadComic = () => {
    toast.success('下载功能开发中...')
  }

  const resetApp = () => {
    setTopic('')
    setScript(null)
    setCurrentStep('input')
    setCurrentView('create')
    setSelectedComicId(null)
  }

  const handleSelectComic = (comicId: string) => {
    setSelectedComicId(comicId)
    setCurrentView('detail')
  }

  const handleEditComic = (comicScript: any) => {
    setScript(comicScript)
    setCurrentStep('edit')
    setCurrentView('create')
  }

  const handleBackToHistory = () => {
    setCurrentView('history')
    setSelectedComicId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  AI 漫剧生成器 Pro
                </h1>
                <p className="text-sm text-gray-500">专业编剧 + 分镜师工具</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={currentView === 'detail' ? 'history' : currentView} onValueChange={(v) => setCurrentView(v as any)}>
                <TabsList>
                  <TabsTrigger value="create">快速生成</TabsTrigger>
                  <TabsTrigger value="agent">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI智能体
                  </TabsTrigger>
                  <TabsTrigger value="history">历史记录</TabsTrigger>
                </TabsList>
              </Tabs>
              {currentStep !== 'input' && currentView === 'create' && (
                <Button variant="outline" onClick={resetApp}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  新建漫画
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Agent Mode View */}
        {currentView === 'agent' && (
          <div className="max-w-4xl mx-auto">
            <AgentMode
              onComplete={(result) => {
                // 处理完成后的结果
                if (result?.script) {
                  setScript(result.script);
                  setCurrentStep('comic');
                  toast.success('🎉 AI智能体创作完成！');
                }
              }}
            />
          </div>
        )}

        {/* History List View */}
        {currentView === 'history' && (
          <HistoryList onSelectComic={handleSelectComic} />
        )}

        {/* History Detail View */}
        {currentView === 'detail' && selectedComicId && (
          <HistoryDetail
            comicId={selectedComicId}
            onBack={handleBackToHistory}
            onEdit={handleEditComic}
          />
        )}

        {/* Create View */}
        {currentView === 'create' && (
          <>
            {/* Step 1: Input */}
            {currentStep === 'input' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  输入你的创意
                </CardTitle>
                <CardDescription>
                  描述一个简单的想法，AI 将为你创作专属四格漫画
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">创意主题</Label>
                  <Textarea
                    id="topic"
                    placeholder="例如：一只猫咪学会了使用电脑，开始给主人发邮件..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <Button 
                  onClick={generateScript} 
                  disabled={loading || !topic.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI 正在创作脚本...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      生成漫画脚本
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 灵感库 */}
            <InspirationLibrary onSelect={(inspiration) => {
              setTopic(inspiration.description);
              toast.success(`已选择创意：${inspiration.title}`);
            }} />

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-2">✏️</div>
                  <div className="font-medium text-sm">脚本编辑</div>
                  <div className="text-xs text-muted-foreground mt-1">自由修改场景和对话</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="font-medium text-sm">镜头语言</div>
                  <div className="text-xs text-muted-foreground mt-1">专业的景别和角度</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-medium text-sm">AI 推荐</div>
                  <div className="text-xs text-muted-foreground mt-1">智能镜头序列建议</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Script Editing */}
        {currentStep === 'edit' && script && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">编辑脚本</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  查看并修改场景和对话，然后选择镜头
                </p>
              </div>
              <Badge variant="secondary">步骤 1/3</Badge>
            </div>

            <ScriptEditor 
              script={script}
              onScriptUpdate={handleScriptUpdate}
              onGenerateComic={goToShotSelection}
            />
          </div>
        )}

        {/* Step 3: Shot Selection */}
        {currentStep === 'shot' && script && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  选择镜头
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  为每一格选择最合适的景别和角度
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">步骤 2/3</Badge>
                <Button variant="outline" onClick={() => setCurrentStep('edit')}>
                  返回编辑
                </Button>
              </div>
            </div>

            <ShotSelector 
              scriptId={script.id}
              panels={script.panels}
              onPanelsUpdate={handlePanelsUpdate}
            />

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={generateComic}
                disabled={generatingImages}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {generatingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI 正在绘制漫画...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    生成完整漫画
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Comic Result */}
        {currentStep === 'comic' && script && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{script.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  你的专属 AI 漫画已生成
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">步骤 3/3</Badge>
                <Button variant="outline" onClick={downloadComic}>
                  <Download className="w-4 h-4 mr-2" />
                  下载漫画
                </Button>
              </div>
            </div>

            <Tabs defaultValue="comic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comic">四格漫画</TabsTrigger>
                <TabsTrigger value="character">角色设定</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comic" className="space-y-4 mt-6">
                {generatingImages ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
                    <p className="text-lg font-medium">AI 正在绘制你的专属漫画...</p>
                    <p className="text-sm text-muted-foreground mt-2">这可能需要 30-60 秒</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {script.panels.map((panel, index) => (
                      <Dialog key={panel.id}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span>第 {index + 1} 格</span>
                              <div className="flex gap-1">
                                {panel.shotType && (
                                  <Badge variant="outline" className="text-xs">
                                    {panel.shotType}
                                  </Badge>
                                )}
                                {panel.cameraAngle && (
                                  <Badge variant="secondary" className="text-xs">
                                    {panel.cameraAngle}
                                  </Badge>
                                )}
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            {panel.bubbleImageUrl ? (
                              <img 
                                src={panel.bubbleImageUrl} 
                                alt={`第${index + 1}格`}
                                className="w-full aspect-square object-cover"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        <DialogContent className="max-w-3xl">
                          {panel.bubbleImageUrl && (
                            <img 
                              src={panel.bubbleImageUrl} 
                              alt={`第${index + 1}格`}
                              className="w-full rounded-lg"
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="character" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>角色设定</CardTitle>
                    <CardDescription>{script.characterDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {script.characterImageUrl && (
                      <img 
                        src={script.characterImageUrl} 
                        alt="角色设定" 
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 text-center text-sm text-gray-500">
        <p>AI 漫剧生成器 Pro - 专业编剧与分镜师工具</p>
        <p className="mt-1">Powered by Google Nano Banana Pro</p>
      </footer>
    </div>
  )
}

export default App
