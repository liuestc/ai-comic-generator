export interface ComicPanel {
  index: number
  sceneDescription: string
  dialogue: string
  imagePrompt?: string
  imageUrl?: string
}

export interface ComicScript {
  title: string
  characterDescription: string
  panels: ComicPanel[]
}

export interface GenerateScriptResponse {
  success: boolean
  script?: ComicScript
  characterImageUrl?: string
  error?: string
}

export interface GenerateComicResponse {
  success: boolean
  panels?: ComicPanel[]
  error?: string
}
