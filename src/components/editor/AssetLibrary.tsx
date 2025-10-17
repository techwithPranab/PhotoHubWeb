'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AssetLibraryItem } from '@/types/editor';

interface AssetLibraryProps {
  onAssetSelect: (asset: AssetLibraryItem) => void;
}

const assetTypes = [
  { id: 'all', label: 'All', icon: '🎨' },
  { id: 'photo', label: 'Photos', icon: '📷' },
  { id: 'sticker', label: 'Stickers', icon: '✨' },
  { id: 'background', label: 'Backgrounds', icon: '🎭' }
];

const categories = {
  photo: [
    { id: 'all', label: 'All Photos' },
    { id: 'nature', label: 'Nature' },
    { id: 'people', label: 'People' },
    { id: 'abstract', label: 'Abstract' }
  ],
  sticker: [
    { id: 'all', label: 'All Stickers' },
    { id: 'icons', label: 'Icons' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'decorative', label: 'Decorative' }
  ],
  background: [
    { id: 'all', label: 'All Backgrounds' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'textures', label: 'Textures' },
    { id: 'gradients', label: 'Gradients' }
  ]
};

export default function AssetLibrary({ onAssetSelect }: Readonly<AssetLibraryProps>) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<AssetLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedAsset, setDraggedAsset] = useState<AssetLibraryItem | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/assets?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }

      const data = await response.json();
      if (data.success) {
        setAssets(data.data.assets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleDragStart = (e: React.DragEvent, asset: AssetLibraryItem) => {
    setDraggedAsset(asset);
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedAsset(null);
  };

  const handleAssetClick = (asset: AssetLibraryItem) => {
    onAssetSelect(asset);
  };

  const getCurrentCategories = () => {
    if (selectedType === 'all') return [];
    return categories[selectedType as keyof typeof categories] || [];
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg mb-3">Asset Library</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Type Filter */}
        <div className="flex space-x-1 mb-3">
          {assetTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedType === type.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {getCurrentCategories().length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getCurrentCategories().map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={fetchAssets}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && assets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No assets found</p>
          </div>
        )}

        {!loading && !error && assets.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                className={`relative group cursor-pointer border-2 border-transparent rounded-lg overflow-hidden hover:border-blue-300 transition-all ${
                  draggedAsset?.id === asset.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                onDragEnd={handleDragEnd}
                onClick={() => handleAssetClick(asset)}
                type="button"
                aria-label={`Add ${asset.title} to canvas`}
              >
                <div className="aspect-square bg-gray-100 relative">
                  {asset.type === 'sticker' || asset.type === 'background' ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{
                        __html: asset.url.includes('data:image/svg+xml')
                          ? decodeURIComponent(asset.url.split(',')[1])
                          : `<img src="${asset.url}" alt="${asset.title}" class="w-full h-full object-contain" />`
                      }}
                    />
                  ) : (
                    <Image
                      src={asset.thumbnail}
                      alt={asset.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 truncate">{asset.title}</p>
                  <p className="text-xs text-gray-500">{asset.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
          📁 Upload Your Assets
        </button>
      </div>
    </div>
  );
}
