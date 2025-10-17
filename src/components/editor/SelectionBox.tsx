'use client';

import React from 'react';
import { AlbumElement } from '@/types/editor';
import { calculateSelectionBounds } from '@/lib/canvas-utils';

interface SelectionBoxProps {
  readonly elements: AlbumElement[];
}

export default function SelectionBox({ elements }: SelectionBoxProps) {
  if (elements.length === 0) return null;

  const bounds = calculateSelectionBounds(elements);
  if (!bounds) return null;

  const handleSize = 8;
  const handles = [
    { type: 'nw', x: 0, y: 0, cursor: 'nw-resize' },
    { type: 'ne', x: bounds.width, y: 0, cursor: 'ne-resize' },
    { type: 'sw', x: 0, y: bounds.height, cursor: 'sw-resize' },
    { type: 'se', x: bounds.width, y: bounds.height, cursor: 'se-resize' },
    { type: 'n', x: bounds.width / 2, y: 0, cursor: 'n-resize' },
    { type: 's', x: bounds.width / 2, y: bounds.height, cursor: 's-resize' },
    { type: 'w', x: 0, y: bounds.height / 2, cursor: 'w-resize' },
    { type: 'e', x: bounds.width, y: bounds.height / 2, cursor: 'e-resize' }
  ];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        border: '2px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }}
    >
      {/* Resize Handles */}
      {handles.map((handle) => (
        <div
          key={handle.type}
          className="absolute pointer-events-auto bg-white border-2 border-blue-500 rounded-sm hover:bg-blue-100"
          style={{
            left: handle.x - handleSize / 2,
            top: handle.y - handleSize / 2,
            width: handleSize,
            height: handleSize,
            cursor: handle.cursor
          }}
        />
      ))}

      {/* Rotation Handle (for single element) */}
      {elements.length === 1 && (
        <div
          className="absolute pointer-events-auto"
          style={{
            left: bounds.width / 2 - 6,
            top: -30,
            width: 12,
            height: 25
          }}
        >
          <div className="w-0.5 h-4 bg-blue-500 mx-auto" />
          <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-grab hover:bg-blue-100" />
        </div>
      )}

      {/* Info Label */}
      <div
        className="absolute bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        style={{
          left: 0,
          top: -30,
          fontSize: '11px'
        }}
      >
        {elements.length === 1 
          ? `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`
          : `${elements.length} elements`
        }
      </div>
    </div>
  );
}
