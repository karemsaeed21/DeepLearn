// --- Core Content Interfaces ---

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

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'course' | 'tool' | 'paper';
}

// --- Hierarchical Content Structure ---

export interface Subtopic {
  id: string;
  title: string;
  subtopics?: Subtopic[];
}

// --- Node Definitions ---

export interface SubRoadmapNode {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  position: { x: number; y: number };
  dependencies: string[];
  content: ContentItem[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  isEssential: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  position: { x: number; y: number };
  dependencies: string[];
  content: ContentItem[];
  roadmap?: {
    beginner: Subtopic[];
    intermediate: Subtopic[];
    advanced: Subtopic[];
  };
}

// --- Progress Tracking ---

export interface UserProgress {
  completedNodes: string[];
  inProgressNodes: string[];
  savedContent: string[];
  completedSubNodes: { [nodeId: string]: string[] };
}

// --- Roadmap Breakdown ---

export interface Step {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isEssential: boolean;
  progress: number;
  completed: boolean;
  resources: Resource[];
  dependencies: string[];
  nextSteps: string[];
}

export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 - 100
  steps: Step[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 - 100
  sections: RoadmapSection[];
}
