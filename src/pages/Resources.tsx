// import React from 'react';
// import { Book, Code, Database, Download } from 'lucide-react';
// import Card from '../components/ui/Card';

// const resources = {
//   tools: [
//     {
//       name: 'PyTorch',
//       description: 'An open source machine learning framework',
//       url: 'https://pytorch.org',
//       icon: Code
//     },
//     {
//       name: 'TensorFlow',
//       description: 'End-to-end platform for machine learning',
//       url: 'https://tensorflow.org',
//       icon: Code
//     },
//     {
//       name: 'Keras',
//       description: 'Deep learning API running on top of TensorFlow',
//       url: 'https://keras.io',
//       icon: Code
//     }
//   ],
//   datasets: [
//     {
//       name: 'MNIST Database',
//       description: 'Database of handwritten digits',
//       url: 'http://yann.lecun.com/exdb/mnist/',
//       icon: Database
//     },
//     {
//       name: 'ImageNet',
//       description: 'Image database organized according to WordNet hierarchy',
//       url: 'https://www.image-net.org',
//       icon: Database
//     },
//     {
//       name: 'CIFAR-10',
//       description: 'Collection of images for object recognition',
//       url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
//       icon: Database
//     }
//   ],
//   books: [
//     {
//       name: 'Deep Learning',
//       authors: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
//       url: 'https://www.deeplearningbook.org',
//       icon: Book
//     },
//     {
//       name: 'Neural Networks and Deep Learning',
//       authors: 'Michael Nielsen',
//       url: 'http://neuralnetworksanddeeplearning.com',
//       icon: Book
//     },
//     {
//       name: 'Deep Learning with Python',
//       authors: 'François Chollet',
//       url: 'https://www.manning.com/books/deep-learning-with-python',
//       icon: Book
//     }
//   ]
// };

// const Resources: React.FC = () => {
//   return (
//     <div className="container mx-auto px-4 pt-10 pb-20">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
//         <p className="text-gray-600 mb-8">
//           Essential tools, datasets, and books for your deep learning journey.
//         </p>

//         <div className="space-y-12">
//           {/* Tools & Frameworks */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Tools & Frameworks</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {resources.tools.map((tool) => (
//                 <Card key={tool.name} className="hover:shadow-lg transition-shadow">
//                   <a
//                     href={tool.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block p-6"
//                   >
//                     <div className="flex items-center mb-4">
//                       <div className="bg-indigo-100 p-3 rounded-lg">
//                         <tool.icon className="h-6 w-6 text-indigo-600" />
//                       </div>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {tool.name}
//                     </h3>
//                     <p className="text-gray-600">{tool.description}</p>
//                   </a>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* Datasets */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Datasets</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {resources.datasets.map((dataset) => (
//                 <Card key={dataset.name} className="hover:shadow-lg transition-shadow">
//                   <a
//                     href={dataset.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block p-6"
//                   >
//                     <div className="flex items-center mb-4">
//                       <div className="bg-green-100 p-3 rounded-lg">
//                         <dataset.icon className="h-6 w-6 text-green-600" />
//                       </div>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {dataset.name}
//                     </h3>
//                     <p className="text-gray-600">{dataset.description}</p>
//                     <div className="mt-4 flex items-center text-green-600">
//                       <Download className="h-4 w-4 mr-2" />
//                       <span className="text-sm font-medium">Download Dataset</span>
//                     </div>
//                   </a>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* Books */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Books</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {resources.books.map((book) => (
//                 <Card key={book.name} className="hover:shadow-lg transition-shadow">
//                   <a
//                     href={book.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block p-6"
//                   >
//                     <div className="flex items-center mb-4">
//                       <div className="bg-amber-100 p-3 rounded-lg">
//                         <book.icon className="h-6 w-6 text-amber-600" />
//                       </div>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {book.name}
//                     </h3>
//                     <p className="text-gray-600">By {book.authors}</p>
//                   </a>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resources;

import React from 'react';
import { Book, Code, Database, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const resources = {
  tools: [
    {
      name: 'PyTorch',
      description: 'An open source machine learning framework',
      url: 'https://pytorch.org',
      icon: Code
    },
    {
      name: 'TensorFlow',
      description: 'End-to-end platform for machine learning',
      url: 'https://tensorflow.org',
      icon: Code
    },
    {
      name: 'Keras',
      description: 'Deep learning API running on top of TensorFlow',
      url: 'https://keras.io',
      icon: Code
    }
  ],
  datasets: [
    {
      name: 'MNIST Database',
      description: 'Database of handwritten digits',
      url: 'http://yann.lecun.com/exdb/mnist/',
      icon: Database
    },
    {
      name: 'ImageNet',
      description: 'Image database organized according to WordNet hierarchy',
      url: 'https://www.image-net.org',
      icon: Database
    },
    {
      name: 'CIFAR-10',
      description: 'Collection of images for object recognition',
      url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
      icon: Database
    }
  ],
  books: [
    {
      name: 'Deep Learning',
      authors: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      url: 'https://www.deeplearningbook.org',
      icon: Book
    },
    {
      name: 'Neural Networks and Deep Learning',
      authors: 'Michael Nielsen',
      url: 'http://neuralnetworksanddeeplearning.com',
      icon: Book
    },
    {
      name: 'Deep Learning with Python',
      authors: 'François Chollet',
      url: 'https://www.manning.com/books/deep-learning-with-python',
      icon: Book
    }
  ]
};

const Resources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600 mb-8">
          Essential tools, datasets, and books for your deep learning journey.
        </p>

        <div className="space-y-12">
          {/* Tools & Frameworks */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tools & Frameworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.tools.map((tool) => (
                <Card key={tool.name} className="hover:shadow-lg transition-shadow">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <tool.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </a>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link
                to="/tools"
                className="text-indigo-600 hover:underline font-medium text-sm"
              >
                See More Tools →
              </Link>
            </div>
          </section>

          {/* Datasets */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datasets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.datasets.map((dataset) => (
                <Card key={dataset.name} className="hover:shadow-lg transition-shadow">
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <dataset.icon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dataset.name}
                    </h3>
                    <p className="text-gray-600">{dataset.description}</p>
                  </a>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link
                to="/datasets"
                className="text-green-600 hover:underline font-medium text-sm"
              >
                See More Datasets →
              </Link>
            </div>
          </section>

          {/* Books */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.books.map((book) => (
                <Card key={book.name} className="hover:shadow-lg transition-shadow">
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <book.icon className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {book.name}
                    </h3>
                    <p className="text-gray-600">By {book.authors}</p>
                  </a>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link
                to="/books"
                className="text-amber-600 hover:underline font-medium text-sm"
              >
                See More Books →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resources;