export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isLoading?: boolean;
  groundingUrls?: Array<{ uri: string; title: string }>;
  images?: string[]; // base64
}

export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  MEDIA_LAB = 'MEDIA_LAB',
  ANALYSIS = 'ANALYSIS'
}

export enum ImageSize {
  S_1K = '1K',
  S_2K = '2K',
  S_4K = '4K'
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16'
}

export interface GeneratedVideo {
  uri: string;
  expiryTime?: string;
}
