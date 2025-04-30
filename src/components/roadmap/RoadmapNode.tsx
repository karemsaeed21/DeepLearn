// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Draggable from 'react-draggable';
// import { RoadmapNode as RoadmapNodeType } from '../../types';
// import Badge from '../ui/Badge';
// import { ChevronRight } from 'lucide-react';
// import { Link } from 'react-router-dom';

// interface RoadmapNodeProps {
//   node: RoadmapNodeType;
//   isCompleted: boolean;
//   isInProgress: boolean;
//   onClick: (nodeId: string) => void;
//   onPositionChange: (nodeId: string, x: number, y: number) => void;
// }

// const RoadmapNode: React.FC<RoadmapNodeProps> = ({
//   node,
//   isCompleted,
//   isInProgress,
//   onClick,
//   onPositionChange,
// }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);

//   const getStatusClasses = () => {
//     if (isCompleted) return 'border-green-500 bg-green-50';
//     if (isInProgress) return 'border-blue-500 bg-blue-50';
//     return 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
//   };

//   const handleDrag = (e: any, data: { x: number; y: number }) => {
//     setPosition({ x: data.x, y: data.y });
//     onPositionChange(node.id, data.x, data.y);
//   };

//   return (
//     <Draggable
//       position={position}
//       onStart={() => setIsDragging(true)}
//       onDrag={handleDrag}
//       onStop={() => setIsDragging(false)}
//       bounds="parent"
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`absolute rounded-lg border-2 p-4 shadow-sm cursor-move transition-all duration-300 w-64 ${getStatusClasses()}`}
//         style={{
//           left: `${node.position.x}%`,
//           top: `${node.position.y}px`,
//           transform: 'translate(-50%, -50%)',
//           zIndex: isDragging ? 50 : 1,
//         }}
//       >
//         <div className="flex items-start justify-between">
//           <div>
//             <h3 className="font-bold text-gray-900">{node.title}</h3>
//             <p className="text-sm text-gray-600 mt-1">{node.description}</p>
//           </div>
//           {isCompleted && (
//             <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-white"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//           )}
//         </div>
        
//         <div className="flex mt-3 space-x-2">
//           <Badge 
//             variant={node.isEssential ? 'error' : 'info'} 
//             size="sm"
//           >
//             {node.isEssential ? 'Essential' : 'Optional'}
//           </Badge>
//           <Badge variant="secondary" size="sm">
//             {node.level}
//           </Badge>
//         </div>
        
//         <div className="mt-3 flex items-center justify-between">
//           <div className="flex -space-x-2">
//             {node.content.slice(0, 3).map((item, index) => (
//               <div 
//                 key={item.id} 
//                 className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden"
//                 style={{ zIndex: 3 - index }}
//               >
//                 {item.type === 'article' && (
//                   <span className="text-xs font-bold">A</span>
//                 )}
//                 {item.type === 'video' && (
//                   <span className="text-xs font-bold">V</span>
//                 )}
//                 {item.type === 'book' && (
//                   <span className="text-xs font-bold">B</span>
//                 )}
//               </div>
//             ))}
//             {node.content.length > 3 && (
//               <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700">
//                 +{node.content.length - 3}
//               </div>
//             )}
//           </div>
          
//           <Link 
//             to={`/step/${node.id}`} 
//             className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
//             onClick={(e) => {
//               e.stopPropagation();
//               if (!isDragging) {
//                 onClick(node.id);
//               }
//             }}
//           >
//             View
//             <ChevronRight className="h-4 w-4 ml-1" />
//           </Link>
//         </div>
//       </motion.div>
//     </Draggable>
//   );
// };

// export default RoadmapNode;


import React from 'react';
import { RoadmapNode as RoadmapNodeType } from '../../types/index2';
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