export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book';
  source: 'medium' | 'youtube' | 'internal' | 'external';
  url?: string;
  content?: string;
  thumbnail?: string;
  duration?: string;
  author?: string;
}

export interface SubRoadmapNode {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  content: ContentItem[];
  position: { x: number; y: number };
  dependencies: string[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  isEssential: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  position: { x: number; y: number };
  content: ContentItem[];
  dependencies: string[];
  subRoadmap?: SubRoadmapNode[];
}

export interface UserProgress {
  completedNodes: string[];
  inProgressNodes: string[];
  savedContent: string[];
  completedSubNodes: { [nodeId: string]: string[] };
}