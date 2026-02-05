import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Camera, Eye } from 'lucide-react'
import { toast } from 'sonner'

export interface ShotRecommendation {
  panelId: number
  shotType: string
  cameraAngle: string
  reason: string
}

export interface ComicPanel {
  id: number
  sceneDescription: string
  dialogue: string
  shotType?: string
  cameraAngle?: string
}

interface ShotSelectorProps {
  scriptId: string
  panels: ComicPanel[]
  onPanelsUpdate: (panels: ComicPanel[]) => void
}

const SHOT_TYPES = [
  { id: 'wide_shot', name: '远景', description: '展示完整环境', icon: '🏞️' },
  { id: 'full_shot', name: '全景', description: '角色从头到脚', icon: '🧍' },
  { id: 'medium_shot', name: '中景', description: '从腰部往上', icon: '👤' },
  { id: 'close_up', name: '近景', description: '聚焦面部', icon: '😊' },
  { id: 'extreme_close_up', name: '特写', description: '眼睛或细节', icon: '👁️' }
]

const CAMERA_ANGLES = [
  { id: 'eye_level', name: '平视', description: '自然视角', icon: '➡️' },
  { id: 'high_angle', name: '俯视', description: '从上往下', icon: '⬇️' },
  { id: 'low_angle', name: '仰视', description: '从下往上', icon: '⬆️' }
]

export function ShotSelector({ scriptId, panels, onPanelsUpdate }: ShotSelectorProps) {
  const [recommendations, setRecommendations] = useState<ShotRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [editedPanels, setEditedPanels] = useState<ComicPanel[]>(panels)

  // 获取镜头推荐
  useEffect(() => {
    fetchRecommendations()
  }, [scriptId])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/script/${scriptId}/shot-recommendations`)
      if (!response.ok) throw new Error('获取推荐失败')
      
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('获取镜头推荐失败:', error)
    }
  }

  // 应用推荐
  const applyRecommendations = () => {
    const updated = editedPanels.map(panel => {
      const rec = recommendations.find(r => r.panelId === panel.id)
      if (rec) {
        return {
          ...panel,
          shotType: rec.shotType,
          cameraAngle: rec.cameraAngle
        }
      }
      return panel
    })
    setEditedPanels(updated)
    toast.success('已应用AI推荐的镜头序列')
  }

  // 更新单个分格的镜头
  const updatePanelShot = (panelId: number, field: 'shotType' | 'cameraAngle', value: string) => {
    const updated = editedPanels.map(panel =>
      panel.id === panelId ? { ...panel, [field]: value } : panel
    )
    setEditedPanels(updated)
  }

  // 保存镜头设置
  const saveShots = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/script/${scriptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panels: editedPanels.map(p => ({
            id: p.id,
            shotType: p.shotType,
            cameraAngle: p.cameraAngle
          }))
        })
      })

      if (!response.ok) throw new Error('保存失败')

      const data = await response.json()
      onPanelsUpdate(data.script.panels)
      toast.success('镜头设置已保存')
    } catch (error) {
      toast.error('保存失败，请重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI推荐 */}
      {recommendations.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Lightbulb className="w-5 h-5" />
              AI 镜头推荐
            </CardTitle>
            <CardDescription>
              根据故事内容，我们为您推荐了最佳的镜头序列
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={rec.panelId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">第{index + 1}格</Badge>
                    <Badge>{SHOT_TYPES.find(s => s.id === rec.shotType)?.name}</Badge>
                    <Badge variant="secondary">{CAMERA_ANGLES.find(a => a.id === rec.cameraAngle)?.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={applyRecommendations}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              应用推荐
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 镜头选择器 */}
      <div className="grid gap-4">
        {editedPanels.map((panel, index) => (
          <Card key={panel.id}>
            <CardHeader>
              <CardTitle className="text-lg">第 {index + 1} 格镜头设置</CardTitle>
              <CardDescription className="line-clamp-2">
                {panel.sceneDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 景别选择 */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4" />
                  景别（Shot Type）
                </Label>
                <RadioGroup
                  value={panel.shotType || 'medium_shot'}
                  onValueChange={(value) => updatePanelShot(panel.id, 'shotType', value)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {SHOT_TYPES.map(shot => (
                      <div key={shot.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={shot.id} id={`${panel.id}-${shot.id}`} />
                        <Label htmlFor={`${panel.id}-${shot.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{shot.icon}</span>
                            <div>
                              <div className="font-medium">{shot.name}</div>
                              <div className="text-xs text-muted-foreground">{shot.description}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* 角度选择 */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4" />
                  角度（Camera Angle）
                </Label>
                <RadioGroup
                  value={panel.cameraAngle || 'eye_level'}
                  onValueChange={(value) => updatePanelShot(panel.id, 'cameraAngle', value)}
                >
                  <div className="grid grid-cols-3 gap-3">
                    {CAMERA_ANGLES.map(angle => (
                      <div key={angle.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={angle.id} id={`${panel.id}-${angle.id}`} />
                        <Label htmlFor={`${panel.id}-${angle.id}`} className="flex-1 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{angle.icon}</span>
                              <span className="font-medium">{angle.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{angle.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={saveShots}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          {loading ? '保存中...' : '保存镜头设置'}
        </Button>
      </div>
    </div>
  )
}
