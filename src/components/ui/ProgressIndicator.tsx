import React from 'react';

interface ProgressIndicatorProps {
  totalSteps: number;
  completedSteps: number;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  completedSteps,
  className = '',
}) => {
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          Progress
        </span>
        <span className="text-sm font-medium text-indigo-600">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {completedSteps} of {totalSteps} steps completed
      </div>
    </div>
  );
};

export default ProgressIndicator;