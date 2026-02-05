<template>
  <div class="comic-generator">
    <!-- Step 1: 输入创意 -->
    <div v-if="currentStep === 1" class="step-container">
      <div class="input-section">
        <h2>💡 输入你的创意</h2>
        <textarea
          v-model="topic"
          placeholder="例如：一个程序员在修复bug时，意外发现了通往数字世界的入口..."
          rows="4"
          :disabled="loading"
        ></textarea>
        <button @click="generateScript" :disabled="loading || !topic.trim()" class="btn-primary">
          <span v-if="!loading">🚀 生成脚本</span>
          <span v-else>⏳ 正在生成...</span>
        </button>
      </div>
    </div>

    <!-- Step 2: 编辑脚本 -->
    <div v-if="currentStep === 2" class="step-container">
      <div class="script-editor">
        <h2>📝 编辑脚本</h2>
        
        <div class="character-preview" v-if="characterImageUrl">
          <h3>主角设定</h3>
          <img :src="characterImageUrl" alt="角色设定图" />
          <p>{{ script?.characterDescription }}</p>
        </div>

        <div class="panels-editor">
          <h3>四格分镜</h3>
          <div v-for="panel in script?.panels" :key="panel.index" class="panel-edit-card">
            <div class="panel-header">
              <span class="panel-number">第 {{ panel.index }} 格</span>
            </div>
            <div class="panel-content">
              <label>画面描述：</label>
              <textarea v-model="panel.sceneDescription" rows="3"></textarea>
              
              <label>角色对话：</label>
              <input type="text" v-model="panel.dialogue" />
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="currentStep = 1" class="btn-secondary">← 返回修改</button>
          <button @click="generateComic" :disabled="loading" class="btn-primary">
            <span v-if="!loading">🎨 生成漫画</span>
            <span v-else>⏳ 正在绘制...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: 展示结果 -->
    <div v-if="currentStep === 3" class="step-container">
      <div class="result-section">
        <h2>🎉 你的漫画完成了！</h2>
        
        <div class="comic-grid">
          <div v-for="panel in finalPanels" :key="panel.index" class="comic-panel">
            <img :src="panel.imageUrl" :alt="`第${panel.index}格`" />
          </div>
        </div>

        <div class="action-buttons">
          <button @click="reset" class="btn-secondary">🔄 再创作一个</button>
          <button @click="downloadComic" class="btn-primary">💾 下载漫画</button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="error = ''" class="btn-close">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { comicApi } from '@/api/comic'
import type { ComicScript, ComicPanel } from '@/types'

const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

const topic = ref('')
const script = ref<ComicScript | null>(null)
const characterImageUrl = ref('')
const finalPanels = ref<ComicPanel[]>([])

async function generateScript() {
  if (!topic.value.trim()) return

  loading.value = true
  error.value = ''

  try {
    const response = await comicApi.generateScript(topic.value)
    
    if (response.success && response.script) {
      script.value = response.script
      characterImageUrl.value = response.characterImageUrl || ''
      currentStep.value = 2
    } else {
      error.value = response.error || '脚本生成失败'
    }
  } catch (err: any) {
    error.value = err.message || '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

async function generateComic() {
  if (!script.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await comicApi.generateComic(script.value, characterImageUrl.value)
    
    if (response.success && response.panels) {
      finalPanels.value = response.panels
      currentStep.value = 3
    } else {
      error.value = response.error || '漫画生成失败'
    }
  } catch (err: any) {
    error.value = err.message || '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

function reset() {
  currentStep.value = 1
  topic.value = ''
  script.value = null
  characterImageUrl.value = ''
  finalPanels.value = []
  error.value = ''
}

function downloadComic() {
  // 简单实现：打开新窗口显示所有图片
  const urls = finalPanels.value.map(p => p.imageUrl).filter(Boolean)
  urls.forEach((url, index) => {
    setTimeout(() => {
      window.open(url, '_blank')
    }, index * 500)
  })
}
</script>

<style scoped>
.comic-generator {
  position: relative;
}

.step-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* 输入部分 */
.input-section {
  max-width: 700px;
  margin: 0 auto;
}

.input-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* 脚本编辑器 */
.script-editor h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.character-preview {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.character-preview img {
  max-width: 300px;
  border-radius: 8px;
  margin: 1rem 0;
}

.panels-editor h3 {
  margin-bottom: 1rem;
  color: #555;
}

.panel-edit-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.panel-header {
  margin-bottom: 1rem;
}

.panel-number {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1rem;
}

.panel-content label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.panel-content input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

/* 结果展示 */
.result-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.comic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.comic-panel {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comic-panel img {
  width: 100%;
  height: auto;
  display: block;
}

/* 按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

/* 错误提示 */
.error-message {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4444;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .comic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
