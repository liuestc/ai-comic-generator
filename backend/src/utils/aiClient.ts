import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { config } from './config';
import { logger } from './logger';

/**
 * AI 客户端工具类
 * 支持 OpenAI 和 Google Gemini
 */

export class AIClient {
  private openaiClient?: OpenAI;
  private geminiClient?: GoogleGenerativeAI;
  private provider: 'openai' | 'gemini';

  constructor() {
    this.provider = config.activeProvider;
    
    if (this.provider === 'openai') {
      this.openaiClient = new OpenAI({
        apiKey: config.openai.apiKey,
        baseURL: config.openai.baseUrl,
      });
      logger.info(`✅ OpenAI client initialized`);
    } else {
      this.geminiClient = new GoogleGenerativeAI(config.google.apiKey);
      logger.info(`✅ Gemini client initialized`);
    }
  }

  /**
   * 生成文本
   */
  async generateText(prompt: string): Promise<string> {
    try {
      if (this.provider === 'openai') {
        return await this.generateTextWithOpenAI(prompt);
      } else {
        return await this.generateTextWithGemini(prompt);
      }
    } catch (error: any) {
      logger.error('Text generation failed', error);
      throw new Error(`Text generation failed: ${error.message}`);
    }
  }

  /**
   * 生成图片
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      if (this.provider === 'openai') {
        return await this.generateImageWithOpenAI(prompt);
      } else {
        return await this.generateImageWithGemini(prompt);
      }
    } catch (error: any) {
      logger.error('Image generation failed', error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  /**
   * 使用 OpenAI 生成文本
   */
  private async generateTextWithOpenAI(prompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: config.models.text,
      messages: [{ role: 'user', content: prompt }],
      temperature: config.models.temperature,
      max_tokens: config.models.maxOutputTokens,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * 使用 Gemini 生成文本
   */
  private async generateTextWithGemini(prompt: string): Promise<string> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.geminiClient.getGenerativeModel({
      model: config.models.text,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  /**
   * 使用 OpenAI (DALL-E) 生成图片
   */
  private async generateImageWithOpenAI(prompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openaiClient.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }
    return imageUrl;
  }

  /**
   * 使用 Gemini (Imagen) 生成图片
   */
  private async generateImageWithGemini(prompt: string): Promise<string> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.geminiClient.getGenerativeModel({
      model: config.models.image,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Gemini Imagen 返回的是 base64 编码的图片
    const imageData = response.text();
    return imageData;
  }
}

// 导出单例
export const aiClient = new AIClient();
