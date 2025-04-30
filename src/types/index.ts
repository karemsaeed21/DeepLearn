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
  description?: string;
  isCompleted?: boolean;
  content?: ContentItem[];
  position?: { x: number; y: number };
  dependencies?: string[];
  subtopics?: SubRoadmapNode[]; // Allow nested subtopics
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
  roadmap?: {
    beginner?: SubRoadmapNode[];
    intermediate?: SubRoadmapNode[];
    advanced?: SubRoadmapNode[];
  };
}

export interface UserProgress {
  completedNodes: string[];
  inProgressNodes: string[];
  savedContent: string[];
  completedSubNodes: { [nodeId: string]: string[] };
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'course' | 'tool';
}

export interface Step {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  dependencies: string[]; // IDs of steps that should be completed first
  nextSteps: string[]; // IDs of recommended next steps
  progress: number; // 0-100
  completed: boolean;
}

export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  progress: number; // 0-100
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  sections: RoadmapSection[];
  progress: number; // 0-100
}