'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { DragState, AlbumElement } from '@/types/editor';
import ElementRenderer from './ElementRenderer';
import SelectionBox from './SelectionBox';
import GridOverlay from './GridOverlay';
import RichTextEditor from './RichTextEditor';
import { calculateElementBounds, isPointInElement, snapToGrid } from '@/lib/canvas-utils';

interface CanvasEditorProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function CanvasEditor({ 
  width = 800, 
  height = 600, 
  className = '' 
}: Readonly<CanvasEditorProps>) {
  const { state, selectElement, updateElement, clearSelection, addElementFromAsset } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [viewportTransform, setViewportTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [editingTextElement, setEditingTextElement] = useState<AlbumElement | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    globalThis.addEventListener('keyup', handleKeyUp);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      globalThis.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Canvas mouse handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current || !state.currentPage) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewportTransform.x) / viewportTransform.scale;
    const y = (e.clientY - rect.top - viewportTransform.y) / viewportTransform.scale;

    // Pan mode with space key
    if (isSpacePressed) {
      setDragState({
        isDragging: true,
        dragType: 'pan',
        startPosition: { x: e.clientX, y: e.clientY },
        originalTransform: { ...viewportTransform }
      } as DragState & { dragType: 'pan'; originalTransform: typeof viewportTransform });
      return;
    }

    // Find clicked element (top-most first)
    const elements = [...state.currentPage.elements].sort((a, b) => b.layerIndex - a.layerIndex);
    const clickedElement = elements.find(el => isPointInElement({ x, y }, el));

    if (clickedElement) {
      // Check if clicking on resize handle
      const bounds = calculateElementBounds(clickedElement);
      const handleSize = 8;
      const handles = [
        { type: 'nw', x: bounds.x, y: bounds.y },
        { type: 'ne', x: bounds.x + bounds.width, y: bounds.y },
        { type: 'sw', x: bounds.x, y: bounds.y + bounds.height },
        { type: 'se', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        { type: 'n', x: bounds.x + bounds.width / 2, y: bounds.y },
        { type: 's', x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
        { type: 'w', x: bounds.x, y: bounds.y + bounds.height / 2 },
        { type: 'e', x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }
      ];

      const clickedHandle = handles.find(handle => 
        Math.abs(x - handle.x) <= handleSize && Math.abs(y - handle.y) <= handleSize
      );

      if (clickedHandle && state.selectedElements.includes(clickedElement.id)) {
        // Start resize
        setDragState({
          isDragging: true,
          dragType: 'resize',
          startPosition: { x, y },
          originalTransform: {
            x: clickedElement.x,
            y: clickedElement.y,
            width: clickedElement.width,
            height: clickedElement.height,
            rotation: clickedElement.rotation || 0
          },
          element: clickedElement
        });
      } else {
        // Select element and start move
        if (!state.selectedElements.includes(clickedElement.id)) {
          selectElement(clickedElement.id);
        }
        
        setDragState({
          isDragging: true,
          dragType: 'move',
          startPosition: { x, y },
          originalTransform: {
            x: clickedElement.x,
            y: clickedElement.y,
            width: clickedElement.width,
            height: clickedElement.height,
            rotation: clickedElement.rotation || 0
          },
          element: clickedElement
        });
      }
    } else {
      // Clear selection
      clearSelection();
    }
  }, [state, selectElement, clearSelection, viewportTransform, isSpacePressed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState?.isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left - viewportTransform.x) / viewportTransform.scale;
    const currentY = (e.clientY - rect.top - viewportTransform.y) / viewportTransform.scale;

    if (dragState.dragType === 'pan') {
      const deltaX = e.clientX - dragState.startPosition.x;
      const deltaY = e.clientY - dragState.startPosition.y;
      const panState = dragState as DragState & { originalTransform: typeof viewportTransform };
      
      setViewportTransform({
        ...panState.originalTransform,
        x: panState.originalTransform.x + deltaX,
        y: panState.originalTransform.y + deltaY
      });
    } else if (dragState.dragType === 'move' && dragState.element) {
      const deltaX = currentX - dragState.startPosition.x;
      const deltaY = currentY - dragState.startPosition.y;
      
      let newX = dragState.originalTransform.x + deltaX;
      let newY = dragState.originalTransform.y + deltaY;

      // Snap to grid if enabled
      if (state.isSnapToGrid) {
        const snapped = snapToGrid({ x: newX, y: newY }, 20);
        newX = snapped.x;
        newY = snapped.y;
      }

      updateElement(dragState.element.id, { x: newX, y: newY });
    } else if (dragState.dragType === 'resize' && dragState.element) {
      const deltaX = currentX - dragState.startPosition.x;
      const deltaY = currentY - dragState.startPosition.y;
      
      const bounds = {
        x: dragState.originalTransform.x,
        y: dragState.originalTransform.y,
        width: dragState.originalTransform.width || dragState.element.width,
        height: dragState.originalTransform.height || dragState.element.height
      };
      
      const { x, y, width, height } = calculateResizedBounds(
        bounds,
        deltaX,
        deltaY,
        'se' // Default to southeast handle for now
      );

      updateElement(dragState.element.id, { x, y, width, height });
    }
  }, [dragState, updateElement, state.isSnapToGrid, viewportTransform]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  // Drag and drop handling for assets
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const assetData = e.dataTransfer.getData('application/json');
      if (!assetData) return;
      
      const asset = JSON.parse(assetData);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate position relative to canvas
      const x = (e.clientX - rect.left - viewportTransform.x) / viewportTransform.scale;
      const y = (e.clientY - rect.top - viewportTransform.y) / viewportTransform.scale;
      
      addElementFromAsset(asset, { x, y });
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
  }, [addElementFromAsset, viewportTransform]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Text editing handlers
  const handleTextDoubleClick = useCallback((element: AlbumElement) => {
    setEditingTextElement(element);
  }, []);

  const handleTextEditorUpdate = useCallback((updates: Partial<AlbumElement>) => {
    if (editingTextElement) {
      updateElement(editingTextElement.id, updates);
      setEditingTextElement(null);
    }
  }, [editingTextElement, updateElement]);

  const handleTextEditorClose = useCallback(() => {
    setEditingTextElement(null);
  }, []);

  // Wheel handling for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, viewportTransform.scale * scaleFactor));
      
      const scaleRatio = newScale / viewportTransform.scale;
      const newX = mouseX - (mouseX - viewportTransform.x) * scaleRatio;
      const newY = mouseY - (mouseY - viewportTransform.y) * scaleRatio;

      setViewportTransform({
        x: newX,
        y: newY,
        scale: newScale
      });
    }
  }, [viewportTransform]);

  if (!state.currentPage) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">No page selected</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}>
      {/* Canvas Container */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={canvasRef}
        className={`relative cursor-${isSpacePressed ? 'grab' : 'default'} select-none`}
        style={{ 
          width: width, 
          height: height,
          cursor: isSpacePressed ? 'grab' : 'default'
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Page Canvas */}
        <div
          className="absolute bg-white shadow-lg"
          style={{
            width: state.currentPage.dimensions.width,
            height: state.currentPage.dimensions.height,
            transform: `translate(${viewportTransform.x}px, ${viewportTransform.y}px) scale(${viewportTransform.scale})`,
            transformOrigin: '0 0',
            backgroundColor: state.currentPage.pageBackground.type === 'color' 
              ? state.currentPage.pageBackground.value 
              : '#ffffff'
          }}
        >
          {/* Grid Overlay */}
          {state.isGridVisible && (
            <GridOverlay 
              width={state.currentPage.dimensions.width}
              height={state.currentPage.dimensions.height}
              gridSize={20}
            />
          )}

          {/* Render Elements */}
          {state.currentPage.elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={state.selectedElements.includes(element.id)}
              onSelect={() => selectElement(element.id)}
              onDoubleClick={() => handleTextDoubleClick(element)}
            />
          ))}

          {/* Selection Box for selected elements */}
          {state.selectedElements.length > 0 && (
            <SelectionBox 
              elements={state.currentPage.elements.filter(el => 
                state.selectedElements.includes(el.id)
              )}
            />
          )}
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow text-sm">
        Zoom: {Math.round(viewportTransform.scale * 100)}%
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded shadow text-xs">
        <div>Hold <kbd className="px-1 bg-gray-200 rounded">Space</kbd> to pan</div>
        <div><kbd className="px-1 bg-gray-200 rounded">Ctrl</kbd> + scroll to zoom</div>
      </div>

      {/* Rich Text Editor Modal */}
      {editingTextElement && (
        <RichTextEditor
          element={editingTextElement}
          onUpdate={handleTextEditorUpdate}
          onClose={handleTextEditorClose}
        />
      )}
    </div>
  );
}

// Helper function for resize calculations
function calculateResizedBounds(
  original: { x: number; y: number; width: number; height: number },
  deltaX: number,
  deltaY: number,
  handle: string
) {
  let { x, y, width, height } = original;

  switch (handle) {
    case 'nw':
      x += deltaX;
      y += deltaY;
      width -= deltaX;
      height -= deltaY;
      break;
    case 'ne':
      y += deltaY;
      width += deltaX;
      height -= deltaY;
      break;
    case 'sw':
      x += deltaX;
      width -= deltaX;
      height += deltaY;
      break;
    case 'se':
      width += deltaX;
      height += deltaY;
      break;
    case 'n':
      y += deltaY;
      height -= deltaY;
      break;
    case 's':
      height += deltaY;
      break;
    case 'w':
      x += deltaX;
      width -= deltaX;
      break;
    case 'e':
      width += deltaX;
      break;
  }

  // Ensure minimum size
  const minSize = 10;
  if (width < minSize) {
    if (handle.includes('w')) x -= (minSize - width);
    width = minSize;
  }
  if (height < minSize) {
    if (handle.includes('n')) y -= (minSize - height);
    height = minSize;
  }

  return { x, y, width, height };
}
