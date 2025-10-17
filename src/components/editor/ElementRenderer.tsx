'use client';

import React from 'react';
import { AlbumElement } from '@/types/editor';
import Image from 'next/image';

interface ElementRendererProps {
  readonly element: AlbumElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onDoubleClick?: () => void;
}

export default function ElementRenderer({ element, isSelected, onSelect, onDoubleClick }: ElementRendererProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    cursor: 'pointer',
    userSelect: 'none',
    border: isSelected ? '2px solid #3b82f6' : 'none',
    opacity: element.opacity || 1,
    zIndex: element.layerIndex
  };

  const renderElementContent = () => {
    switch (element.type) {
      case 'photo':
        return element.url ? (
          <div className="w-full h-full relative overflow-hidden">
            <Image
              src={element.url}
              alt=""
              fill
              className="object-cover"
              style={{
                filter: element.filter || 'none',
                borderRadius: element.borderRadius || 0
              }}
              draggable={false}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        );

      case 'text':
        return (
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              fontSize: element.fontSize || 16,
              fontFamily: element.font || 'Arial',
              color: element.color || '#000000',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textAlign: element.textAlign || 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              padding: '8px',
              backgroundColor: element.fillColor || 'transparent',
              borderRadius: element.borderRadius || 0
            }}
          >
            {element.text || 'Double click to edit'}
          </div>
        );

      case 'sticker':
        return element.url ? (
          <div className="w-full h-full relative">
            <Image
              src={element.url}
              alt=""
              fill
              className="object-contain"
              style={{
                filter: element.filter || 'none'
              }}
              draggable={false}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Sticker
          </div>
        );

      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.fillColor || '#000000',
              border: element.strokeWidth 
                ? `${element.strokeWidth}px solid ${element.strokeColor || '#000000'}`
                : 'none',
              borderRadius: element.shapeType === 'circle' 
                ? '50%' 
                : element.borderRadius || 0
            }}
          />
        );

      case 'background':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              backgroundImage: element.url ? `url(${element.url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        );

      default:
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Unknown Element
          </div>
        );
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={baseStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (element.type === 'text' && onDoubleClick) {
          onDoubleClick();
        }
      }}
    >
      {renderElementContent()}
      
      {/* Drop shadow */}
      {element.shadow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`,
            zIndex: -1
          }}
        />
      )}
    </div>
  );
}
