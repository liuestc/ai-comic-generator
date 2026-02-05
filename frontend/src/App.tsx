import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Sparkles, Image as ImageIcon, Download, Edit2, Wand2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Panel {
  scene: string
  dialogue: string
  imageUrl?: string
}

interface ComicScript {
  title: string
  characterDescription: string
  characterImageUrl?: string
  panels: Panel[]
}

function App() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<ComicScript | null>(null)
  const [generatingImages, setGeneratingImages] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'script' | 'comic'>('input')

  const generateScript = async () => {
    if (!topic.trim()) {
      toast.error('请输入一个创意想法')
      return
    }

    setLoading(true)
    setCurrentStep('script')
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      if (!response.ok) throw new Error('生成失败')

      const data = await response.json()
      setScript(data.script)
      toast.success('脚本生成成功！')
    } catch (error) {
      toast.error('生成失败，请重试')
      console.error(error)
      setCurrentStep('input')
    } finally {
      setLoading(false)
    }
  }

  const generateComic = async () => {
    if (!script) return

    setGeneratingImages(true)
    
    try {
      const response = await fetch('/api/generate-comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
      })

      if (!response.ok) throw new Error('生成失败')

      const data = await response.json()
      setScript(data.comic)
      setCurrentStep('comic')
      toast.success('漫画生成成功！')
    } catch (error) {
      toast.error('生成失败，请重试')
      console.error(error)
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
                  AI 漫剧生成器
                </h1>
                <p className="text-sm text-gray-500">一句话创意，四格漫画</p>
              </div>
            </div>
            {currentStep !== 'input' && (
              <Button variant="outline" onClick={resetApp}>
                <Edit2 className="w-4 h-4 mr-2" />
                新建漫画
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">💡 创意示例</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {[
                    '一个程序员在修复 bug 时，意外发现了通往数字世界的入口',
                    '一只猫咪学会了使用电脑，开始给主人发邮件',
                    '一个咖啡杯突然有了生命，开始在办公室里冒险',
                    '一个设计师的灵感精灵罢工了，他必须想办法哄它回来'
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setTopic(example)}
                      className="text-left text-sm p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Script Review */}
        {currentStep === 'script' && script && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{script.title}</CardTitle>
                    <CardDescription>查看并编辑脚本，然后生成漫画</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    脚本已生成
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Character */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    角色设定
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{script.characterDescription}</p>
                  </div>
                </div>

                <Separator />

                {/* Panels */}
                <div className="space-y-4">
                  <h3 className="font-semibold">四格分镜</h3>
                  <div className="grid gap-4">
                    {script.panels.map((panel, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-sm">第 {index + 1} 格</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <Label className="text-xs text-gray-500">场景描述</Label>
                            <p className="text-sm mt-1">{panel.scene}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">对话</Label>
                            <p className="text-sm mt-1 font-medium">"{panel.dialogue}"</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateComic} 
                  disabled={generatingImages}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  size="lg"
                >
                  {generatingImages ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI 正在绘制漫画...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      生成四格漫画
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Comic Result */}
        {currentStep === 'comic' && script && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{script.title}</CardTitle>
                    <CardDescription>你的专属 AI 漫画已生成</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadComic}>
                      <Download className="w-4 h-4 mr-2" />
                      下载漫画
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comic">四格漫画</TabsTrigger>
                    <TabsTrigger value="character">角色设定</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comic" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      {script.panels.map((panel, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                              <CardContent className="p-0">
                                {panel.imageUrl ? (
                                  <img 
                                    src={panel.imageUrl} 
                                    alt={`第 ${index + 1} 格`}
                                    className="w-full aspect-square object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>第 {index + 1} 格</DialogTitle>
                              <DialogDescription>{panel.dialogue}</DialogDescription>
                            </DialogHeader>
                            {panel.imageUrl && (
                              <img 
                                src={panel.imageUrl} 
                                alt={`第 ${index + 1} 格`}
                                className="w-full rounded-lg"
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="character" className="space-y-4 mt-6">
                    <Card>
                      <CardContent className="p-6">
                        {script.characterImageUrl ? (
                          <div className="space-y-4">
                            <img 
                              src={script.characterImageUrl} 
                              alt="角色设定"
                              className="w-full max-w-2xl mx-auto rounded-lg"
                            />
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{script.characterDescription}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>由 Google Nano Banana Pro 驱动 · 一句话创意，四格漫画</p>
        </div>
      </footer>
    </div>
  )
}

export default App
