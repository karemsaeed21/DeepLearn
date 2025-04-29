// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { BookOpen, Star, BookmarkPlus, ChevronDown, ChevronUp } from 'lucide-react';
// import { useProgress } from '../hooks/useProgress';

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   level: 'Beginner' | 'Intermediate' | 'Advanced';
//   category: string;
//   rating: number;
//   cover: string;
//   link: string;
// }

// const books: Book[] = [
//   {
//     id: 'book-1',
//     title: 'Deep Learning',
//     author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
//     description: 'The definitive textbook on deep learning. Comprehensive and rigorous, covering the mathematical foundations and latest techniques.',
//     level: 'Advanced',
//     category: 'Fundamentals',
//     rating: 4.8,
//     cover: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
//     link: 'https://www.deeplearningbook.org/'
//   },
//   {
//     id: 'book-2',
//     title: 'Hands-On Machine Learning',
//     author: 'Aurélien Géron',
//     description: 'A practical guide to machine learning and deep learning using Scikit-Learn and TensorFlow, with hands-on projects and code examples.',
//     level: 'Intermediate',
//     category: 'Practical',
//     rating: 4.9,
//     cover: 'https://images.pexels.com/photos/4553029/pexels-photo-4553029.jpeg',
//     link: '#'
//   },
//   {
//     id: 'book-3',
//     title: 'Python Machine Learning',
//     author: 'Sebastian Raschka, Vahid Mirjalili',
//     description: 'Learn how to build powerful machine learning models using Python and scikit-learn, with a focus on practical applications.',
//     level: 'Beginner',
//     category: 'Practical',
//     rating: 4.6,
//     cover: 'https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg',
//     link: '#'
//   },
//   {
//     id: 'book-4',
//     title: 'Neural Networks and Deep Learning',
//     author: 'Michael Nielsen',
//     description: 'A free online book that explains neural networks in a clear, accessible way with interactive examples.',
//     level: 'Beginner',
//     category: 'Fundamentals',
//     rating: 4.7,
//     cover: 'https://images.pexels.com/photos/5862277/pexels-photo-5862277.jpeg',
//     link: 'http://neuralnetworksanddeeplearning.com/'
//   },
//   {
//     id: 'book-5',
//     title: 'Pattern Recognition and Machine Learning',
//     author: 'Christopher Bishop',
//     description: 'A comprehensive introduction to machine learning, covering both theoretical foundations and practical applications.',
//     level: 'Advanced',
//     category: 'Fundamentals',
//     rating: 4.5,
//     cover: 'https://images.pexels.com/photos/1560093/pexels-photo-1560093.jpeg',
//     link: '#'
//   },
//   {
//     id: 'book-6',
//     title: 'Deep Learning with Python',
//     author: 'François Chollet',
//     description: 'A practical guide to deep learning with Keras, written by the creator of Keras. Focuses on practical applications with code examples.',
//     level: 'Intermediate',
//     category: 'Practical',
//     rating: 4.8,
//     cover: 'https://images.pexels.com/photos/6321643/pexels-photo-6321643.jpeg',
//     link: '#'
//   }
// ];

// const Books: React.FC = () => {
//   const { progress, toggleSavedContent } = useProgress();
//   const [activeFilters, setActiveFilters] = useState<string[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
  
//   const filterOptions = {
//     level: ['Beginner', 'Intermediate', 'Advanced'],
//     category: ['Fundamentals', 'Practical']
//   };

//   const toggleFilter = (filter: string) => {
//     if (activeFilters.includes(filter)) {
//       setActiveFilters(activeFilters.filter(f => f !== filter));
//     } else {
//       setActiveFilters([...activeFilters, filter]);
//     }
//   };

//   const filteredBooks = activeFilters.length === 0 
//     ? books 
//     : books.filter(book => 
//         activeFilters.includes(book.level) || 
//         activeFilters.includes(book.category)
//       );

//   return (
//     <div className="container mx-auto px-4 pt-10 pb-20">
//       <div className="max-w-5xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Recommended Books
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             A curated collection of the best books to master deep learning concepts, from theory to practice.
//           </p>
//         </motion.div>

//         <div className="mb-8">
//           <button 
//             className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 font-medium"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <span>Filter Books</span>
//             {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//           </button>
          
//           {showFilters && (
//             <motion.div 
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="bg-gray-50 p-6 rounded-lg mt-2"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-3">Experience Level</h3>
//                   <div className="space-y-2">
//                     {filterOptions.level.map(level => (
//                       <label key={level} className="flex items-center space-x-2 cursor-pointer">
//                         <input 
//                           type="checkbox" 
//                           className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
//                           checked={activeFilters.includes(level)}
//                           onChange={() => toggleFilter(level)}
//                         />
//                         <span className="text-gray-700">{level}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
//                   <div className="space-y-2">
//                     {filterOptions.category.map(category => (
//                       <label key={category} className="flex items-center space-x-2 cursor-pointer">
//                         <input 
//                           type="checkbox" 
//                           className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
//                           checked={activeFilters.includes(category)}
//                           onChange={() => toggleFilter(category)}
//                         />
//                         <span className="text-gray-700">{category}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredBooks.map((book, index) => (
//             <motion.div
//               key={book.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
//             >
//               <div 
//                 className="h-48 bg-cover bg-center" 
//                 style={{ backgroundImage: `url(${book.cover})` }}
//               >
//                 <div className="flex justify-end p-3">
//                   <button 
//                     onClick={() => toggleSavedContent(book.id)}
//                     className={`p-2 rounded-full ${
//                       progress.savedContent.includes(book.id) 
//                         ? 'bg-indigo-100 text-indigo-600' 
//                         : 'bg-gray-800 bg-opacity-50 text-white hover:bg-indigo-600'
//                     } transition-colors`}
//                   >
//                     <BookmarkPlus className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 flex-grow">
//                 <div className="flex items-center mb-2">
//                   <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                     {book.level}
//                   </span>
//                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
//                     {book.category}
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
//                 <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
//                 <div className="flex items-center mb-3">
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i}
//                       className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
//                       fill={i < Math.floor(book.rating) ? 'currentColor' : 'none'}
//                     />
//                   ))}
//                   <span className="text-gray-600 text-sm ml-2">{book.rating}</span>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-4">{book.description}</p>
//               </div>
//               <div className="p-4 bg-gray-50 border-t border-gray-100">
//                 <a 
//                   href={book.link} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
//                 >
//                   <BookOpen className="h-4 w-4 mr-2" />
//                   Learn More
//                 </a>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Books;

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  cover: string;
  link: string;
}

const books: Book[] = [
  {
    id: 'book-1',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    description: 'The definitive textbook on deep learning. Comprehensive and rigorous, covering the mathematical foundations and latest techniques.',
    level: 'Advanced',
    category: 'Fundamentals',
    rating: 4.8,
    cover: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    link: 'https://www.deeplearningbook.org/'
  },
  {
    id: 'book-2',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    description: 'A practical guide to machine learning and deep learning using Scikit-Learn and TensorFlow, with hands-on projects and code examples.',
    level: 'Intermediate',
    category: 'Practical',
    rating: 4.9,
    cover: 'https://images.pexels.com/photos/4553029/pexels-photo-4553029.jpeg',
    link: 'https://www.oreilly.com/library/view/hands-on-machine-learning/'
  },
  {
    id: 'book-3',
    title: 'Python Machine Learning',
    author: 'Sebastian Raschka, Vahid Mirjalili',
    description: 'Learn how to build powerful machine learning models using Python and scikit-learn, with a focus on practical applications.',
    level: 'Beginner',
    category: 'Practical',
    rating: 4.6,
    cover: 'https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg',
    link: 'https://www.packtpub.com/product/python-machine-learning/9781789955750'
  },
  {
    id: 'book-4',
    title: 'Neural Networks and Deep Learning',
    author: 'Michael Nielsen',
    description: 'A free online book that explains neural networks in a clear, accessible way with interactive examples.',
    level: 'Beginner',
    category: 'Fundamentals',
    rating: 4.7,
    cover: 'https://images.pexels.com/photos/5862277/pexels-photo-5862277.jpeg',
    link: 'http://neuralnetworksanddeeplearning.com/'
  },
  {
    id: 'book-5',
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher Bishop',
    description: 'A comprehensive introduction to machine learning, covering both theoretical foundations and practical applications.',
    level: 'Advanced',
    category: 'Fundamentals',
    rating: 4.5,
    cover: 'https://images.pexels.com/photos/1560093/pexels-photo-1560093.jpeg',
    link: '#'
  },
  {
    id: 'book-6',
    title: 'Deep Learning with Python',
    author: 'François Chollet',
    description: 'A practical guide to deep learning with Keras, written by the creator of Keras. Focuses on practical applications with code examples.',
    level: 'Intermediate',
    category: 'Practical',
    rating: 4.8,
    cover: 'https://images.pexels.com/photos/6321643/pexels-photo-6321643.jpeg',
    link: '#'
  }
];

// Group books by category
const groupedBooks = books.reduce((acc, book) => {
  if (!acc[book.category]) {
    acc[book.category] = [];
  }
  acc[book.category].push(book);
  return acc;
}, {} as Record<string, Book[]>);

const Books: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recommended Books</h1>
          <p className="text-lg text-gray-600">
            Explore our curated collection of books to master deep learning concepts, from theory to practice.
          </p>
        </div>

        {/* Categories */}
        {Object.entries(groupedBooks).map(([category, books]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Book Cover */}
                  <div
                    className="h-48 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${book.cover})` }}
                  ></div>

                  {/* Book Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">by {book.author}</p>
                    <p className="text-sm text-gray-700 mb-4">{book.description}</p>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
                        {book.level}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill={i < Math.floor(book.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="text-sm text-gray-600">{book.rating}</span>
                    </div>

                    {/* Book Link */}
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Visit Book Website
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;