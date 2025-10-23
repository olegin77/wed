import React, { useState } from 'react';
import { WeddingTheme, THEME_CATEGORIES } from './types';
import { modernTheme } from './modern';
import { rusticTheme } from './rustic';
import { minimalistTheme } from './minimalist';

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  showPreview?: boolean;
  className?: string;
}

const themes: WeddingTheme[] = [
  modernTheme,
  rusticTheme,
  minimalistTheme,
];

export function ThemeSelector({
  currentTheme = 'modern',
  onThemeChange,
  showPreview = true,
  className = '',
}: ThemeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredThemes = themes.filter(theme => 
    selectedCategory === 'all' || theme.category === selectedCategory
  );

  const categories = [
    { id: 'all', name: 'Все темы' },
    ...Object.entries(THEME_CATEGORIES).map(([id, name]) => ({ id, name })),
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer ${
              currentTheme === theme.id
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onThemeChange?.(theme.id)}
          >
            {/* Preview Image */}
            {showPreview && (
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center text-4xl"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {theme.name.charAt(0)}
                </div>
              </div>
            )}

            {/* Theme Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {theme.name}
                </h3>
                {theme.isPremium && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {theme.description}
              </p>

              {/* Color Palette */}
              <div className="flex space-x-1 mb-3">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.background }}
                  title="Background"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {theme.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Selected Indicator */}
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No themes message */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Темы не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте выбрать другую категорию
          </p>
        </div>
      )}
    </div>
  );
}

// Theme Preview Component
interface ThemePreviewProps {
  theme: WeddingTheme;
  className?: string;
}

export function ThemePreview({ theme, className = '' }: ThemePreviewProps) {
  return (
    <div
      className={`p-6 rounded-lg ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      <h1
        className="text-3xl font-bold mb-4"
        style={{
          fontFamily: theme.typography.fontFamily.heading,
          color: theme.colors.primary,
        }}
      >
        {theme.name} Theme
      </h1>
      
      <p
        className="text-lg mb-6"
        style={{ color: theme.colors.textSecondary }}
      >
        {theme.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-2">Цветовая палитра</h3>
          <div className="flex space-x-2">
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: theme.colors.primary }}
              title="Primary"
            />
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: theme.colors.secondary }}
              title="Secondary"
            />
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: theme.colors.accent }}
              title="Accent"
            />
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-2">Типографика</h3>
          <p style={{ fontFamily: theme.typography.fontFamily.heading }}>
            Заголовок
          </p>
          <p style={{ fontFamily: theme.typography.fontFamily.body }}>
            Основной текст
          </p>
          <p style={{ fontFamily: theme.typography.fontFamily.accent }}>
            Декоративный текст
          </p>
        </div>
      </div>
    </div>
  );
}