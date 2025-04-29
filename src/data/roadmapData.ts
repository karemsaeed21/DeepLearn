import { RoadmapNode } from '../types';

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
    ]
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