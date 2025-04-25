'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PromptGrid } from '@/components/prompt/PromptGrid';
import { PromptFilters } from '@/components/prompt/PromptFilters';
import { FilterOptions } from '@/lib/types';

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({});
  
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');
    const tags = searchParams.get('tags');
    
    const initialFilters: FilterOptions = {};
    
    if (search) initialFilters.search = search;
    if (category) initialFilters.category = category;
    if (sort) initialFilters.sort = sort as any;
    if (tags) initialFilters.tags = tags.split(',');
    
    setFilters(initialFilters);
  }, [searchParams]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Prompts</h1>
        <PromptFilters initialFilters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      <PromptGrid filter={filters} />
    </div>
  );
}