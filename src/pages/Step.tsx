import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { RoadmapNode } from '../types';
import ContentGrid from '../components/content/ContentGrid';
import Button from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';

const Step: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [currentNode, setCurrentNode] = useState<RoadmapNode | null>(null);
  const [nextNodes, setNextNodes] = useState<RoadmapNode[]>([]);
  const { progress, markNodeAsCompleted, markNodeAsInProgress, toggleSavedContent } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    // Find the current node
    if (nodeId) {
      const node = roadmapData.find((n) => n.id === nodeId);
      if (node) {
        setCurrentNode(node);
        
        // Mark as in progress if not already completed
        if (!progress.completedNodes.includes(nodeId)) {
          markNodeAsInProgress(nodeId);
        }
        
        // Find next nodes (nodes that depend on this one)
        const next = roadmapData.filter((n) => 
          n.dependencies.includes(nodeId)
        );
        setNextNodes(next);
      } else {
        // Node not found, redirect to roadmap
        navigate('/roadmap');
      }
    }
  }, [nodeId, markNodeAsInProgress, navigate, progress.completedNodes]);

  const handleComplete = () => {
    if (nodeId) {
      markNodeAsCompleted(nodeId);
    }
  };

  const handleBookmark = (contentId: string) => {
    toggleSavedContent(contentId);
  };

  if (!currentNode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isCompleted = nodeId ? progress.completedNodes.includes(nodeId) : false;

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <button 
            onClick={() => navigate('/roadmap')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roadmap
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Badge 
                  variant={currentNode.isEssential ? 'error' : 'info'} 
                  size="md"
                >
                  {currentNode.isEssential ? 'Essential' : 'Optional'}
                </Badge>
                <Badge variant="secondary" size="md" className="capitalize">
                  {currentNode.level}
                </Badge>
                {isCompleted && (
                  <Badge variant="success" size="md" className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{currentNode.title}</h1>
              <p className="mt-3 text-gray-600">{currentNode.description}</p>
            </div>
            {!isCompleted && (
              <Button 
                variant="primary" 
                onClick={handleComplete}
                className="flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>

          {/* Prerequisites */}
          {currentNode.dependencies.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {currentNode.dependencies.map(depId => {
                  const depNode = roadmapData.find(n => n.id === depId);
                  return depNode ? (
                    <button
                      key={depId}
                      onClick={() => navigate(`/step/${depId}`)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        progress.completedNodes.includes(depId)
                          ? 'bg-green-100 text-green-800'
                          : progress.inProgressNodes.includes(depId)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {depNode.title}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
          
          <ContentGrid 
            items={currentNode.content}
            savedItems={progress.savedContent}
            onBookmark={handleBookmark}
          />
        </div>

        {/* What's Next */}
        {nextNodes.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextNodes.map((node) => (
                <div 
                  key={node.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/step/${node.id}`)}
                >
                  <h3 className="font-bold text-gray-900">{node.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge 
                        variant={node.isEssential ? 'error' : 'info'} 
                        size="sm"
                      >
                        {node.isEssential ? 'Essential' : 'Optional'}
                      </Badge>
                      <Badge variant="secondary" size="sm" className="capitalize">
                        {node.level}
                      </Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step;