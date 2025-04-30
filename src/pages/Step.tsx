import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { RoadmapNode, SubRoadmapNode } from '../types';
import ContentGrid from '../components/content/ContentGrid';
import Button from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, Circle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const Step: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [currentNode, setCurrentNode] = useState<RoadmapNode | null>(null);
  const [nextNodes, setNextNodes] = useState<RoadmapNode[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const { progress, markNodeAsCompleted, markNodeAsInProgress, toggleSavedContent, markSubNodeAsCompleted } = useProgress();
  const navigate = useNavigate();

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

  const handleBookmark = (contentId: string) => {
    toggleSavedContent(contentId);
  };

  const toggleLevel = (level: string) => {
    setExpandedLevel((prev) => (prev === level ? null : level));
    setExpandedTopic(null);
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopic((prev) => (prev === topicId ? null : topicId));
  };

  const handleSubtopicToggle = (nodeId: string, subtopicId: string) => {
    markSubNodeAsCompleted(nodeId, subtopicId);
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
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roadmap
          </button>
        </div>

        {/* Node Header */}
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
        </div>

        {/* Roadmap Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Roadmap for This Step</h2>
          <div className="space-y-4">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
              const topics = currentNode.roadmap?.[level] || []; // Ensure topics is an array
              const levelProgress = topics.reduce((acc: number, topic: SubRoadmapNode) => {
                return acc + (progress.completedNodes.includes(topic.id) ? 1 : 0);
              }, 0);
              const totalTopics = topics.length;
              const progressPercentage = totalTopics > 0 ? (levelProgress / totalTopics) * 100 : 0;

              return (
                <div key={level} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gradient-to-r from-gray-50 to-white">
                  {/* Level Header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    aria-expanded={expandedLevel === level}
                    className={`flex justify-between items-center w-full text-left px-6 py-4 transition-all duration-300 ${
                      expandedLevel === level 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                        : 'bg-transparent text-gray-900 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-10 h-10">
                        <svg className="absolute inset-0 w-full h-full text-gray-200" viewBox="0 0 36 36">
                          <circle
                            className="stroke-current"
                            strokeWidth="2"
                            fill="none"
                            cx="18"
                            cy="18"
                            r="16"
                          />
                        </svg>
                        <svg
                          className="absolute inset-0 w-full h-full text-indigo-600"
                          viewBox="0 0 36 36"
                          style={{ transform: 'rotate(-90deg)' }}
                        >
                          <circle
                            className="stroke-current"
                            strokeWidth="2"
                            fill="none"
                            cx="18"
                            cy="18"
                            r="16"
                            strokeDasharray="100"
                            strokeDashoffset={100 - progressPercentage}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-lg font-medium capitalize">{level}</span>
                        <p className="text-sm text-gray-500">{totalTopics} topics</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedLevel === level ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    </motion.div>
                  </button>

                  {/* Topics for the Level */}
                  <AnimatePresence>
                    {expandedLevel === level && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white"
                      >
                        <ul className="divide-y divide-gray-100">
                          {topics.map((topic) => {
                            const subtopics = topic.subtopics || [];
                            const completedSubtopicsCount = subtopics.filter((sub) =>
                              progress.completedSubNodes[topic.id]?.includes(sub.id)
                            ).length;
                            const subtopicProgress = subtopics.length > 0
                              ? (completedSubtopicsCount / subtopics.length) * 100
                              : 0;

                            return (
                              <li
                                key={topic.id}
                                className="px-6 py-4 hover:bg-indigo-50 transition-all duration-200"
                              >
                                <button
                                  onClick={() => toggleTopic(topic.id)}
                                  aria-expanded={expandedTopic === topic.id}
                                  className="flex justify-between items-center w-full text-left text-gray-800 font-medium"
                                >
                                  <div className="flex items-center space-x-3">
                                    <motion.div
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Circle
                                        className={`h-5 w-5 ${
                                          progress.completedNodes.includes(topic.id)
                                            ? 'text-green-500 fill-green-500'
                                            : 'text-indigo-500'
                                        }`}
                                      />
                                    </motion.div>
                                    <div>
                                      <span className="text-base">{topic.title}</span>
                                      {subtopics.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                          {Math.round(subtopicProgress)}% complete ({completedSubtopicsCount}/{subtopics.length})
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: expandedTopic === topic.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  </motion.div>
                                </button>
                                {expandedTopic === topic.id && subtopics.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-3 pl-8"
                                  >
                                    {renderSubtopics(subtopics, (subId) => handleSubtopicToggle(topic.id, subId), progress.completedSubNodes[topic.id] || [])}
                                  </motion.div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
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

const renderSubtopics = (
  subtopics: SubRoadmapNode[],
  onToggle: (nodeId: string, subtopicId: string) => void,
  completedSubtopics: string[],
  depth: number = 0
) => {
  return (
    <ul className="space-y-2">
      {subtopics.map((subtopic) => (
        <li
          key={subtopic.id}
          className={`flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 ${
            depth > 0 ? 'ml-4' : ''
          }`}
        >
          <button
            onClick={() => onToggle(subtopic.nodeId, subtopic.id)} // Pass both nodeId and subtopicId
            className="relative flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200 ${
                completedSubtopics.includes(subtopic.id)
                  ? 'bg-green-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {completedSubtopics.includes(subtopic.id) && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
          </button>
          <div className="flex-1">
            <span
              className={`text-sm ${
                completedSubtopics.includes(subtopic.id)
                  ? 'text-gray-500 line-through'
                  : 'text-gray-700'
              } group-hover:text-indigo-600 transition-colors duration-200`}
            >
              {subtopic.title}
            </span>
            {subtopic.subtopics && subtopic.subtopics.length > 0 && (
              <div className="mt-2">
                {renderSubtopics(
                  subtopic.subtopics,
                  onToggle,
                  completedSubtopics,
                  depth + 1
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Step;

// import React, { useState } from 'react';
// // import { ArrowLeftRight, CheckCircle, Trophy } from 'lucide-react';
// import { 
//   sampleRoadmap, 
//   updateStepProgress, 
//   updateStepCompletion 
// } from '../services/roadmapData2';
// import { Resource } from '../types/index2';
// import { Step } from '../types/index2';
// import RoadmapList from '../components/roadmap2/RoadmapList';
// import SubRoadmap from '../components/roadmap2/SubRoadmap';
// import ResourcesModal from '../components/roadmap2/ResourcesModal';
// import ProgressBar from '../components/ui2/ProgressBar';

// const App: React.FC = () => {
  
//   const [roadmap, setRoadmap] = useState(sampleRoadmap);
//   const [activeSection ] = useState(roadmap.sections[0].id);
//   const [activeStepId, setActiveStepId] = useState<string | null>(null);
//   const [viewingStep, setViewingStep] = useState<Step | null>(null);
//   const [viewingResources, setViewingResources] = useState<Resource[] | null>(null);
  
//   // Functions to handle step interactions
//   const handleStepComplete = (id: string, completed: boolean) => {
//     setRoadmap(updateStepCompletion(roadmap, id, completed));
//   };
  
//   const handleUpdateProgress = (id: string, progress: number) => {
//     setRoadmap(updateStepProgress(roadmap, id, progress));
//   };
  
//   const handleViewSubRoadmap = (step: Step) => {
//     setViewingStep(step);
//     setActiveStepId(step.id);
//   };
  
//   const handleViewResources = (resources: Resource[]) => {
//     setViewingResources(resources);
//   };
  
//   const handleBackToRoadmap = () => {
//     setViewingStep(null);
//   };
  
//   const handleCloseResourcesModal = () => {
//     setViewingResources(null);
//   };
  
  
//   const currentSection = roadmap.sections.find(section => section.id === activeSection)!;
  
//   // Add animation classes
//   const fadeInUpStyles = "animate-fadeInUp";
  

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">

      
//       <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
//         {viewingResources && (
//           <ResourcesModal 
//             resources={viewingResources} 
//             onClose={handleCloseResourcesModal} 
//           />
//         )}
        
        
//         {!viewingStep ? (
//           <>
            
//             {/* Section Content */}
//             <div className={fadeInUpStyles}>
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
//                     <p className="text-gray-600">{currentSection.description}</p>
//                   </div>
//                   <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-sm border border-gray-200">
//                     <span className="text-gray-500 text-sm">Progress:</span>
//                     <span className="text-blue-600 font-semibold">{currentSection.progress}%</span>
//                   </div>
//                 </div>
                
//                 <ProgressBar 
//                   value={currentSection.progress} 
//                   size="md" 
//                   color="primary"
//                   className="mb-8"
//                 />
//               </div>
              
//               {/* Roadmap Steps */}
//               <RoadmapList
//                 steps={currentSection.steps}
//                 activeStepId={activeStepId}
//                 onStepComplete={handleStepComplete}
//                 onViewResources={handleViewResources}
//                 onViewSubRoadmap={handleViewSubRoadmap}
//               />
//             </div>
//           </>
//         ) : (
//           <SubRoadmap
//             mainStep={viewingStep}
//             onBack={handleBackToRoadmap}
//             onUpdateProgress={handleUpdateProgress}
//             onCompleteStep={handleStepComplete}
//           />
//         )}
//       </main>
      

//     </div>
//   );
// };

// export default App;