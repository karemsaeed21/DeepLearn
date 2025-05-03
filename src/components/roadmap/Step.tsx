import React, { useState } from 'react';
import { Check, ChevronRight, BookOpen, Video, ExternalLink, GraduationCap, PenTool as Tool } from 'lucide-react';
import { Step as StepType, Resource } from '../../types/index';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card2';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';

interface StepProps {
  step: StepType;
  isActive: boolean;
  onComplete: (id: string, completed: boolean) => void;
  onViewResources: (resources: Resource[]) => void;
  onViewSubRoadmap: (step: StepType) => void;
}

const Step: React.FC<StepProps> = ({
  step,
  isActive,
  onComplete,
  onViewResources,
  onViewSubRoadmap,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video size={16} />;
      case 'article':
        return <ExternalLink size={16} />;
      case 'book':
        return <BookOpen size={16} />;
      case 'course':
        return <GraduationCap size={16} />;
      case 'tool':
        return <Tool size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  return (
    <Card 
      highlight={isActive}
      className={`
        transform transition-all duration-300
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${step.completed ? 'border-l-4 border-green-500' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{step.title}</CardTitle>
          <Badge variant={step.completed ? 'success' : 'primary'}>
            {step.completed ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{step.progress}%</span>
          </div>
          <ProgressBar 
            value={step.progress} 
            color={step.completed ? 'success' : 'primary'} 
            size="md"
          />
        </div>
        
        {step.resources.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Resources</h4>
            <ul className="space-y-1">
              {step.resources.slice(0, 3).map((resource) => (
                <li key={resource.id} className="flex items-center text-sm">
                  <span className="mr-2 text-gray-500">{getResourceTypeIcon(resource.type)}</span>
                  <span className="truncate text-gray-700">{resource.title}</span>
                </li>
              ))}
              {step.resources.length > 3 && (
                <li className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => onViewResources(step.resources)}>
                  +{step.resources.length - 3} more resources
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button
          variant={step.completed ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onComplete(step.id, !step.completed)}
          className="flex items-center"
        >
          {step.completed ? (
            <>
              <Check size={16} className="mr-1" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewSubRoadmap(step)}
          className="flex items-center"
        >
          View Details
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Step;