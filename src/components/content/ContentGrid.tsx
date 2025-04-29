import React from 'react';
import { ContentItem } from '../../types';
import ContentCard from './ContentCard';

interface ContentGridProps {
  items: ContentItem[];
  savedItems?: string[];
  onBookmark?: (id: string) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  savedItems = [],
  onBookmark,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-gray-700">No content found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          isBookmarked={savedItems.includes(item.id)}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default ContentGrid;