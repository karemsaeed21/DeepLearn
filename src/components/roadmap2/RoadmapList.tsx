import React from 'react';
import { Step as StepType, Resource } from '../../types/index2';
import Step from './Step';

interface RoadmapListProps {
  steps: StepType[];
  activeStepId: string | null;
  onStepComplete: (id: string, completed: boolean) => void;
  onViewResources: (resources: Resource[]) => void;
  onViewSubRoadmap: (step: StepType) => void;
}

const RoadmapList: React.FC<RoadmapListProps> = ({
  steps,
  activeStepId,
  onStepComplete,
  onViewResources,
  onViewSubRoadmap,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {steps.map((step) => (
        <div 
          key={step.id} 
          className="transform transition-opacity duration-500 ease-in-out"
        >
          <Step
            step={step}
            isActive={activeStepId === step.id}
            onComplete={onStepComplete}
            onViewResources={onViewResources}
            onViewSubRoadmap={onViewSubRoadmap}
          />
        </div>
      ))}
    </div>
  );
};

export default RoadmapList;