export interface Quote {
  id: number;
  text: string;
  author: string;
}

export interface InspirationSite {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  color: string;
  isVisible: boolean;
}

export interface GameStats {
  highScore: number;
  gamesPlayed: number;
  totalClicks: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  category?: string;
  confidence?: number;
  responseTime?: number;
  rating?: number;
}