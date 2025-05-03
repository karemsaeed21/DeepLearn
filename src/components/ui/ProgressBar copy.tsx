import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showValue = false,
  size = 'md',
  color = 'primary',
  className = '',
  animate = true,
}) => {
  // Ensure value is between 0-100
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-teal-600',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  
  const gradientColors = {
    primary: 'from-blue-400 to-blue-600',
    secondary: 'from-teal-400 to-teal-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-amber-400 to-amber-600',
    error: 'from-red-400 to-red-600',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`
            ${animate ? 'transition-all duration-500 ease-out' : ''}
            ${colorClasses[color]} bg-gradient-to-r ${gradientColors[color]}
            rounded-full
          `}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      
      {showValue && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(clampedValue)}%
        </p>
      )}
    </div>
  );
};

export default ProgressBar;