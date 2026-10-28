

export interface Project {
  id: string;
  title: string;
  category: string[];
  thumbnailUrl: string;
  youtubeVideoId?: string;
  multipleVideos?: { id?: string; title: string; type?: 'youtube' | 'instagram' | 'youtube-short'; url?: string; customHtml?: string }[];
  videosBelowText?: boolean;
  processVideoId?: string;
  hideComingSoonOverlay?: boolean;
  context?: string;
  role?: string;
  process?: string[];
  challenges?: string;
  results?: string;
  images?: string[];
  linkTo?: string;
  sectionTitles?: {
    context?: string;
    role?: string;
    process?: string;
    challenges?: string;
    results?: string;
  }
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}