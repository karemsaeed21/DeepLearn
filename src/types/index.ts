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
  dependencies: string[];
  content: ContentItem[];
  roadmap?: {
    beginner: Subtopic[];
    intermediate: Subtopic[];
    advanced: Subtopic[];
  };
}

export interface Subtopic {
  id: string;
  title: string;
  subtopics?: Subtopic[];
}

export interface UserProgress {
  completedNodes: string[];
  inProgressNodes: string[];
  savedContent: string[];
  completedSubNodes: { [nodeId: string]: string[] };
}

export interface Step {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  dependencies: string[];
  nextSteps: string[];
  progress: number;
  completed: boolean;
  isEssential: boolean; // Added
  level: 'beginner' | 'intermediate' | 'advanced'; // Added
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