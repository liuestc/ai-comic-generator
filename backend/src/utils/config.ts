import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // AI 提供商配置
  activeProvider: (process.env.ACTIVE_PROVIDER || 'gemini') as 'openai' | 'gemini',
  
  // OpenAI 配置
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  },

  // Google Gemini 配置
  google: {
    apiKey: process.env.GOOGLE_API_KEY || '',
  },

  // 模型配置
  models: {
    text: process.env.TEXT_MODEL || 'gemini-2.0-flash-exp',
    image: process.env.IMAGE_MODEL || 'imagen-3.0-generate-001',
    temperature: parseFloat(process.env.TEMPERATURE || '1.0'),
    maxOutputTokens: parseInt(process.env.MAX_OUTPUT_TOKENS || '8000', 10),
  },
};

// 验证配置
export function validateConfig(): void {
  const errors: string[] = [];

  if (config.activeProvider === 'openai' && !config.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required when using OpenAI provider');
  }

  if (config.activeProvider === 'gemini' && !config.google.apiKey) {
    errors.push('GOOGLE_API_KEY is required when using Gemini provider');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\n💡 Please check your .env file and ensure all required API keys are set.');
  }
}
