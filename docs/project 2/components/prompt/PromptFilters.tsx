'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { categories, allTags } from '@/lib/data';
import { FilterOptions, SortOption } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PromptFiltersProps {
  initialFilters?: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function PromptFilters({ initialFilters = {}, onFilterChange }: PromptFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [searchValue, setSearchValue] = useState(initialFilters.search || '');
  const [activeTags, setActiveTags] = useState<string[]>(initialFilters.tags || []);
  
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostTokens', label: 'Most Tokens' },
    { value: 'leastTokens', label: 'Least Tokens' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];
  
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchValue });
  };
  
  const handleCategoryChange = (categoryId: string | undefined) => {
    setFilters({ ...filters, category: categoryId });
  };
  
  const handleTagToggle = (tag: string) => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    
    setActiveTags(updatedTags);
    setFilters({ ...filters, tags: updatedTags.length > 0 ? updatedTags : undefined });
  };
  
  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sort: value as SortOption });
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchValue('');
    setActiveTags([]);
  };
  
  const hasActiveFilters = Boolean(
    filters.search || 
    filters.category || 
    (filters.tags && filters.tags.length > 0) || 
    filters.sort
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search prompts..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => {
                  setSearchValue('');
                  if (filters.search) {
                    setFilters({ ...filters, search: undefined });
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Category
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuRadioGroup value={filters.category} onValueChange={handleCategoryChange}>
                <DropdownMenuRadioItem value={undefined}>All Categories</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuRadioItem
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="h-2 w-2 rounded-full shrink-0" 
                      style={{ backgroundColor: category.color }} 
                    />
                    {category.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              {allTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={activeTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filters.sort} onValueChange={handleSortChange}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.id === filters.category)?.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => handleCategoryChange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => handleTagToggle(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.sort && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sorted by: {sortOptions.find(o => o.value === filters.sort)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => handleSortChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs h-7"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}