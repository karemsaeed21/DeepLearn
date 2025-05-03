import React from 'react';
import { X, ExternalLink, Video, BookOpen, GraduationCap, PenTool as Tool } from 'lucide-react';
import { Resource } from '../../types/index';
import Button from '../ui/Button';

interface ResourcesModalProps {
  resources: Resource[];
  onClose: () => void;
}

const ResourcesModal: React.FC<ResourcesModalProps> = ({ resources, onClose }) => {
  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video size={18} />;
      case 'article':
        return <ExternalLink size={18} />;
      case 'book':
        return <BookOpen size={18} />;
      case 'course':
        return <GraduationCap size={18} />;
      case 'tool':
        return <Tool size={18} />;
      default:
        return <ExternalLink size={18} />;
    }
  };

  const getResourceTypeLabel = (type: Resource['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-modalIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Learning Resources</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
          <ul className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <li key={resource.id} className="py-4 first:pt-0 last:pb-0">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors"
                >
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3
                    ${resource.type === 'video' ? 'bg-red-100 text-red-600' : ''}
                    ${resource.type === 'article' ? 'bg-blue-100 text-blue-600' : ''}
                    ${resource.type === 'book' ? 'bg-amber-100 text-amber-600' : ''}
                    ${resource.type === 'course' ? 'bg-purple-100 text-purple-600' : ''}
                    ${resource.type === 'tool' ? 'bg-green-100 text-green-600' : ''}
                  `}>
                    {getResourceTypeIcon(resource.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 mb-1 flex items-center">
                      {resource.title}
                    </h4>
                    <div className="flex items-center text-xs">
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${resource.type === 'video' ? 'bg-red-100 text-red-800' : ''}
                        ${resource.type === 'article' ? 'bg-blue-100 text-blue-800' : ''}
                        ${resource.type === 'book' ? 'bg-amber-100 text-amber-800' : ''}
                        ${resource.type === 'course' ? 'bg-purple-100 text-purple-800' : ''}
                        ${resource.type === 'tool' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {getResourceTypeLabel(resource.type)}
                      </span>
                      <span className="ml-2 text-gray-500">{new URL(resource.url).hostname}</span>
                    </div>
                  </div>
                  
                  <ExternalLink size={16} className="flex-shrink-0 text-gray-400 ml-2" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesModal;