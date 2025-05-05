import React, { useState, useEffect, useRef } from 'react';
import RoadmapNode from './RoadmapNode';
import RoadmapConnector from './RoadmapConnector';
import { RoadmapNode as RoadmapNodeType } from '../../types';
import { ArrowRight, Info } from 'lucide-react';
// import { useProgress } from '../../hooks/useProgress';

interface RoadmapTreeProps {
  nodes: RoadmapNodeType[];
  completedNodes: string[];
  inProgressNodes: string[];
  onNodeClick: (nodeId: string) => void;
}

const RoadmapTree: React.FC<RoadmapTreeProps> = ({
  nodes,
  completedNodes,
  inProgressNodes,
  onNodeClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeRefs, setNodeRefs] = useState<{ [key: string]: HTMLDivElement | null }>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [coordinates, setCoordinates] = useState<{ [key: string]: { x: number, y: number, width: number, height: number } }>({});
  const [connections, setConnections] = useState<{ from: string, to: string }[]>([]);

  // Create references for all nodes
  useEffect(() => {
    const nodeElements: { [key: string]: HTMLDivElement | null } = {};
    nodes.forEach(node => {
      nodeElements[node.id] = null;
    });
    setNodeRefs(nodeElements);
  }, [nodes]);

  // Calculate container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        setContainerWidth(width);
        setContainerHeight(Math.max(height, 800)); // Minimum height of 800px
      });

      resizeObserver.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [containerRef]);

  // Generate connections based on dependencies
  useEffect(() => {
    const newConnections: { from: string, to: string }[] = [];
    
    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        newConnections.push({
          from: depId,
          to: node.id
        });
      });
    });
    
    setConnections(newConnections);
  }, [nodes]);

  // Calculate node positions using a levels-based approach
  useEffect(() => {
  if (!containerWidth || !containerHeight) return;

  // Group nodes by levels based on dependencies
  const nodeLevels: { [level: number]: string[] } = {};
  const nodeLevel: { [id: string]: number } = {};

  // Function to calculate level for a node
  const calculateLevel = (nodeId: string, visited: Set<string> = new Set()): number => {
    // Detect circular dependencies
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 0;

    if (node.dependencies.length === 0) return 0;

    // Get max level of dependencies and add 1
    const maxDepLevel = Math.max(...node.dependencies.map(
      depId => calculateLevel(depId, new Set(visited))
    ));

    return maxDepLevel + 1;
  };

  // Calculate level for each node
  nodes.forEach(node => {
    const level = calculateLevel(node.id);
    nodeLevel[node.id] = level;

    if (!nodeLevels[level]) {
      nodeLevels[level] = [];
    }
    nodeLevels[level].push(node.id);
  });

  // Calculate max level and count nodes per level
  // const maxLevel = Math.max(...Object.keys(nodeLevels).map(Number));
  // const totalLevels = maxLevel + 1;

  const levelHeight = 250; // Vertical spacing between levels
  const verticalPadding = 100;
  const siblingSpacing = 300; // Increased horizontal spacing between sibling nodes

  // Calculate coordinates for each node
  const newCoordinates: { [key: string]: { x: number, y: number, width: number, height: number } } = {};

  Object.entries(nodeLevels).forEach(([levelStr, levelNodes]) => {
    const level = parseInt(levelStr);
    const y = verticalPadding + level * levelHeight;

    // Position nodes horizontally with increased spacing
    levelNodes.forEach((nodeId, index) => {
      const nodeWidth = 264; // Width of node + margin
      const levelWidth = (levelNodes.length - 1) * siblingSpacing + nodeWidth;
      const startX = Math.max(0, (containerWidth - levelWidth) / 2);
      const x = startX + index * siblingSpacing;

      newCoordinates[nodeId] = {
        x,
        y,
        width: 264,
        height: 180
      };
    });
  });

  setCoordinates(newCoordinates);
}, [nodes, containerWidth, containerHeight]);

  // Function to get center point of a node
  const getNodeCenter = (nodeId: string) => {
    const coord = coordinates[nodeId];
    if (!coord) return { x: 0, y: 0 };
    
    return {
      x: coord.x + (coord.width / 2) - 15,
      y: coord.y + 50 // Adjust to connect at a good position on the node
    };
  };

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-auto"
      style={{ minHeight: '800px', maxHeight: '100vh' }}
      ref={containerRef}
    >
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md z-10 max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">ML/DL Roadmap Legend</h3>
        </div>
        <ul className="text-sm space-y-2.5">
          <li className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Completed topics</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>In progress topics</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>Essential topics</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            <span>Optional topics</span>
          </li>
          <li className="flex items-center gap-2 mt-2 text-indigo-600">
            <ArrowRight className="h-3 w-3" />
            <span>Connections show prerequisites</span>
          </li>
        </ul>
      </div>

      {/* Connectors between nodes */}
      {Object.keys(coordinates).length > 0 && 
        connections.map(({ from, to }) => {
          const startPoint = getNodeCenter(from);
          const endPoint = getNodeCenter(to);
          
          if (startPoint.x === 0 && startPoint.y === 0) return null;
          if (endPoint.x === 0 && endPoint.y === 0) return null;
          
          return (
            <RoadmapConnector
              key={`${from}-${to}`}
              startX={startPoint.x}
              startY={startPoint.y}
              endX={endPoint.x}
              endY={endPoint.y}
              isCompleted={completedNodes.includes(from) && completedNodes.includes(to)}
              isActive={inProgressNodes.includes(to)}
            />
          );
        })
      }

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          ref={(el) => {
            nodeRefs[node.id] = el;
          }}
          className="absolute transition-all duration-500 ease-in-out"
          style={{
            left: `${coordinates[node.id]?.x || 0}px`,
            top: `${coordinates[node.id]?.y || 0}px`,
            transform: 'translate(0%, -50%)',
            width: '264px',
          }}
        >
          <RoadmapNode
            node={node}
            isCompleted={completedNodes.includes(node.id)}
            isInProgress={inProgressNodes.includes(node.id)}
            onClick={onNodeClick}
          />
        </div>
      ))}
    </div>
  );
};

export default RoadmapTree;


