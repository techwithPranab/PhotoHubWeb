'use client';

import React, { useState, useEffect } from 'react';
import { AlbumPage } from '@/types/editor';

interface PageManagerProps {
  albumId: string;
  currentPageId?: string;
  onPageSelect: (page: AlbumPage) => void;
  onPageCreate: () => void;
  onPageDelete: (pageId: string) => void;
}

export default function PageManager({
  albumId,
  currentPageId,
  onPageSelect,
  onPageCreate,
  onPageDelete
}: Readonly<PageManagerProps>) {
  const [pages, setPages] = useState<AlbumPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, [albumId]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/editor/pages/${albumId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }

      const data = await response.json();
      if (data.success) {
        setPages(data.data.pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      const response = await fetch(`/api/editor/pages/${albumId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType: 'content',
          layoutTemplate: 'blank',
          dimensions: { width: 800, height: 600, unit: 'px' }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create page');
      }

      const data = await response.json();
      if (data.success) {
        setPages(prev => [...prev, data.data]);
        onPageCreate();
      }
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (pages.length <= 1) {
      alert('Cannot delete the last page');
      return;
    }

    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/editor/pages/${albumId}/${pageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      setPages(prev => prev.filter(p => p._id !== pageId));
      onPageDelete(pageId);
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  const getPageTypeIcon = (pageType: AlbumPage['pageType']) => {
    switch (pageType) {
      case 'cover':
        return '📖';
      case 'back':
        return '📔';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchPages}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Pages</h3>
          <button
            onClick={handleCreatePage}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center space-x-1"
          >
            <span>+</span>
            <span>Add Page</span>
          </button>
        </div>
        <p className="text-sm text-gray-600">{pages.length} page{pages.length === 1 ? '' : 's'}</p>
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={page._id}
              type="button"
              className={`group relative border-2 rounded-lg cursor-pointer transition-all w-full text-left ${
                currentPageId === page._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onPageSelect(page)}
            >
              {/* Page Preview */}
              <div className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-16 border rounded shadow-sm flex items-center justify-center text-xs ${
                        currentPageId === page._id ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg">{getPageTypeIcon(page.pageType)}</div>
                        <div className="text-xs text-gray-500">{page.pageNumber}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">
                        Page {page.pageNumber}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {page.elements.length} element{page.elements.length === 1 ? '' : 's'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 capitalize">
                      {page.pageType} • {page.dimensions.width}×{page.dimensions.height} {page.dimensions.unit}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {page.layoutTemplate || 'Custom layout'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageSelect(page);
                    }}
                    className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xs"
                    title="Edit page"
                  >
                    ✏️
                  </button>
                  
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page._id);
                      }}
                      className="p-1 bg-white border border-red-300 rounded hover:bg-red-50 text-xs text-red-600"
                      title="Delete page"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          💡 Tip: Click on a page to edit it. Use the + button to add new pages.
        </div>
      </div>
    </div>
  );
}
