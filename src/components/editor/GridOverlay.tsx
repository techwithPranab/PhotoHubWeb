'use client';

import React from 'react';

interface GridOverlayProps {
  readonly width: number;
  readonly height: number;
  readonly gridSize: number;
  readonly color?: string;
  readonly opacity?: number;
}

export default function GridOverlay({ 
  width, 
  height, 
  gridSize, 
  color = '#e5e7eb', 
  opacity = 0.5 
}: GridOverlayProps) {
  // Calculate number of grid lines
  const verticalLines = Math.floor(width / gridSize);
  const horizontalLines = Math.floor(height / gridSize);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    >
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Major grid lines every 5 units */}
      <svg width={width} height={height} className="absolute inset-0">
        {/* Vertical major lines */}
        {Array.from({ length: Math.floor(verticalLines / 5) + 1 }).map((_, i) => {
          const x = i * gridSize * 5;
          return (
            <line
              key={`v-major-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={height}
              stroke={color}
              strokeWidth="2"
              opacity={0.8}
            />
          );
        })}
        
        {/* Horizontal major lines */}
        {Array.from({ length: Math.floor(horizontalLines / 5) + 1 }).map((_, i) => {
          const y = i * gridSize * 5;
          return (
            <line
              key={`h-major-${y}`}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={color}
              strokeWidth="2"
              opacity={0.8}
            />
          );
        })}
      </svg>
    </div>
  );
}
