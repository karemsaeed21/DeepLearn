import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Database, Download } from 'lucide-react';

const datasets = [
  {
    name: 'MNIST Database',
    description: 'Database of handwritten digits',
    size: '11.5 MB',
    samples: '70,000',
    category: 'Computer Vision',
    url: 'http://yann.lecun.com/exdb/mnist/'
  },
  {
    name: 'ImageNet',
    description: 'Image database organized according to WordNet hierarchy',
    size: '150 GB',
    samples: '14 million',
    category: 'Computer Vision',
    url: 'https://www.image-net.org'
  },
  {
    name: 'Penn Treebank',
    description: 'Corpus of English sentences with linguistic structure annotations',
    size: '0.8 GB',
    samples: '1 million',
    category: 'NLP',
    url: '#'
  }
];

const Datasets: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Datasets
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated datasets for training and testing your deep learning models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {datasets.map((dataset, index) => (
            <motion.div
              key={dataset.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable className="h-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Database className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dataset.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{dataset.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium">{dataset.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Samples:</span>
                      <span className="font-medium">{dataset.samples}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" size="sm">
                      {dataset.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-green-600 hover:text-green-800 font-medium"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Dataset
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Datasets;