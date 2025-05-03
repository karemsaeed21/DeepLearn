import { RoadmapNode } from '../types';
import { Roadmap , RoadmapSection, Step, Resource } from '../types/index';

// Sample learning resources
const cnnResources: Resource[] = [
  {
    id: 'cnn-res-1',
    title: 'CS231n: Convolutional Neural Networks for Visual Recognition',
    url: 'http://cs231n.stanford.edu/',
    type: 'course',
  },
  {
    id: 'cnn-res-2',
    title: 'Deep Learning for Computer Vision with Python',
    url: 'https://www.pyimagesearch.com/deep-learning-computer-vision-python-book/',
    type: 'book',
  },
  {
    id: 'cnn-res-3',
    title: 'Fast.ai Course on Deep Learning for Coders',
    url: 'https://course.fast.ai/',
    type: 'course',
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
const rnnResources: Resource[] = [
  {
    id: 'rnn-res-1',
    title: 'Understanding LSTMs',
    url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/',
    type: 'article',
  },
  {
    id: 'rnn-res-2',
    title: 'Sequence Models and Long-Short Term Memory Networks',
    url: 'https://www.coursera.org/learn/nlp-sequence-models',
    type: 'course',
  },
  {
    id: 'rnn-res-3',
    title: 'Deep Learning for Time Series Forecasting',
    url: 'https://www.udacity.com/course/deep-learning-pytorch--ud188',
    type: 'course',
  },
];




// Sample steps for the Python Roadmap
const cnnRoadmapSteps: Step[] = [
  {
    id: 'cnn-basics',
    title: 'CNN Basics',
    description: 'Learn the fundamentals of Convolutional Neural Networks',
    resources: cnnResources,
    dependencies: ['ml-basics'],
    nextSteps: ['cnn-architectures'],
    progress: 50,
    completed: false,
    isEssential: true, // Added
    level: 'beginner', // Added
  },
  {
    id: 'cnn-architectures',
    title: 'CNN Architectures',
    description: 'Study popular CNN architectures like VGG, ResNet, etc.',
    resources: [...cnnResources, mlResources[0]],
    dependencies: ['cnn-basics'],
    nextSteps: ['cnn-applications'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'intermediate', // Added
  },
  {
    id: 'cnn-applications',
    title: 'CNN Applications',
    description: 'Explore applications of CNNs in image classification and more',
    resources: [cnnResources[1], dlResources[2]],
    dependencies: ['cnn-architectures'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'advanced', // Added
  },
];
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
    resources: [...mlResources, cnnResources[0]],
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
    resources: [mlResources[1], cnnResources[2]],
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

const rnnRoadmapSteps: Step[] = [
  {
    id: 'rnn-intro',
    title: 'Intro to RNNs',
    description: 'Understand the basics of Recurrent Neural Networks',
    resources: rnnResources,
    dependencies: ['dl-intro'],
    nextSteps: ['rnn-architectures'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'beginner', // Added
  },
  {
    id: 'rnn-architectures',
    title: 'RNN Architectures',
    description: 'Study different RNN architectures like LSTM and GRU',
    resources: [rnnResources[0], rnnResources[1]],
    dependencies: ['rnn-intro'],
    nextSteps: ['rnn-applications'],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'intermediate', // Added
  },
  {
    id: 'rnn-applications',
    title: 'RNN Applications',
    description: 'Explore applications of RNNs in NLP and time series analysis',
    resources: [rnnResources[2]],
    dependencies: ['rnn-architectures'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true, // Added
    level: 'advanced', // Added
  },
];

const transformerRoadmapSteps: Step[] = [
  {
    id: 'transformer-basics',
    title: 'Transformer Basics',
    description: 'Understand the basics of Transformer models and attention mechanisms',
    resources: [
      {
        id: 'transformer-res-1',
        title: 'Attention Is All You Need',
        url: 'https://arxiv.org/abs/1706.03762',
        type: 'paper',
      },
      {
        id: 'transformer-res-2',
        title: 'Transformers from Scratch',
        url: 'https://www.youtube.com/watch?v=example-transformer',
        type: 'video',
      },
    ],
    dependencies: ['rnn-applications'],
    nextSteps: ['transformer-advanced'],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'beginner',
  },
  {
    id: 'transformer-advanced',
    title: 'Advanced Transformers',
    description: 'Learn about BERT, GPT, and other advanced Transformer architectures',
    resources: [
      {
        id: 'transformer-res-3',
        title: 'BERT Explained',
        url: 'https://arxiv.org/abs/1810.04805',
        type: 'paper',
      },
    ],
    dependencies: ['transformer-basics'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'advanced',
  },
];

const rlRoadmapSteps: Step[] = [
  {
    id: 'rl-intro',
    title: 'Introduction to Reinforcement Learning',
    description: 'Learn the basics of RL and Markov Decision Processes',
    resources: [
      {
        id: 'rl-res-1',
        title: 'Reinforcement Learning: An Introduction',
        url: 'http://incompleteideas.net/book/the-book-2nd.html',
        type: 'book',
      },
    ],
    dependencies: ['transformer-advanced'],
    nextSteps: ['rl-advanced'],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'beginner',
  },
  {
    id: 'rl-advanced',
    title: 'Advanced Reinforcement Learning',
    description: 'Learn about Deep Q-Learning and Policy Gradient Methods',
    resources: [
      {
        id: 'rl-res-2',
        title: 'Deep Reinforcement Learning Explained',
        url: 'https://www.youtube.com/watch?v=example-rl',
        type: 'video',
      },
    ],
    dependencies: ['rl-intro'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'advanced',
  },
];

const generativeRoadmapSteps: Step[] = [
  {
    id: 'gan-basics',
    title: 'GAN Basics',
    description: 'Learn the fundamentals of Generative Adversarial Networks',
    resources: [
      {
        id: 'gan-res-1',
        title: 'GANs in Action',
        url: 'https://www.manning.com/books/gans-in-action',
        type: 'book',
      },
    ],
    dependencies: ['transformer-advanced'],
    nextSteps: ['gan-advanced'],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'beginner',
  },
  {
    id: 'gan-advanced',
    title: 'Advanced Generative Models',
    description: 'Learn about VAEs, Diffusion Models, and advanced GAN techniques',
    resources: [
      {
        id: 'gan-res-2',
        title: 'Diffusion Models Explained',
        url: 'https://arxiv.org/abs/2006.11239',
        type: 'paper',
      },
    ],
    dependencies: ['gan-basics'],
    nextSteps: [],
    progress: 0,
    completed: false,
    isEssential: true,
    level: 'advanced',
  },
];

// Sample roadmap sections
const roadmapSections: RoadmapSection[] = [
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
  {
    id: 'cnn-section',
    title: 'Convolutional Neural Networks',
    description: 'Learn about CNNs and their applications in computer vision',
    steps: cnnRoadmapSteps,
    progress: 75, // Calculated based on steps progress
  },
  {
    id: 'rnn-section',
    title: 'Recurrent Neural Networks',
    description: 'Explore RNNs and their applications in sequence data',
    steps: rnnRoadmapSteps,
    progress: 0, // Calculated based on steps progress
  },
  {
    id: 'transformer-section',
    title: 'Transformers & Attention',
    description: 'Modern architectures powering NLP breakthroughs',
    steps: transformerRoadmapSteps,
    progress: 0,
  },
  {
    id: 'rl-section',
    title: 'Reinforcement Learning',
    description: 'Training agents through environment interaction',
    steps: rlRoadmapSteps,
    progress: 0,
  },
  {
    id: 'generative-section',
    title: 'Generative AI',
    description: 'GANs, VAEs, and diffusion models',
    steps: generativeRoadmapSteps,
    progress: 0,
  },
];

export const roadmapData: RoadmapNode[] = [
  {
    id: 'basics',
    title: 'Machine Learning Fundamentals',
    description: 'Essential mathematical concepts and basic ML algorithms',
    isEssential: true,
    level: 'beginner',
    position: { x: 50, y: 100 },
    dependencies: [],
    content: [
      {
        id: 'basics-1',
        title: 'Linear Algebra for Machine Learning',
        type: 'article',
        source: 'internal',
        content: 'Understanding vectors, matrices, and operations is fundamental to ML...',
        author: 'Dr. Emma Thompson'
      },
      {
        id: 'basics-2',
        title: 'Statistics and Probability Essentials',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example1',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '32:15',
        author: 'StatML Academy'
      },
      {
        id: 'basics-3',
        title: 'Python for Data Science',
        type: 'book',
        source: 'external',
        url: 'https://example.com/python-data-science',
        author: 'Jake Wilson'
      }
    ],
    roadmap: {
      beginner: [
        {
          id: 'basics-1',
          title: 'Learn Linear Algebra Basics',
          subtopics: [
            {
              id: 'subtopic-1',
              title: 'Vectors and Matrices',
              subtopics: [
                { id: 'sub-subtopic-1', title: 'Vector Operations' },
                { id: 'sub-subtopic-2', title: 'Matrix Multiplication' }
              ]
            },
            {
              id: 'subtopic-2',
              title: 'Matrix Transformations',
              subtopics: [
                { id: 'sub-subtopic-3', title: 'Eigenvalues and Eigenvectors' }
              ]
            }
          ]
        },
        {
          id: 'basics-2',
          title: 'Understand Probability',
          subtopics: [
            {
              id: 'subtopic-3',
              title: 'Bayes Theorem',
              subtopics: [
                { id: 'sub-subtopic-4', title: 'Conditional Probability' },
                { id: 'sub-subtopic-5', title: 'Applications of Bayes Theorem' }
              ]
            },
            {
              id: 'subtopic-4',
              title: 'Random Variables',
              subtopics: [
                { id: 'sub-subtopic-6', title: 'Discrete Random Variables' },
                { id: 'sub-subtopic-7', title: 'Continuous Random Variables' }
              ]
            }
          ]
        }
      ],
      intermediate: [
        {
          id: 'basics-3',
          title: 'Implement Linear Regression',
          subtopics: [
            {
              id: 'subtopic-5',
              title: 'Gradient Descent',
              subtopics: [
                { id: 'sub-subtopic-8', title: 'Cost Function' },
                { id: 'sub-subtopic-9', title: 'Learning Rate' }
              ]
            }
          ]
        }
      ],
      advanced: [
        {
          id: 'basics-4',
          title: 'Optimize Machine Learning Models',
          subtopics: [
            {
              id: 'subtopic-6',
              title: 'Hyperparameter Tuning',
              subtopics: [
                { id: 'sub-subtopic-10', title: 'Grid Search' },
                { id: 'sub-subtopic-11', title: 'Random Search' }
              ]
            },
            {
              id: 'subtopic-7',
              title: 'Regularization',
              subtopics: [
                { id: 'sub-subtopic-12', title: 'L1 Regularization (Lasso)' },
                { id: 'sub-subtopic-13', title: 'L2 Regularization (Ridge)' }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    description: 'Understanding the building blocks of deep learning',
    isEssential: true,
    level: 'beginner',
    position: { x: 50, y: 200 },
    dependencies: ['basics'],
    content: [
      {
        id: 'nn-1',
        title: 'Introduction to Neural Networks',
        type: 'article',
        source: 'medium',
        url: 'https://medium.com/example/intro-neural-networks',
        author: 'Maria Garcia'
      },
      {
        id: 'nn-2',
        title: 'Building Your First Neural Network',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example2',
        thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '45:30',
        author: 'DeepLearning101'
      }
    ]
  },
  {
    id: 'cnn',
    title: 'Convolutional Neural Networks',
    description: 'Computer vision and image processing techniques',
    isEssential: true,
    level: 'intermediate',
    position: { x: 20, y: 300 },
    dependencies: ['neural-networks'],
    content: [
      {
        id: 'cnn-1',
        title: 'CNNs Explained Simply',
        type: 'article',
        source: 'internal',
        content: 'Convolutional Neural Networks are specialized for processing grid-like data...',
        author: 'Dr. Michael Chen'
      },
      {
        id: 'cnn-2',
        title: 'Building Image Classifiers with PyTorch',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example3',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '1:12:45',
        author: 'PyTorch Masters'
      }
    ]
  },
  {
    id: 'rnn',
    title: 'Recurrent Neural Networks',
    description: 'Sequence modeling and time series analysis',
    isEssential: false,
    level: 'intermediate',
    position: { x: 80, y: 300 },
    dependencies: ['neural-networks'],
    content: [
      {
        id: 'rnn-1',
        title: 'Understanding LSTMs and GRUs',
        type: 'article',
        source: 'medium',
        url: 'https://medium.com/example/lstms-grus-explained',
        author: 'Sarah Johnson'
      },
      {
        id: 'rnn-2',
        title: 'Time Series Forecasting with RNNs',
        type: 'book',
        source: 'external',
        url: 'https://example.com/time-series-rnn',
        author: 'Daniel Lee'
      }
    ]
  },
  {
    id: 'transformer',
    title: 'Transformers & Attention',
    description: 'Modern architectures powering NLP breakthroughs',
    isEssential: true,
    level: 'advanced',
    position: { x: 50, y: 400 },
    dependencies: ['rnn', 'cnn'],
    content: [
      {
        id: 'transformer-1',
        title: 'Attention Is All You Need - Explained',
        type: 'article',
        source: 'internal',
        content: 'The groundbreaking paper that introduced transformers revolutionized NLP...',
        author: 'Dr. Lisa Zhang'
      },
      {
        id: 'transformer-2',
        title: 'Building a Transformer from Scratch',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example4',
        thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '1:45:20',
        author: 'AI Explained'
      }
    ]
  },
  {
    id: 'rl',
    title: 'Reinforcement Learning',
    description: 'Training agents through environment interaction',
    isEssential: false,
    level: 'advanced',
    position: { x: 20, y: 500 },
    dependencies: ['transformer'],
    content: [
      {
        id: 'rl-1',
        title: 'Introduction to Reinforcement Learning',
        type: 'article',
        source: 'medium',
        url: 'https://medium.com/example/intro-to-rl',
        author: 'Robert Wilson'
      },
      {
        id: 'rl-2',
        title: 'Deep Q-Networks Explained',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example5',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '52:30',
        author: 'RL Academy'
      }
    ]
  },
  {
    id: 'generative',
    title: 'Generative AI',
    description: 'GANs, VAEs, and diffusion models',
    isEssential: false,
    level: 'advanced',
    position: { x: 80, y: 500 },
    dependencies: ['transformer'],
    content: [
      {
        id: 'gen-1',
        title: 'Generative Adversarial Networks',
        type: 'article',
        source: 'internal',
        content: 'GANs consist of two networks competing against each other...',
        author: 'Prof. Alex Morgan'
      },
      {
        id: 'gen-2',
        title: 'Creating Art with Stable Diffusion',
        type: 'video',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=example6',
        thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        duration: '1:05:15',
        author: 'AI Art Channel'
      },

    ]
  }
];

export const sampleRoadmap: Roadmap = {
  id: 'data-science-roadmap',
  title: 'Data Science Learning Path',
  description: 'Complete guide to becoming a data scientist',
  sections: roadmapSections,
  progress: 34, // Calculated based on sections progress
};

export const calculateProgress = (items: { progress: number }[]): number => {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + item.progress, 0);
  return Math.round(sum / items.length);
};

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