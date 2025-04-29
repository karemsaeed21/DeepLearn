import React from 'react';
import { motion } from 'framer-motion';
import ContentGrid from '../components/content/ContentGrid';
import { useProgress } from '../hooks/useProgress';
import { Filter } from 'lucide-react';
import Button from '../components/ui/Button';

const videos = [
  {
    id: 'video-1',
    title: 'Neural Networks from Scratch',
    type: 'video',
    source: 'youtube',
    url: 'https://youtube.com/example1',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    duration: '45:20',
    author: 'Dr. Sarah Chen'
  },
  {
    id: 'video-2',
    title: 'Convolutional Neural Networks Explained',
    type: 'video',
    source: 'youtube',
    url: 'https://youtube.com/example2',
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    duration: '32:15',
    author: 'Michael Johnson'
  },
  {
    id: 'video-3',
    title: 'Introduction to Transformers',
    type: 'video',
    source: 'youtube',
    url: 'https://youtube.com/example3',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    duration: '55:00',
    author: 'Prof. Alex Wong'
  }
];

const VideoTutorials: React.FC = () => {
  const { progress, toggleSavedContent } = useProgress();
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Tutorials</h1>
            <p className="mt-2 text-gray-600">
              Learn deep learning concepts through comprehensive video tutorials.
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

        <ContentGrid
          items={videos}
          savedItems={progress.savedContent}
          onBookmark={toggleSavedContent}
        />
      </div>
    </div>
  );
};

export default VideoTutorials;