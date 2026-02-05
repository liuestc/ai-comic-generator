/**
 * 类型定义文件
 */

export interface ComicPanel {
  index: number;
  sceneDescription: string;
  dialogue: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface ComicScript {
  title: string;
  characterDescription: string;
  panels: ComicPanel[];
}

export interface GenerateScriptRequest {
  topic: string;
}

export interface GenerateScriptResponse {
  success: boolean;
  script?: ComicScript;
  characterImageUrl?: string;
  error?: string;
}

export interface GenerateComicRequest {
  script: ComicScript;
  characterImageUrl?: string;
}

export interface GenerateComicResponse {
  success: boolean;
  panels?: ComicPanel[];
  error?: string;
}

export interface AIProviderConfig {
  provider: 'openai' | 'gemini';
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}
