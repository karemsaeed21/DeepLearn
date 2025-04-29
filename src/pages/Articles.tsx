import React, { useState } from 'react';
import ContentGrid from '../components/content/ContentGrid';
import { Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';

const articles = [
  {
    id: 'article-1',
    title: 'Understanding Neural Networks: A Visual Guide',
    type: 'article',
    source: 'internal',
    content: 'Neural networks are the foundation of deep learning. In this comprehensive guide, we\'ll explore how neural networks work through intuitive visualizations...',
    author: 'Dr. Sarah Chen',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg'
  },
  {
    id: 'article-2',
    title: 'Backpropagation Explained Simply',
    type: 'article',
    source: 'medium',
    url: 'https://medium.com/example/backpropagation',
    author: 'Michael Johnson',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
  },
  {
    id: 'article-3',
    title: 'Deep Learning for Computer Vision',
    type: 'article',
    source: 'internal',
    content: 'Learn how convolutional neural networks revolutionized computer vision tasks...',
    author: 'Prof. Alex Wong',
    thumbnail: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg'
  },
  {
    id: 'article-4',
    title: 'Introduction to Natural Language Processing',
    type: 'article',
    source: 'medium',
    url: 'https://medium.com/example/nlp-intro',
    author: 'Lisa Zhang',
    thumbnail: 'https://images.pexels.com/photos/8386432/pexels-photo-8386432.jpeg'
  },
  {
    id: 'article-5',
    title: 'Reinforcement Learning: From Theory to Practice',
    type: 'article',
    source: 'internal',
    content: 'Discover how reinforcement learning enables AI agents to learn from interaction...',
    author: 'Dr. Robert Wilson',
    thumbnail: 'https://images.pexels.com/photos/8386436/pexels-photo-8386436.jpeg'
  }
];

const Articles: React.FC = () => {
  const { progress, toggleSavedContent } = useProgress();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    source: {
      internal: true,
      medium: true
    },
    saved: false
  });

  const filteredArticles = articles.filter(article => {
    if (filters.saved && !progress.savedContent.includes(article.id)) {
      return false;
    }
    return filters.source[article.source as keyof typeof filters.source];
  });

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="mt-2 text-gray-600">
              Deep dive into deep learning concepts with our curated articles.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fadeIn">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Source</h3>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.source.internal}
                      onChange={() => setFilters({
                        ...filters,
                        source: { ...filters.source, internal: !filters.source.internal }
                      })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Internal Articles</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.source.medium}
                      onChange={() => setFilters({
                        ...filters,
                        source: { ...filters.source, medium: !filters.source.medium }
                      })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Medium Articles</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.saved}
                    onChange={() => setFilters({
                      ...filters,
                      saved: !filters.saved
                    })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700">Show only saved articles</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <ContentGrid
          items={filteredArticles}
          savedItems={progress.savedContent}
          onBookmark={toggleSavedContent}
        />
      </div>
    </div>
  );
};

export default Articles;