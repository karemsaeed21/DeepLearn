import { useState, useEffect , useCallback} from 'react';
import { UserProgress } from '../types';

// Mock function to simulate fetching from a real backend
const fetchProgress = (): Promise<UserProgress> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Try to get from localStorage first
      const savedProgress = localStorage.getItem('user-progress');
      
      if (savedProgress) {
        resolve(JSON.parse(savedProgress));
      } else {
        // Default initial state if nothing saved
        const initialProgress: UserProgress = {
          completedNodes: [],
          inProgressNodes: ['basics'],
          savedContent: [],
          completedSubNodes: {},
        };
        
        // Save to localStorage
        localStorage.setItem('user-progress', JSON.stringify(initialProgress));
        
        resolve(initialProgress);
      }
    }, 300);
  });
};

// Mock function to simulate saving to a real backend
const saveProgress = (progress: UserProgress): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('user-progress', JSON.stringify(progress));
      resolve();
    }, 300);
  });
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({
    completedNodes: [],
    inProgressNodes: [],
    savedContent: [],
    completedSubNodes: {},
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await fetchProgress();
        setProgress(data);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);


  const markNodeAsCompleted = async (nodeId: string) => {
    const updatedProgress = { ...progress };
    
    // Remove from inProgress if it's there
    updatedProgress.inProgressNodes = updatedProgress.inProgressNodes.filter(
      (id) => id !== nodeId
    );
    
    // Add to completed if not already there
    if (!updatedProgress.completedNodes.includes(nodeId)) {
      updatedProgress.completedNodes = [...updatedProgress.completedNodes, nodeId];
    }
    
    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
    
    return updatedProgress;
  };

  const markNodeAsInProgress = async (nodeId: string) => {
    const updatedProgress = { ...progress };
    
    // Only mark as in progress if not already completed
    if (!updatedProgress.completedNodes.includes(nodeId)) {
      // Add to inProgress if not already there
      if (!updatedProgress.inProgressNodes.includes(nodeId)) {
        updatedProgress.inProgressNodes = [...updatedProgress.inProgressNodes, nodeId];
      }
    }
    
    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
    
    return updatedProgress;
  };

  const markSubNodeAsCompleted = (nodeId: string, subtopicId: string) => {
    setProgress((prev) => {
      const completedSubNodes = { ...prev.completedSubNodes };

      // Check if the subtopic is already marked as completed
      if (completedSubNodes[nodeId]?.includes(subtopicId)) {
        // Remove the subtopic from the completed list
        completedSubNodes[nodeId] = completedSubNodes[nodeId].filter((id) => id !== subtopicId);

        // If the list becomes empty, delete the nodeId key
        if (completedSubNodes[nodeId].length === 0) {
          delete completedSubNodes[nodeId];
        }
      } else {
        // Add the subtopic to the completed list
        completedSubNodes[nodeId] = [...(completedSubNodes[nodeId] || []), subtopicId];
      }

      return {
        ...prev,
        completedSubNodes,
      };
    });
  };

  const toggleSavedContent = async (contentId: string) => {
    const updatedProgress = { ...progress };
    
    if (updatedProgress.savedContent.includes(contentId)) {
      // Remove from saved
      updatedProgress.savedContent = updatedProgress.savedContent.filter(
        (id) => id !== contentId
      );
    } else {
      // Add to saved
      updatedProgress.savedContent = [...updatedProgress.savedContent, contentId];
    }
    
    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
    
    return updatedProgress;
  };

  const resetProgress = async () => {
    const initialProgress: UserProgress = {
      completedNodes: [],
      inProgressNodes: ['basics'],
      savedContent: [],
      completedSubNodes: {},
    };
    
    setProgress(initialProgress);
    await saveProgress(initialProgress);
    
    return initialProgress;
  };

  return {
    progress,
    isLoading,
    markNodeAsCompleted,
    markNodeAsInProgress,
    markSubNodeAsCompleted,
    toggleSavedContent,
    resetProgress,
  };
};