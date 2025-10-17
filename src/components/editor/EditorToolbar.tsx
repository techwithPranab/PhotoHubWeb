'use client';

import React from 'react';
import { useEditor } from '@/contexts/EditorContext';

export default function EditorToolbar() {
  const { state, addElement, undo, redo, canUndo, canRedo } = useEditor();

  const handleAddText = () => {
    addElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      text: 'Click to edit text',
      fontSize: 18,
      color: '#000000'
    });
  };

  const handleAddPhoto = () => {
    addElement({
      type: 'photo',
      x: 150,
      y: 150,
      width: 200,
      height: 150,
      url: 'https://via.placeholder.com/200x150?text=Photo'
    });
  };

  const handleAddShape = () => {
    addElement({
      type: 'shape',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      shapeType: 'rectangle',
      fillColor: '#3b82f6'
    });
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white border-b border-gray-200">
      {/* Undo/Redo */}
      <div className="flex items-center space-x-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          ↶
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Add Elements */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleAddText}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <span>📝</span>
          <span>Text</span>
        </button>
        
        <button
          onClick={handleAddPhoto}
          className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <span>📷</span>
          <span>Photo</span>
        </button>
        
        <button
          onClick={handleAddShape}
          className="flex items-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          <span>🔶</span>
          <span>Shape</span>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Tool Info */}
      <div className="text-sm text-gray-600">
        Tool: {state.tool} | Elements: {state.currentPage?.elements.length || 0}
      </div>
    </div>
  );
}
