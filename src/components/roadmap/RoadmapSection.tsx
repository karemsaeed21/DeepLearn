import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';

const RoadmapSection: React.FC<{ roadmap: any }> = ({ roadmap }) => {
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleLevel = (level: string) => {
    setExpandedLevel((prev) => (prev === level ? null : level));
    setExpandedTopic(null); // Reset expanded topic when switching levels
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopic((prev) => (prev === topicId ? null : topicId));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Roadmap for This Step</h2>
      <div className="space-y-6">
        {roadmap.map((level: any) => (
          <div key={level.level}>
            {/* Level Header */}
            <button
              onClick={() => toggleLevel(level.level)}
              className="flex justify-between items-center w-full text-left text-gray-800 font-semibold text-xl"
            >
              {level.level.charAt(0).toUpperCase() + level.level.slice(1)}
              {expandedLevel === level.level ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {/* Topics for the Level */}
            <AnimatePresence>
              {expandedLevel === level.level && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <ul className="space-y-4">
                    {level.topics.map((topic: any) => (
                      <li key={topic.id}>
                        {/* Topic Header */}
                        <button
                          onClick={() => toggleTopic(topic.id)}
                          className="flex justify-between items-center w-full text-left text-gray-700 font-medium"
                        >
                          <div className="flex items-center space-x-2">
                            {topic.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                            ) : topic.status === 'current' ? (
                              <Circle className="h-5 w-5 text-indigo-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                            )}
                            <span>{topic.title}</span>
                          </div>
                          {expandedTopic === topic.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {/* Subtopics */}
                        <AnimatePresence>
                          {expandedTopic === topic.id && topic.subtopics && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-8 mt-2 space-y-2 text-gray-600"
                            >
                              {topic.subtopics.map((subtopic: string, index: number) => (
                                <li key={index} className="list-disc">
                                  {subtopic}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapSection;