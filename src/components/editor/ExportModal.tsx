'use client';

import React, { useState } from 'react';
import { ExportSettings, AlbumPage } from '@/types/editor';

interface ExportModalProps {
  currentPage: AlbumPage;
  onExport: (settings: ExportSettings) => Promise<void>;
  onClose: () => void;
}

export default function ExportModal({
  currentPage,
  onExport,
  onClose
}: Readonly<ExportModalProps>) {
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    quality: 'high',
    colorProfile: 'sRGB',
    bleed: 0
  });
  const [isExporting, setIsExporting] = useState(false);
  const [includeGuides, setIncludeGuides] = useState(false);
  const [includeBleed, setIncludeBleed] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await onExport(exportSettings);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFormatChange = (format: ExportSettings['format']) => {
    setExportSettings(prev => ({ ...prev, format }));
  };

  const handleQualityChange = (quality: ExportSettings['quality']) => {
    setExportSettings(prev => ({ ...prev, quality }));
  };

  const handleColorProfileChange = (colorProfile: ExportSettings['colorProfile']) => {
    setExportSettings(prev => ({ ...prev, colorProfile }));
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF', description: 'Best for printing and sharing', icon: '📄' },
    { value: 'jpg', label: 'JPEG', description: 'Best for web and social media', icon: '🖼️' },
    { value: 'png', label: 'PNG', description: 'Best for transparent backgrounds', icon: '🎨' }
  ] as const;

  const qualityOptions = [
    { value: 'low', label: 'Low (Fast)', description: '72 DPI - Web/Preview' },
    { value: 'medium', label: 'Medium', description: '150 DPI - Standard' },
    { value: 'high', label: 'High', description: '300 DPI - Print Quality' },
    { value: 'print', label: 'Print Ready', description: '600 DPI - Professional' }
  ] as const;

  const colorProfiles = [
    { value: 'sRGB', label: 'sRGB', description: 'Best for web and digital displays' },
    { value: 'Adobe RGB', label: 'Adobe RGB', description: 'Wider color gamut for professional printing' },
    { value: 'CMYK', label: 'CMYK', description: 'Print-ready color mode' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">Export Page</h3>
            <p className="text-sm text-gray-600">
              Page: {currentPage.pageType} • {currentPage.dimensions.width}×{currentPage.dimensions.height} {currentPage.dimensions.unit}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isExporting}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Export Format</h4>
            <div className="grid grid-cols-3 gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFormatChange(option.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    exportSettings.format === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quality & Resolution</h4>
            <div className="space-y-2">
              {qualityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    exportSettings.quality === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`Select ${option.label} quality`}
                >
                  <input
                    type="radio"
                    name="quality"
                    value={option.value}
                    checked={exportSettings.quality === option.value}
                    onChange={() => handleQualityChange(option.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Color Profile */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Color Profile</h4>
            <div className="space-y-2">
              {colorProfiles.map((profile) => (
                <label
                  key={profile.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    exportSettings.colorProfile === profile.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`Select ${profile.label} color profile`}
                >
                  <input
                    type="radio"
                    name="colorProfile"
                    value={profile.value}
                    checked={exportSettings.colorProfile === profile.value}
                    onChange={() => handleColorProfileChange(profile.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{profile.label}</div>
                    <div className="text-sm text-gray-600">{profile.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Additional Options</h4>
            <div className="space-y-3">
              <label className="flex items-center" aria-label="Include guides in export">
                <input
                  type="checkbox"
                  checked={includeGuides}
                  onChange={(e) => setIncludeGuides(e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Include Guides</div>
                  <div className="text-sm text-gray-600">Show grid lines and alignment guides</div>
                </div>
              </label>

              <label className="flex items-center" aria-label="Include bleed area in export">
                <input
                  type="checkbox"
                  checked={includeBleed}
                  onChange={(e) => setIncludeBleed(e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Include Bleed Area</div>
                  <div className="text-sm text-gray-600">Add 0.125&quot; bleed area for printing</div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Export Preview</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-medium">{exportSettings.format.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">Quality:</span>
                <span className="ml-2 font-medium">{exportSettings.quality}</span>
              </div>
              <div>
                <span className="text-gray-600">Color:</span>
                <span className="ml-2 font-medium">{exportSettings.colorProfile}</span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <span className="ml-2 font-medium">
                  {currentPage.dimensions.width}×{currentPage.dimensions.height} {currentPage.dimensions.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            💡 High quality exports may take longer to process
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isExporting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
