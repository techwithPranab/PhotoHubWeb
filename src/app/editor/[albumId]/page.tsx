'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import CanvasEditor from '@/components/editor/CanvasEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import AssetLibrary from '@/components/editor/AssetLibrary';
import ExportModal from '@/components/editor/ExportModal';
import PageManager from '@/components/editor/PageManager';
import { AlbumPage, ExportSettings } from '@/types/editor';

function EditorContent() {
  const { state, dispatch, addElementFromAsset, saveCurrentPage } = useEditor();
  const params = useParams();
  const albumId = params.albumId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        // First get or create editor project
        const projectResponse = await fetch('/api/editor/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ albumId })
        });

        if (!projectResponse.ok) {
          throw new Error('Failed to create editor project');
        }

        // Then get pages
        const pagesResponse = await fetch(`/api/editor/pages/${albumId}?limit=1`);
        if (!pagesResponse.ok) {
          throw new Error('Failed to load pages');
        }

        const pagesData = await pagesResponse.json();
        let currentPage: AlbumPage;
        
        if (pagesData.success && pagesData.data.pages.length > 0) {
          currentPage = pagesData.data.pages[0];
        } else {
          // Create a new page
          const createPageResponse = await fetch(`/api/editor/pages/${albumId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pageType: 'content',
              layoutTemplate: 'blank'
            })
          });

          if (!createPageResponse.ok) {
            throw new Error('Failed to create page');
          }

          const newPageData = await createPageResponse.json();
          if (newPageData.success) {
            currentPage = newPageData.data;
          } else {
            throw new Error('Failed to create page');
          }
        }

        // Set the current page in the editor context
        dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      loadPage();
    }
  }, [albumId, dispatch]);

  const handleExport = async (settings: ExportSettings) => {
    if (!state.currentPage) {
      throw new Error('No page to export');
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: state.currentPage._id,
          settings
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const data = await response.json();
      if (data.success) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = data.data.downloadUrl;
        link.download = data.data.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        setShowExportModal(false);
      }
    } catch (err) {
      console.error('Export error:', err);
      throw err;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveCurrentPage();
    } catch (err) {
      console.error('Save failed:', err);
      // You could show an error notification here
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Photo Studio Editor</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving && (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main Editor Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar - Asset Library */}
        <div className="w-64 bg-white border-r border-gray-200">
          <AssetLibrary onAssetSelect={addElementFromAsset} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 p-6">
          <div className="h-full flex items-center justify-center">
            <CanvasEditor
              width={1000}
              height={700}
              className="border border-gray-300"
            />
          </div>
        </div>

        {/* Right Sidebar - Pages & Properties */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Page Manager */}
          <div className="h-1/2 border-b border-gray-200">
            <PageManager
              albumId={albumId}
              currentPageId={state.currentPage?._id}
              onPageSelect={(page) => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}
              onPageCreate={() => {
                // Refresh the current state or navigate to new page
                console.log('Page created');
              }}
              onPageDelete={(pageId) => {
                // Handle page deletion
                console.log('Page deleted:', pageId);
              }}
            />
          </div>

          {/* Properties */}
          <div className="h-1/2 p-4">
            <h3 className="font-medium mb-4">Properties</h3>
            <div className="space-y-4">
              <div>
                <h4 className="block text-sm font-medium text-gray-700 mb-1">
                  Grid
                </h4>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />{' '}
                  Show Grid
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />{' '}
                  Snap to Grid
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && state.currentPage && (
        <ExportModal
          currentPage={state.currentPage}
          onExport={handleExport}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}
