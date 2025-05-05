import React from 'react';

interface RoadmapConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isCompleted?: boolean;
  isActive?: boolean;
  cardHeight?: number; // Add card height as a prop
}

const RoadmapConnector: React.FC<RoadmapConnectorProps> = ({
  startX,
  startY,
  endX,
  endY,
  isCompleted = false,
  isActive = false,
  cardHeight = 180, // Default card height
}) => {
  // Adjust start and end Y positions to connect from the bottom of the source card to the top of the target card
  const adjustedStartY = startY + cardHeight  / 4.8; // Bottom of the source card
  const adjustedEndY = endY - cardHeight / 1.6; // Top of the target card

  // Calculate the distance and angle between the adjusted start and end points
  const dx = endX - startX;
  const dy = adjustedEndY - adjustedStartY -1;
  const length = Math.sqrt(dx * dx + dy * dy); // Dynamic length based on distance
  const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle for rotation

  // Add padding to both ends to avoid overlapping with nodes
  const paddingStart = 20; // Adjust to match the node's edge
  const paddingEnd = 8; // Adjust to match the node's edge
  const adjustedLength = Math.max(0, length - paddingStart - paddingEnd);

  // Generate path for the connector
  // const path = `M ${paddingStart},0 L ${adjustedLength},0`;

  // Determine connector color based on status
  const getLineColor = () => {
    if (isCompleted) return 'stroke-green-500';
    if (isActive) return 'stroke-blue-500';
    return 'stroke-gray-300';
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: startX,
        top: adjustedStartY, // Use the adjusted start Y position
        width: `${length}px`,
        height: '2px',
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="2"
        style={{
          overflow: 'visible',
          position: 'absolute',
        }}
      >
        <line
          x1="0"
          y1="0"
          x2={adjustedLength}
          y2="0"
          className={`${getLineColor()} stroke-2`}
          strokeDasharray={isActive ? '5,5' : ''}
        />
      </svg>
    </div>
  );
};

export default RoadmapConnector;