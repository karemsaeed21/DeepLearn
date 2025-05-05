import React from 'react';
import { RoadmapNode as RoadmapNodeType } from '../../types';
import Badge from '../ui/Badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoadmapNodeProps {
  node: RoadmapNodeType;
  isCompleted: boolean;
  isInProgress: boolean;
  onClick: (nodeId: string) => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  node,
  isCompleted,
  isInProgress,
  onClick,
}) => {
  const getStatusClasses = () => {
    if (isCompleted) return 'border-green-500 bg-green-50';
    if (isInProgress) return 'border-blue-500 bg-blue-50';
    return 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 shadow-sm transition-all duration-300 ${getStatusClasses()}`}
      style={{
        minWidth: '200px', // Minimum width for the card
        maxWidth: '400px', // Maximum width for the card
        height: '180px', // Fixed height for the card
        overflow: 'hidden', // Prevent content overflow
        whiteSpace: 'normal', // Allow text to wrap
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900">{node.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{node.description}</p>
        </div>
      </div>

      <div className="flex mt-3 space-x-2">
        <Badge variant={node.isEssential ? 'error' : 'info'} size="sm">
          {node.isEssential ? 'Essential' : 'Optional'}
        </Badge>
        <Badge variant="secondary" size="sm">
          {node.level}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Link
          to={`/step/${node.id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onClick(node.id);
          }}
        >
          View
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RoadmapNode;