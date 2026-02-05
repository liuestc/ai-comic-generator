import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Edit2, Check, X, RefreshCw, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export interface ComicPanel {
  id: number
  sceneDescription: string
  dialogue: string
  imageUrl?: string
  bubbleImageUrl?: string
  shotType?: string
  cameraAngle?: string
  designReason?: string  // 新增：设计理由
  visualFocus?: string   // 新增：视觉重点
}

export interface ComicScript {
  id: string
  topic: string
  title: string
  characterDescription: string
  characterImageUrl?: string
  panels: ComicPanel[]
  status: string
}

interface ScriptEditorProps {
  script: ComicScript
  onScriptUpdate: (script: ComicScript) => void
  onGenerateComic: () => void
}

export function ScriptEditor({ script, onScriptUpdate, onGenerateComic }: ScriptEditorProps) {
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null)
  const [editedPanel, setEditedPanel] = useState<ComicPanel | null>(null)
  const [regenerating, setRegenerating] = useState<number | null>(null)

  // 开始编辑分格
  const startEditing = (panel: ComicPanel) => {
    setEditingPanelId(panel.id)
    setEditedPanel({ ...panel })
  }

  // 取消编辑
  const cancelEditing = () => {
    setEditingPanelId(null)
    setEditedPanel(null)
  }

  // 保存编辑
  const saveEditing = async () => {
    if (!editedPanel) return

    try {
      const response = await fetch(`/api/script/${script.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panels: [editedPanel]
        })
      })

      if (!response.ok) throw new Error('更新失败')

      const data = await response.json()
      onScriptUpdate(data.script)
      toast.success('分格已更新')
      
      setEditingPanelId(null)
      setEditedPanel(null)
    } catch (error) {
      toast.error('更新失败，请重试')
      console.error(error)
    }
  }

  // 重新生成分格
  const regeneratePanel = async (panelId: number) => {
    setRegenerating(panelId)

    try {
      const response = await fetch(`/api/script/${script.id}/panel/${panelId}/regenerate`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('重新生成失败')

      const data = await response.json()
      
      // 更新脚本中的分格
      const updatedScript = {
        ...script,
        panels: script.panels.map(p => 
          p.id === panelId ? data.panel : p
        )
      }
      
      onScriptUpdate(updatedScript)
      toast.success('分格已重新生成')
    } catch (error) {
      toast.error('重新生成失败，请重试')
      console.error(error)
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 标题和角色描述 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            {script.title}
          </CardTitle>
          <CardDescription>
            {script.characterDescription}
          </CardDescription>
        </CardHeader>
        {script.characterImageUrl && (
          <CardContent>
            <img 
              src={script.characterImageUrl} 
              alt="角色设定" 
              className="w-full max-w-md rounded-lg shadow-lg mx-auto"
            />
          </CardContent>
        )}
      </Card>

      {/* 分格编辑器 */}
      <div className="grid gap-4">
        {script.panels.map((panel, index) => {
          const isEditing = editingPanelId === panel.id
          const currentPanel = isEditing && editedPanel ? editedPanel : panel

          return (
            <Card key={panel.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    第 {index + 1} 格
                    {panel.shotType && (
                      <Badge variant="outline" className="ml-2">
                        {panel.shotType}
                      </Badge>
                    )}
                    {panel.cameraAngle && (
                      <Badge variant="outline" className="ml-1">
                        {panel.cameraAngle}
                      </Badge>
                    )}
                  </CardTitle>
                  
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(panel)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          编辑
                        </Button>
                        {panel.imageUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regeneratePanel(panel.id)}
                            disabled={regenerating === panel.id}
                          >
                            {regenerating === panel.id ? (
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4 mr-1" />
                            )}
                            重新生成
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={saveEditing}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          保存
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="w-4 h-4 mr-1" />
                          取消
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 场景描述 */}
                <div>
                  <Label htmlFor={`scene-${panel.id}`}>场景描述</Label>
                  {isEditing ? (
                    <Textarea
                      id={`scene-${panel.id}`}
                      value={currentPanel.sceneDescription}
                      onChange={(e) => setEditedPanel({
                        ...currentPanel,
                        sceneDescription: e.target.value
                      })}
                      rows={3}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {currentPanel.sceneDescription}
                    </p>
                  )}
                </div>

                {/* 新增：分镜设计理由 */}
                {(panel.designReason || panel.visualFocus) && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1 text-sm">
                        {panel.designReason && (
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>设计理由：</strong>{panel.designReason}
                          </p>
                        )}
                        {panel.visualFocus && (
                          <p className="text-blue-600 dark:text-blue-400">
                            <strong>视觉重点：</strong>{panel.visualFocus}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* 对话 */}
                <div>
                  <Label htmlFor={`dialogue-${panel.id}`}>对话</Label>
                  {isEditing ? (
                    <Textarea
                      id={`dialogue-${panel.id}`}
                      value={currentPanel.dialogue}
                      onChange={(e) => setEditedPanel({
                        ...currentPanel,
                        dialogue: e.target.value
                      })}
                      rows={2}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-sm font-medium">
                      "{currentPanel.dialogue}"
                    </p>
                  )}
                </div>

                {/* 生成的图片 */}
                {panel.bubbleImageUrl && (
                  <div className="mt-4">
                    <img 
                      src={panel.bubbleImageUrl} 
                      alt={`第${index + 1}格`}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 生成漫画按钮 */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onGenerateComic}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          生成完整漫画
        </Button>
      </div>
    </div>
  )
}
