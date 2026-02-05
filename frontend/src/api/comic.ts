import axios from 'axios'
import type { GenerateScriptResponse, GenerateComicResponse, ComicScript } from '@/types'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2分钟超时
})

export const comicApi = {
  /**
   * 生成漫画脚本
   */
  async generateScript(topic: string): Promise<GenerateScriptResponse> {
    const response = await apiClient.post<GenerateScriptResponse>('/generate-script', {
      topic,
    })
    return response.data
  },

  /**
   * 生成完整漫画
   */
  async generateComic(
    script: ComicScript,
    characterImageUrl?: string
  ): Promise<GenerateComicResponse> {
    const response = await apiClient.post<GenerateComicResponse>('/generate-comic', {
      script,
      characterImageUrl,
    })
    return response.data
  },

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health')
    return response.data
  },
}
