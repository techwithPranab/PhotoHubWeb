'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlbumElement } from '@/types/editor';

interface RichTextEditorProps {
  element: AlbumElement;
  onUpdate: (updates: Partial<AlbumElement>) => void;
  onClose: () => void;
}

const fontFamilies = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Times New Roman, serif',
  'Georgia, serif',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Impact, sans-serif',
  'Courier New, monospace'
];

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

export default function RichTextEditor({ 
  element, 
  onUpdate, 
  onClose 
}: Readonly<RichTextEditorProps>) {
  const [text, setText] = useState(element.text || '');
  const [fontSize, setFontSize] = useState(element.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(element.font || 'Arial, sans-serif');
  const [color, setColor] = useState(element.color || '#000000');
  const [fontWeight, setFontWeight] = useState(element.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState(element.fontStyle || 'normal');
  const [textAlign, setTextAlign] = useState(element.textAlign || 'left');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSave = () => {
    onUpdate({
      text,
      fontSize,
      font: fontFamily,
      color,
      fontWeight,
      fontStyle,
      textAlign,
      // Auto-adjust element size based on content
      width: Math.max(element.width, 100),
      height: Math.max(fontSize * 1.5, 30)
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const previewStyle = {
    fontFamily,
    fontSize: `${fontSize}px`,
    color,
    fontWeight,
    fontStyle,
    textAlign,
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Edit Text</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            {/* Font Family */}
            <div className="flex flex-col">
              <label htmlFor="font-family" className="text-xs text-gray-600 mb-1">Font</label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="flex flex-col">
              <label htmlFor="font-size" className="text-xs text-gray-600 mb-1">Size</label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm w-16"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="flex flex-col">
              <label htmlFor="text-color" className="text-xs text-gray-600 mb-1">Color</label>
              <input
                id="text-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            {/* Font Weight */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`px-2 py-1 border rounded text-sm font-bold ${
                  fontWeight === 'bold' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300'
                }`}
              >
                B
              </button>
              <button
                onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`px-2 py-1 border rounded text-sm italic ${
                  fontStyle === 'italic' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300'
                }`}
              >
                I
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setTextAlign('left')}
                className={`px-2 py-1 border rounded text-sm ${
                  textAlign === 'left' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300'
                }`}
              >
                ⬅️
              </button>
              <button
                onClick={() => setTextAlign('center')}
                className={`px-2 py-1 border rounded text-sm ${
                  textAlign === 'center' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300'
                }`}
              >
                ↔️
              </button>
              <button
                onClick={() => setTextAlign('right')}
                className={`px-2 py-1 border rounded text-sm ${
                  textAlign === 'right' 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300'
                }`}
              >
                ➡️
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Text Input */}
          <div className="flex-1 p-4">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text:
            </label>
            <textarea
              id="text-input"
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your text here..."
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={previewStyle}
            />
            <p className="text-xs text-gray-500 mt-2">
              Press Ctrl/Cmd + Enter to save, Escape to cancel
            </p>
          </div>

          {/* Preview */}
          <div className="w-px bg-gray-200"></div>
          <div className="flex-1 p-4">
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Preview:
            </div>
            <div
              ref={previewRef}
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg bg-white"
              style={previewStyle}
            >
              {text || 'Your text will appear here...'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          <p>💡 Tip: You can also double-click any text element on the canvas to edit it directly.</p>
        </div>
      </div>
    </div>
  );
}
