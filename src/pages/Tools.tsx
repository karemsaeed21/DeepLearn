import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { Code, Database, BookOpen, Terminal } from 'lucide-react';

const tools = [
  {
    category: 'Deep Learning Frameworks',
    items: [
      {
        name: 'PyTorch',
        description: 'Open source machine learning framework',
        url: 'https://pytorch.org',
        icon: Code
      },
      {
        name: 'TensorFlow',
        description: 'End-to-end platform for machine learning',
        url: 'https://tensorflow.org',
        icon: Code
      }
    ]
  },
  {
    category: 'Development Tools',
    items: [
      {
        name: 'Jupyter Notebook',
        description: 'Interactive computing environment',
        url: 'https://jupyter.org',
        icon: Terminal
      },
      {
        name: 'VS Code',
        description: 'Code editor with ML extensions',
        url: 'https://code.visualstudio.com',
        icon: Terminal
      }
    ]
  }
];

const Tools: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tools & Frameworks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential tools and frameworks for your deep learning journey.
          </p>
        </motion.div>

        <div className="space-y-12">
          {tools.map((category, index) => (
            <section key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((tool, toolIndex) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: toolIndex * 0.1 }}
                  >
                    <Card hoverable className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                          <tool.icon className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600">{tool.description}</p>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Learn More →
                      </a>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;