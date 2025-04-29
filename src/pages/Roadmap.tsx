import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import RoadmapTree from '../components/roadmap/RoadmapTree';
import { useProgress } from '../hooks/useProgress';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import Button from '../components/ui/Button';
import { ArrowRight, Filter, RotateCcw } from 'lucide-react';

const Roadmap: React.FC = () => {
  const { progress, isLoading, markNodeAsInProgress, resetProgress } = useProgress();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    level: {
      beginner: true,
      intermediate: true,
      advanced: true,
    },
    isEssential: {
      essential: true,
      optional: true,
    },
  });
  const navigate = useNavigate();

  const handleNodeClick = (nodeId: string) => {
    markNodeAsInProgress(nodeId);
    navigate(`/step/${nodeId}`);
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category as keyof typeof filters],
        [value]: !filters[category as keyof typeof filters][value as keyof typeof filters[keyof typeof filters]],
      },
    });
  };

  // Apply filters to roadmap data
  const filteredData = roadmapData.filter((node) => {
    return (
      filters.level[node.level as keyof typeof filters.level] &&
      filters.isEssential[node.isEssential ? 'essential' : 'optional']
    );
  });

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
      resetProgress();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deep Learning Roadmap</h1>
            <p className="mt-2 text-gray-600">
              Your structured path to mastering deep learning, from fundamentals to advanced concepts.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleResetProgress}
              className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Difficulty Level</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.level.beginner}
                      onChange={() => handleFilterChange('level', 'beginner')}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Beginner</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.level.intermediate}
                      onChange={() => handleFilterChange('level', 'intermediate')}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.level.advanced}
                      onChange={() => handleFilterChange('level', 'advanced')}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Advanced</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Content Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isEssential.essential}
                      onChange={() => handleFilterChange('isEssential', 'essential')}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Essential Topics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isEssential.optional}
                      onChange={() => handleFilterChange('isEssential', 'optional')}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">Optional Topics</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:mr-8 mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Learning Progress</h2>
              <p className="text-gray-600 text-sm">
                Track your journey through deep learning concepts.
              </p>
            </div>
            <div className="w-full md:w-64">
              <ProgressIndicator
                totalSteps={roadmapData.length}
                completedSteps={progress.completedNodes.length}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <div className="min-w-[1000px]">
            <RoadmapTree
              nodes={filteredData}
              completedNodes={progress.completedNodes}
              inProgressNodes={progress.inProgressNodes}
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Not sure where to start? We recommend beginning with the fundamentals.
          </p>
          <Button variant="primary" className="inline-flex items-center">
            <span>Go to Fundamentals</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;