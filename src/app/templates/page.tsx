'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Template {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  size: string;
  pages: string;
  binding: string;
  price: string;
  features: string[];
  popular: boolean;
}

const categories = [
  'All',
  'photo-books',
  'wedding',
  'baby',
  'travel',
  'yearbook',
  'coffee-table',
  'magazine'
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'photo-books':
        return 'Photo Books';
      case 'coffee-table':
        return 'Coffee Table';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const filterTemplates = () => {
    if (!Array.isArray(templates)) {
      setFilteredTemplates([]);
      return;
    }

    if (selectedCategory === 'All') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(template => template.category === selectedCategory));
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, filterTemplates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const result = await response.json();

      // Extract the data array from the API response
      if (result.success && Array.isArray(result.data)) {
        setTemplates(result.data);
      } else {
        console.error('API returned unexpected format:', result);
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTemplates([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchTemplates}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Photo Book Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed photo book templates.
              Each template is crafted to showcase your memories in the most beautiful way possible.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(filteredTemplates) && filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
                {template.popular && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <span className="text-2xl font-bold text-purple-600">
                    ${template.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{template.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium">{template.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pages:</span>
                    <span className="font-medium">{template.pages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Binding:</span>
                    <span className="font-medium">{template.binding}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>

                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Choose Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(filteredTemplates) && filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
