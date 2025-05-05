import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { RoadmapNode } from '../types/index';
import ContentGrid from '../components/content/ContentGrid';
import Button from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, ArrowRight, CheckCircle} from 'lucide-react';
import Badge from '../components/ui/Badge';
import ResourcesModal from '../components/roadmap/ResourcesModal';
import { Resource } from '../types/index';
import type { Step } from '../types/index';
import { sampleRoadmap, updateStepCompletion , updateStepProgress } from '../data/roadmapData';
import ProgressBar from '../components/ui/ProgressBar';
import RoadmapList from '../components/roadmap/RoadmapList';
import SubRoadmap from '../components/roadmap/SubRoadmap';




const Step: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [currentNode, setCurrentNode] = useState<RoadmapNode | null>(null);
  const [nextNodes, setNextNodes] = useState<RoadmapNode[]>([]);
  const { progress, markNodeAsCompleted, markNodeAsInProgress, toggleSavedContent } = useProgress();
  const navigate = useNavigate();
  const [viewingResources, setViewingResources] = useState<Resource[] | null>(null);
  const [viewingStep , setViewingStep] = useState<Step | null>(null);
  const [roadmap , setRoadmap] = useState(sampleRoadmap);
  const [activeStepId , setActiveStepId] = useState<string | null>(null);


  useEffect(() => {
    if (nodeId) {
      const node = roadmapData.find((n) => n.id === nodeId);
      if (node) {
        setCurrentNode(node);

        if (!progress.completedNodes.includes(nodeId)) {
          markNodeAsInProgress(nodeId);
        }

        const next = roadmapData.filter((n) => n.dependencies.includes(nodeId));
        setNextNodes(next);
      } else {
        navigate('/roadmap');
      }
    }
  }, [nodeId, markNodeAsInProgress, navigate, progress.completedNodes]);

  const handleComplete = () => {
    if (nodeId) {
      markNodeAsCompleted(nodeId);
    }
  };
  const fadeInUpStyles = "animate-fadeInUp";
  const handleBookmark = (contentId: string) => {
    toggleSavedContent(contentId);
  };
  const handleBackToRoadmap = () => {
    setViewingStep(null);
  };
  const handleUpdateProgress = (id: string, progress: number) => {
    setRoadmap(updateStepProgress(roadmap, id, progress));
  };
  const handleCloseResourcesModal = () => {
    setViewingResources(null);
  };
  // Functions to handle step interactions
  const handleStepComplete = (id: string, completed: boolean) => {
    setRoadmap(updateStepCompletion(roadmap, id, completed));
  };
  
  const handleViewSubRoadmap = (step: Step) => {
    setViewingStep(step);
    setActiveStepId(step.id);
  };
  
  const handleViewResources = (resources: Resource[]) => {
    setViewingResources(resources);
  };

  if (!currentNode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isCompleted = nodeId ? progress.completedNodes.includes(nodeId) : false;
  let currentSection;

  if (nodeId === 'basics') {
    currentSection = roadmap.sections[0]; // Use section[1] for 'basics'
  } else if (nodeId === 'neural-networks') {
    currentSection = roadmap.sections[1]; // Use section[2] for 'neural-networks'
  } else if (nodeId === 'cnn'){
    currentSection = roadmap.sections[2]; // Use section[3] for 'cnn'
  }else if (nodeId === 'rnn'){
    currentSection = roadmap.sections[3]; // Use section[3] for 'cnn'
  }
  else if (nodeId === 'transformer'){
    currentSection = roadmap.sections[4]; // Use section[3] for 'cnn'
  } else if (nodeId === 'rl'){
    currentSection = roadmap.sections[5]; // Use section[3] for 'cnn'
  }else{
    currentSection = roadmap.sections[6]; 
  }
  if (!currentSection) {
    console.error('No section found for node ID:', nodeId);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No roadmap section found for this node.</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-8xl mx-auto">
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
                <Badge variant={currentNode.isEssential ? 'error' : 'info'} size="md">
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
              <Button variant="primary" onClick={handleComplete} className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
          {/* Prerequisites Section */}
          {currentNode.dependencies && currentNode.dependencies.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Prerequisites</h3>
              <div className="flex flex-wrap gap-3">
                {currentNode.dependencies.map((dependencyId) => {
                  const dependencyNode = roadmapData.find((node) => node.id === dependencyId);
                  return (
                    <button
                      key={dependencyId}
                      onClick={() => navigate(`/step/${dependencyId}`)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full shadow-sm hover:bg-indigo-200 hover:text-indigo-800 transition"
                    >
                      {dependencyNode ? dependencyNode.title : 'Unknown Prerequisite'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Roadmap Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Roadmap</h2>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
              {viewingResources && (
                <ResourcesModal 
                  resources={viewingResources} 
                  onClose={handleCloseResourcesModal} 
                />
              )}

              {!viewingStep ? (
                <>
            
                {/* Section Content */}
                <div className={fadeInUpStyles}>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                        <p className="text-gray-600">{currentSection.description}</p>
                      </div>
                      <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-sm border border-gray-200">
                        <span className="text-gray-500 text-sm">Progress:</span>
                        <span className="text-blue-600 font-semibold">{currentSection.progress}%</span>
                      </div>
                    </div>
                        <ProgressBar 
                          value={currentSection.progress} 
                          size="md" 
                          color="primary"
                          className="mb-8"
                        />
                      </div>
                        {/* Roadmap Steps */}
                        <RoadmapList
                          steps={currentSection.steps}
                          activeStepId={activeStepId}
                          onStepComplete={handleStepComplete}
                          onViewResources={handleViewResources}
                          onViewSubRoadmap={handleViewSubRoadmap}
                        />
                      </div>
                    </>
                ): (
                  <SubRoadmap
                    mainStep={viewingStep}
                    onBack={handleBackToRoadmap}
                    onUpdateProgress={handleUpdateProgress}
                    onCompleteStep={handleStepComplete}
                  />
                )}

            </main>
        </div>

        {/* Learning Resources Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
          <ContentGrid
            items={currentNode.content}
            savedItems={progress.savedContent}
            onBookmark={handleBookmark}
          />
        </div>

        {/* What's Next Section */}
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
                      <Badge variant={node.isEssential ? 'error' : 'info'} size="sm">
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

const renderSubtopics = (subtopics: any[]) => {
  return (
    <ul className="pl-8 mt-2 space-y-2 text-gray-600">
      {subtopics.map((subtopic) => (
        <li key={subtopic.id} className="list-disc">
          <div className="font-medium">{subtopic.title}</div>
          {subtopic.subtopics && renderSubtopics(subtopic.subtopics)}
        </li>
      ))}
    </ul>
  );
}; 
export default Step;