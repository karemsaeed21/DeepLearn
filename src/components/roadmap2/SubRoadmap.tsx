import React, { useState} from 'react';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { Step as StepType } from '../../types';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui2/Card';
import Button from '../ui2/Button';
import ProgressBar from '../ui2/ProgressBar';
import Badge from '../ui2/Badge';

interface SubRoadmapProps {
  mainStep: StepType;
  onBack: () => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onCompleteStep: (id: string, completed: boolean) => void;
}

const SubRoadmap: React.FC<SubRoadmapProps> = ({
  mainStep,
  onBack,
  onUpdateProgress,
  onCompleteStep,
}) => {
  const [subSteps, setSubSteps] = useState<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>([
    {
      id: `${mainStep.id}-sub-1`,
      title: 'Understanding the Basics',
      description: 'Learn fundamental concepts',
      completed: mainStep.progress >= 25,
    },
    {
      id: `${mainStep.id}-sub-2`,
      title: 'Intermediate Concepts',
      description: 'Build on your foundation',
      completed: mainStep.progress >= 50,
    },
    {
      id: `${mainStep.id}-sub-3`,
      title: 'Advanced Techniques',
      description: 'Master complex topics',
      completed: mainStep.progress >= 75,
    },
    {
      id: `${mainStep.id}-sub-4`,
      title: 'Practical Application',
      description: 'Apply your knowledge',
      completed: mainStep.progress >= 100,
    },
  ]);

  const handleSubStepComplete = (id: string, completed: boolean) => {
    setSubSteps(prev => 
      prev.map(step => 
        step.id === id ? { ...step, completed } : step
      )
    );
    
    const updatedSubSteps = subSteps.map(step => 
      step.id === id ? { ...step, completed } : step
    );
    const completedCount = updatedSubSteps.filter(s => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSubSteps.length) * 100);
    
    onUpdateProgress(mainStep.id, newProgress);
    
    if (newProgress === 100) {
      onCompleteStep(mainStep.id, true);
    } else if (mainStep.completed && newProgress < 100) {
      onCompleteStep(mainStep.id, false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Roadmap
        </Button>
        
        <h2 className="text-xl font-bold text-gray-900 ml-2">
          {mainStep.title} - Sub Roadmap
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>{mainStep.title}</CardTitle>
            <Badge variant={mainStep.completed ? 'success' : 'primary'}>
              {mainStep.completed ? 'Completed' : `${mainStep.progress}% Complete`}
            </Badge>
          </div>
          <CardDescription>{mainStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-700">{mainStep.progress}%</span>
            </div>
            <ProgressBar 
              value={mainStep.progress} 
              color={mainStep.completed ? 'success' : 'primary'} 
              size="lg"
              animate={true}
            />
          </div>
          
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Journey</h3>
            
            <div className="relative">
              <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200 z-0"></div>
              
              <div className="space-y-8">
                {subSteps.map((subStep, index) => (
                  <div key={subStep.id} className={`
                    relative flex items-start gap-4 transition-all duration-500
                    ${subStep.completed ? 'opacity-100' : 'opacity-70'}
                    transform ${subStep.completed ? 'translate-x-2' : 'translate-x-0'}
                  `}>
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full z-10 flex items-center justify-center
                      transition-all duration-300
                      ${subStep.completed 
                        ? 'bg-green-100 text-green-600 ring-4 ring-green-50' 
                        : 'bg-blue-100 text-blue-600 ring-4 ring-blue-50'}
                    `}>
                      {subStep.completed 
                        ? <CheckCircle2 size={24} /> 
                        : <span className="text-lg font-bold">{index + 1}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`
                        bg-white rounded-lg p-4 border transition-all duration-300
                        ${subStep.completed ? 'border-green-200 shadow-sm' : 'border-gray-200 shadow-sm'}
                        hover:shadow-md
                      `}>
                        <h4 className="text-base font-semibold text-gray-900 mb-1">{subStep.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{subStep.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <Badge 
                            variant={subStep.completed ? 'success' : 'default'}
                            className="font-normal"
                          >
                            {subStep.completed ? 'Completed' : 'Not Completed'}
                          </Badge>
                          
                          <Button
                            variant={subStep.completed ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => handleSubStepComplete(subStep.id, !subStep.completed)}
                          >
                            {subStep.completed ? 'Undo' : 'Complete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {mainStep.resources.length > 0 && (
              <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  Learning Resources
                </h3>
                <ul className="space-y-2">
                  {mainStep.resources.map(resource => (
                    <li key={resource.id} className="flex items-center">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        </span>
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubRoadmap;