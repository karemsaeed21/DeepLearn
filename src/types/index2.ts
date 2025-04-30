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

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  dependencies: string[]; // IDs of steps that should be completed first
  nextSteps: string[]; // IDs of recommended next steps
  progress: number; // 0-100
  completed: boolean;
  isEssential: boolean; // Added
  level: 'beginner' | 'intermediate' | 'advanced'; // Added
}