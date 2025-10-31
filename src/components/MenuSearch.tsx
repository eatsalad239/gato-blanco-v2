import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { MagnifyingGlass, X, Funnel } from '@phosphor-icons/react';
import { MenuItem } from '../types';
import { useLanguageStore } from '../lib/translations';

interface MenuSearchProps {
  items: MenuItem[];
  onFilterChange: (filteredItems: MenuItem[]) => void;
}

export function MenuSearch({ items, onFilterChange }: MenuSearchProps) {
  const { currentLanguage } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return Array.from(cats);
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const nameEn = item.name.en?.toLowerCase() || '';
        const nameEs = item.name.es?.toLowerCase() || '';
        const descEn = item.description.en?.toLowerCase() || '';
        const descEs = item.description.es?.toLowerCase() || '';
        return nameEn.includes(query) || nameEs.includes(query) || 
               descEn.includes(query) || descEs.includes(query);
      });
    }

    return filtered;
  }, [items, searchQuery, selectedCategory]);

  React.useEffect(() => {
    onFilterChange(filteredItems);
  }, [filteredItems, onFilterChange]);

  const isSpanish = currentLanguage?.code === 'es';

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlass 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          weight="bold"
        />
        <Input
          type="text"
          placeholder={isSpanish ? "Buscar menú..." : "Search menu..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} weight="bold" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedCategory === null
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Funnel size={16} className="inline mr-1" weight="bold" />
          {isSpanish ? 'Todos' : 'All'}
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
              selectedCategory === category
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isSpanish 
            ? `${filteredItems.length} resultado${filteredItems.length !== 1 ? 's' : ''} encontrado${filteredItems.length !== 1 ? 's' : ''}`
            : `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} found`
          }
        </div>
      )}
    </div>
  );
}

