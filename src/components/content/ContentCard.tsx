import React from 'react';
import { ContentItem } from '../../types';
import Card, { CardBody, CardFooter } from '../ui/Card';
import { Book, Video, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';


interface ContentCardProps {
  item: ContentItem;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  isBookmarked = false,
  onBookmark,
}) => {
  const getIcon = () => {
    switch (item.type) {
      case 'article':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'book':
        return <Book className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSourceLabel = () => {
    switch (item.source) {
      case 'medium':
        return 'Medium';
      case 'youtube':
        return 'YouTube';
      case 'internal':
        return 'DeepLearn';
      case 'external':
        return 'External';
      default:
        return 'Source';
    }
  };

  const getSourceClass = () => {
    switch (item.source) {
      case 'medium':
        return 'bg-black text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      case 'internal':
        return 'bg-indigo-600 text-white';
      case 'external':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  const handleClick = () => {
    if (item.source === 'internal') {
      // Internal content, use router
      return;
    } else {
      // External content, open in new tab
      window.open(item.url, '_blank');
    }
  };

  return (
    <Card 
      hoverable 
      className="h-full flex flex-col transition-all duration-300 group"
    >
      {item.thumbnail && (
        <div className="relative overflow-hidden h-40">
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getSourceClass()}`}>
            {getSourceLabel()}
          </div>
          {item.type === 'video' && item.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {item.duration}
            </div>
          )}
        </div>
      )}
      
      <CardBody className="flex-grow">
        <div className="flex items-center mb-3">
          {getIcon()}
          <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
            {item.type}
          </span>
        </div>
        
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700">
          {item.source === 'internal' ? (
            <Link to={`/content/${item.id}`}>{item.title}</Link>
          ) : (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {item.title}
            </a>
          )}
        </h3>
        
        {item.content && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {item.content.slice(0, 150)}...
          </p>
        )}
      </CardBody>
      
      <CardFooter className="flex items-center justify-between text-xs text-gray-500">
        {item.author && (
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {item.author}
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark && onBookmark(item.id);
          }}
          className={`p-2 rounded-full ${
            isBookmarked 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isBookmarked ? '0' : '1.5'}
          >
            <path
              fillRule="evenodd"
              d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;