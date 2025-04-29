// import React from 'react';
// import { motion } from 'framer-motion';
// import { SubRoadmapNode } from '../../types';
// import RoadmapConnector from './RoadmapConnector';
// import Card from '../ui/Card';
// import Badge from '../ui/Badge';
// import { CheckCircle, ChevronRight } from 'lucide-react';

// interface SubRoadmapTreeProps {
//   nodes: SubRoadmapNode[];
//   completedNodes: string[];
//   onNodeClick: (nodeId: string) => void;
// }

// const SubRoadmapTree: React.FC<SubRoadmapTreeProps> = ({
//   nodes,
//   completedNodes,
//   onNodeClick,
// }) => {
//   return (
//     <div className="relative w-full" style={{ height: '600px' }}>
//       {/* Render connectors */}
//       {nodes.map(node => 
//         node.dependencies.map(depId => {
//           const dependencyNode = nodes.find(n => n.id === depId);
//           if (dependencyNode) {
//             return (
//               <RoadmapConnector
//                 key={`${depId}-${node.id}`}
//                 startX={dependencyNode.position.x}
//                 startY={dependencyNode.position.y}
//                 endX={node.position.x}
//                 endY={node.position.y}
//                 isCompleted={completedNodes.includes(node.id) && completedNodes.includes(depId)}
//               />
//             );
//           }
//           return null;
//         })
//       )}

//       {/* Render nodes */}
//       {nodes.map((node) => (
//         <motion.div
//           key={node.id}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="absolute"
//           style={{
//             left: `${node.position.x}%`,
//             top: `${node.position.y}px`,
//             transform: 'translate(-50%, -50%)',
//             width: '250px',
//           }}
//         >
//           <Card
//             hoverable
//             className={`p-4 cursor-pointer transition-all duration-300 ${
//               completedNodes.includes(node.id)
//                 ? 'border-green-500 bg-green-50'
//                 : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
//             }`}
//             onClick={() => onNodeClick(node.id)}
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="font-bold text-gray-900">{node.title}</h3>
//                 <p className="text-sm text-gray-600 mt-1">{node.description}</p>
//               </div>
//               {completedNodes.includes(node.id) && (
//                 <Badge variant="success" size="sm" className="flex items-center">
//                   <CheckCircle className="h-3 w-3 mr-1" />
//                   Complete
//                 </Badge>
//               )}
//             </div>
            
//             <div className="mt-3 flex items-center justify-between text-sm">
//               <div className="flex -space-x-2">
//                 {node.content.slice(0, 3).map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
//                     style={{ zIndex: 3 - index }}
//                   >
//                     <span className="text-xs font-bold">
//                       {item.type.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 ))}
//                 {node.content.length > 3 && (
//                   <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700">
//                     +{node.content.length - 3}
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex items-center text-indigo-600 font-medium">
//                 View
//                 <ChevronRight className="h-4 w-4 ml-1" />
//               </div>
//             </div>
//           </Card>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default SubRoadmapTree;

