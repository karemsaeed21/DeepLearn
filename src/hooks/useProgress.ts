import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

// Utility functions
const getFromLocalStorage = (key: string): any => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Simulate backend API delay
const fetchProgress = (): Promise<UserProgress> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = getFromLocalStorage('user-progress');
      if (saved) {
        resolve(saved);
      } else {
        const initialProgress: UserProgress = {
          completedNodes: [],
          inProgressNodes: ['basics'],
          savedContent: [],
          completedSubNodes: {},
        };
        setToLocalStorage('user-progress', initialProgress);
        resolve(initialProgress);
      }
    }, 300);
  });
};

const saveProgress = (progress: UserProgress): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setToLocalStorage('user-progress', progress);
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
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  const markNodeAsCompleted = async (nodeId: string) => {
    const updated = { ...progress };

    updated.inProgressNodes = updated.inProgressNodes.filter(id => id !== nodeId);

    if (!updated.completedNodes.includes(nodeId)) {
      updated.completedNodes.push(nodeId);
    }

    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  const markNodeAsInProgress = async (nodeId: string) => {
    const updated = { ...progress };

    if (!updated.completedNodes.includes(nodeId) && !updated.inProgressNodes.includes(nodeId)) {
      updated.inProgressNodes.push(nodeId);
    }

    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  const markSubNodeAsCompleted = async (nodeId: string, subNodeId: string) => {
    const updated = { ...progress };

    if (!updated.completedSubNodes[nodeId]) {
      updated.completedSubNodes[nodeId] = [];
    }

    if (!updated.completedSubNodes[nodeId].includes(subNodeId)) {
      updated.completedSubNodes[nodeId].push(subNodeId);
    }

    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  const toggleSavedContent = async (contentId: string) => {
    const updated = { ...progress };
    const isSaved = updated.savedContent.includes(contentId);

    updated.savedContent = isSaved
      ? updated.savedContent.filter(id => id !== contentId)
      : [...updated.savedContent, contentId];

    setProgress(updated);
    await saveProgress(updated);
    return updated;
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

  const markNodeAsIncomplete = async (nodeId: string) => {
    const updated = { ...progress };
    updated.completedNodes = updated.completedNodes.filter(id => id !== nodeId);
    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  return {
    progress,
    isLoading,
    markNodeAsCompleted,
    markNodeAsInProgress,
    markSubNodeAsCompleted,
    toggleSavedContent,
    resetProgress,
    markNodeAsIncomplete,
  };
};
