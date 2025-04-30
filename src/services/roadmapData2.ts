import { Roadmap, RoadmapSection, Step, Resource } from '../types/index2';

// Sample learning resources
const pythonResources: Resource[] = [
  {
    id: 'py-res-1',
    title: 'Python for Beginners',
    url: 'https://www.python.org/about/gettingstarted/',
    type: 'article',
  },
  {
    id: 'py-res-2',
    title: 'Python Crash Course Book',
    url: 'https://nostarch.com/pythoncrashcourse2e',
    type: 'book',
  },
  {
    id: 'py-res-3',
    title: 'Python Tutorial for Beginners',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    type: 'video',
  },
];

const mlResources: Resource[] = [
  {
    id: 'ml-res-1',
    title: 'Machine Learning Crash Course',
    url: 'https://developers.google.com/machine-learning/crash-course',
    type: 'course',
  },
  {
    id: 'ml-res-2',
    title: 'Scikit-learn Documentation',
    url: 'https://scikit-learn.org/stable/',
    type: 'tool',
  },
  {
    id: 'ml-res-3',
    title: 'StatQuest: Machine Learning',
    url: 'https://www.youtube.com/c/joshstarmer',
    type: 'video',
  },
];

const dlResources: Resource[] = [
  {
    id: 'dl-res-1',
    title: 'Deep Learning Specialization',
    url: 'https://www.coursera.org/specializations/deep-learning',
    type: 'course',
  },
  {
    id: 'dl-res-2',
    title: 'TensorFlow Documentation',
    url: 'https://www.tensorflow.org/',
    type: 'tool',
  },
  {
    id: 'dl-res-3',
    title: 'Deep Learning with Python',
    url: 'https://www.manning.com/books/deep-learning-with-python',
    type: 'book',
  },
];

// Sample steps for the Python Roadmap
const pythonRoadmapSteps: Step[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Learn Python syntax and basic concepts',
    resources: pythonResources,
    dependencies: [],
    nextSteps: ['python-intermediate'],
    progress: 100,
    completed: true,
    isEssential: true, // Added
    level: 'beginner', // Added
  },
  {
    id: 'python-intermediate',
    title: 'Intermediate Python',
    description: 'Dive deeper into Python concepts',
    resources: [pythonResources[1], pythonResources[2]],
    dependencies: ['python-basics'],
    nextSteps: ['python-advanced'],
    progress: 85,
    completed: false,
    isEssential: true, // Added
    level: 'intermediate', // Added
  },
  {
    id: 'python-advanced',
    title: 'Advanced Python',
    description: 'Master advanced Python concepts',
    resources: [pythonResources[0], pythonResources[1]],
    dependencies: ['python-intermediate'],
    nextSteps: ['ml-basics'],
    progress: 40,
    completed: false,
    isEssential: false, // Added
    level: 'advanced', // Added
  },
];

// Sample steps for the ML Roadmap
const mlRoadmapSteps: Step[] = [
  {
    id: 'ml-basics',
    title: 'Machine Learning Basics',
    description: 'Learn fundamental ML concepts and algorithms',
    resources: mlResources,
    dependencies: ['python-advanced'],
    nextSteps: ['ml-algorithms'],
    progress: 75,
    completed: false,
    isEssential: true, // Added
    level: 'beginner', // Added
  },
  {
    id: 'ml-algorithms',
    title: 'ML Algorithms',
    description: 'Study common ML algorithms in depth',
    resources: [...mlResources, pythonResources[0]],
    dependencies: ['ml-basics'],
    nextSteps: ['ml-frameworks'],
    progress: 30,
    completed: false,
    isEssential: true, // Added
    level: 'intermediate', // Added
  },
  {
    id: 'ml-frameworks',
    title: 'ML Frameworks',
    description: 'Learn popular ML frameworks and tools',
    resources: [mlResources[1], pythonResources[2]],
    dependencies: ['ml-algorithms'],
    nextSteps: ['ml-deployment'],
    progress: 0,
    completed: false,
    isEssential: false, // Added
    level: 'advanced', // Added
  },
  {
    id: 'ml-deployment',
    title: 'ML Deployment',
    description: 'Deploy ML models to production',
    resources: [mlResources[0], dlResources[1]],
    dependencies: ['ml-frameworks'],
    nextSteps: ['dl-intro'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'advanced', // Added
  },
];

// Sample steps for the Deep Learning Roadmap
const dlRoadmapSteps: Step[] = [
  {
    id: 'dl-intro',
    title: 'Intro to Deep Learning',
    description: 'Understand basic neural network concepts',
    resources: dlResources,
    dependencies: ['ml-deployment'],
    nextSteps: ['dl-architectures'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'beginner', // Added
  },
  {
    id: 'dl-architectures',
    title: 'Neural Network Architectures',
    description: 'Study different neural network architectures',
    resources: [dlResources[0], dlResources[2]],
    dependencies: ['dl-intro'],
    nextSteps: ['dl-frameworks'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'intermediate', // Added
  },
  {
    id: 'dl-frameworks',
    title: 'Deep Learning Frameworks',
    description: 'Learn TensorFlow, PyTorch, and more',
    resources: [dlResources[1], mlResources[2]],
    dependencies: ['dl-architectures'],
    nextSteps: ['dl-projects'],
    progress: 0,
    completed: false,
    isEssential: false, // Added
    level: 'advanced', // Added
  },
  {
    id: 'dl-projects',
    title: 'DL Projects',
    description: 'Build and deploy deep learning projects',
    resources: [dlResources[0], dlResources[1], dlResources[2]],
    dependencies: ['dl-frameworks'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'advanced', // Added
  },
];

// Sample roadmap sections
const roadmapSections: RoadmapSection[] = [
  {
    id: 'python-section',
    title: 'Python Fundamentals',
    description: 'Master Python programming language',
    steps: pythonRoadmapSteps,
    progress: 75, // Calculated based on steps progress
  },
  {
    id: 'ml-section',
    title: 'Machine Learning',
    description: 'Learn machine learning concepts and applications',
    steps: mlRoadmapSteps,
    progress: 26, // Calculated based on steps progress
  },
  {
    id: 'dl-section',
    title: 'Deep Learning',
    description: 'Dive into neural networks and deep learning',
    steps: dlRoadmapSteps,
    progress: 0, // Calculated based on steps progress
  },
];

// Sample roadmap
export const sampleRoadmap: Roadmap = {
  id: 'data-science-roadmap',
  title: 'Data Science Learning Path',
  description: 'Complete guide to becoming a data scientist',
  sections: roadmapSections,
  progress: 34, // Calculated based on sections progress
};

// Utility function to calculate overall progress
export const calculateProgress = (items: { progress: number }[]): number => {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + item.progress, 0);
  return Math.round(sum / items.length);
};

// Utility function to update step progress
export const updateStepProgress = (
  roadmap: Roadmap,
  stepId: string,
  progress: number
): Roadmap => {
  const updatedSections = roadmap.sections.map(section => {
    const updatedSteps = section.steps.map(step => 
      step.id === stepId ? { ...step, progress } : step
    );
    
    return {
      ...section,
      steps: updatedSteps,
      progress: calculateProgress(updatedSteps),
    };
  });
  
  return {
    ...roadmap,
    sections: updatedSections,
    progress: calculateProgress(updatedSections),
  };
};

// Utility function to update step completion status
export const updateStepCompletion = (
  roadmap: Roadmap,
  stepId: string,
  completed: boolean
): Roadmap => {
  const updatedSections = roadmap.sections.map(section => {
    const updatedSteps = section.steps.map(step => 
      step.id === stepId ? { ...step, completed, progress: completed ? 100 : step.progress } : step
    );
    
    return {
      ...section,
      steps: updatedSteps,
      progress: calculateProgress(updatedSteps),
    };
  });
  
  return {
    ...roadmap,
    sections: updatedSections,
    progress: calculateProgress(updatedSections),
  };
};

export const getStepById = (stepId: string): Step | undefined => {
  const allSteps = [
    ...pythonRoadmapSteps,
    ...mlRoadmapSteps,
    ...dlRoadmapSteps,
  ];
  return allSteps.find((step) => step.id === stepId);
};