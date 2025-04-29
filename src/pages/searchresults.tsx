import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  // Mock data for demonstration
  const allContent = [
    { id: 1, title: 'Understanding Neural Networks', type: 'article', path: '/articles' },
    { id: 2, title: 'Deep Learning Basics', type: 'video', path: '/video-tutorials' },
    { id: 3, title: 'Python for Data Science', type: 'book', path: '/books' }
  ];

  const filteredContent = allContent.filter((item) =>
    item.title.toLowerCase().includes(query?.toLowerCase() || '')
  );

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      {filteredContent.length > 0 ? (
        <ul className="space-y-4">
          {filteredContent.map((item) => (
            <li key={item.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <Link
                to={item.path}
                className="text-indigo-600 hover:underline font-medium"
              >
                {item.title}
              </Link>
              <p className="text-sm text-gray-600">Type: {item.type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;