import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import OpenAI from 'openai';
import { config } from './config';
import { logger } from './logger';

/**
 * AI 客户端工具类
 * 支持 OpenAI 和 Google Gemini (包括 Nano Banana Pro)
 */

export class AIClient {
  private openaiClient?: OpenAI;
  private geminiClient?: GoogleGenerativeAI;
  private genaiClient?: GoogleGenAI;
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
      // 初始化旧版 Gemini SDK（用于文本生成）
      this.geminiClient = new GoogleGenerativeAI(config.google.apiKey);
      // 初始化新版 GenAI SDK（用于 Nano Banana Pro 图像生成）
      this.genaiClient = new GoogleGenAI({
        apiKey: config.google.apiKey,
      });
      logger.info(`✅ Gemini client initialized (with Nano Banana Pro support)`);
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
        return await this.generateImageWithNanoBananaPro(prompt);
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
   * 使用 Nano Banana Pro (Gemini 3 Pro Image) 生成图片
   * 参考 RedInk 的实现方式
   */
  private async generateImageWithNanoBananaPro(prompt: string): Promise<string> {
    if (!this.genaiClient) {
      throw new Error('GenAI client not initialized');
    }

    const model = config.models.image;
    logger.info(`🍌 Generating image with Nano Banana Pro: ${model}`);
    logger.debug(`  Prompt length: ${prompt.length} characters`);

    let imageData: string | null = null;

    try {
      // 使用流式 API 生成图片
      logger.debug(`  Calling API: model=${model}`);
      const stream = this.genaiClient.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
          temperature: config.models.temperature,
          topP: 0.95,
          maxOutputTokens: 32768,
          responseModalities: ['IMAGE'],
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          ],
          imageConfig: {
            aspectRatio: '1:1',  // 可选: "1:1", "3:4", "4:3", "16:9", "9:16"
          },
        },
      });

      // 处理流式响应
      for await (const chunk of await stream) {
        if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
          for (const part of chunk.candidates[0].content.parts) {
            // 检查是否有图片数据
            if (part.inlineData && part.inlineData.data) {
              imageData = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              logger.debug(`  Received image data: ${imageData?.length || 0} bytes (base64)`);
              logger.info(`✅ Nano Banana Pro image generation successful`);
              
              // 返回 base64 编码的图片
              return `data:${mimeType};base64,${imageData}`;
            }
          }
        }
      }

      // 如果没有收到图片数据
      if (!imageData) {
        logger.error('API returned empty, no image generated');
        throw new Error(
          '❌ Image generation failed: API returned empty\n\n' +
          'Possible reasons:\n' +
          '1. Prompt triggered safety filters (most common)\n' +
          '2. Model does not support the current request\n' +
          '3. Network transmission data loss\n\n' +
          'Solutions:\n' +
          '1. Modify the prompt to avoid sensitive content\n' +
          '2. Simplify the prompt\n' +
          '3. Check network connection and retry'
        );
      }

      throw new Error('Failed to extract image data from response');
    } catch (error: any) {
      logger.error(`Nano Banana Pro generation failed: ${error.message}`);
      throw error;
    }
  }
}

// 导出单例
export const aiClient = new AIClient();
