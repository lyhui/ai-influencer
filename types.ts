export enum Platform {
  Instagram = 'Instagram',
  TikTok = 'TikTok',
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  YouTubeShorts = 'YouTube Shorts',
  YouTube = 'YouTube'
}

export enum ContentType {
  Video = 'Video',
  Image = 'Image'
}

export enum DatePeriod {
  Last24h = 'Last 24 hours',
  Last7d = 'Last 7 days',
  Last30d = 'Last 30 days',
  Last90d = 'Last 90 days',
  AllTime = 'All Time'
}

export interface ViralPost {
  id: string;
  title: string;
  industry: string;
  platform: Platform;
  region: string;
  language?: string;
  shares: number;
  daysActive: number;
  hook: string;
  contentDescription: string;
  psychologicalTrigger: string;
  engagementScore: number; // 0-100
  estimatedReach: string;
  tags: string[];
  sourceHandle?: string;
  sourceFollowers?: string; // New field for follower count (e.g., "1.2M")
  sourceLink?: string;
  isSaved?: boolean;
}

export interface SearchFilters {
  industry: string;
  minShares: number;
}

export enum GenerationType {
  ViralReels = 'Viral Reels (9:16)',
  Video16_9 = 'Video (16:9)',
  Picture = 'Picture',
  ScriptsAndPrompts = 'Scripts & Prompts'
}

export interface InfluencerOptions {
  age: string;
  sex: string;
  race: string;
  character: string;
  language: string;
  expectedReach: string;
  contentDuration: string;
  platform: string; // Added platform selection
  generationType: GenerationType;
}

export interface InfluencerProfile {
  id?: string; // For saved profiles
  dateCreated?: number;
  name: string;
  bio: string;
  visualDescription: string;
  strategy: string;
  imageUrl?: string;
  videoUrl?: string;
  platform?: string; // To track which platform this profile was built for
  scripts?: string; // Added for scripts & prompts generation
}