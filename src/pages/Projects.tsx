import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Image Classification with CNNs',
    description: 'Build a convolutional neural network to classify images using PyTorch.',
    difficulty: 'beginner',
    topics: ['CNN', 'PyTorch', 'Computer Vision'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    githubUrl: '#',
    demoUrl: '#'
  },
  {
    title: 'Text Generation with RNNs',
    description: 'Create a character-level text generator using recurrent neural networks.',
    difficulty: 'intermediate',
    topics: ['RNN', 'NLP', 'TensorFlow'],
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    githubUrl: '#',
    demoUrl: '#'
  },
  {
    title: 'Reinforcement Learning Game Agent',
    description: 'Train an AI agent to play simple games using deep Q-learning.',
    difficulty: 'advanced',
    topics: ['RL', 'PyTorch', 'Q-Learning'],
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    githubUrl: '#',
    demoUrl: '#'
  }
];

const Projects: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hands-on Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Apply your knowledge with real-world deep learning projects. Each project comes with detailed instructions and starter code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable className="h-full flex flex-col">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        project.difficulty === 'beginner'
                          ? 'success'
                          : project.difficulty === 'intermediate'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                      className="capitalize"
                    >
                      {project.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.topics.map(topic => (
                      <Badge key={topic} variant="secondary" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <a
                      href={project.githubUrl}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      Code
                    </a>
                    <a
                      href={project.demoUrl}
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Live Demo
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;