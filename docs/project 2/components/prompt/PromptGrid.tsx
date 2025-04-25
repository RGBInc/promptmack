'use client';

import { useState, useEffect } from 'react';
import { PromptCard } from './PromptCard';
import { Prompt, FilterOptions, SortOption } from '@/lib/types';
import { getPrompts, getPromptsByCategory, getPromptsByTags, searchPrompts, getFeaturedPrompts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptGridProps {
  initialPrompts?: Prompt[];
  filter?: FilterOptions;
  savedPrompts?: string[];
  featured?: boolean;
  limit?: number;
}

export function PromptGrid({ 
  initialPrompts,
  filter,
  savedPrompts = [],
  featured = false,
  limit
}: PromptGridProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts || []);
  const [loading, setLoading] = useState(!initialPrompts);
  
  useEffect(() => {
    if (!initialPrompts) {
      const fetchPrompts = async () => {
        setLoading(true);
        try {
          let fetchedPrompts: Prompt[] = [];
          
          if (featured) {
            fetchedPrompts = await getFeaturedPrompts();
          } else if (filter?.category) {
            fetchedPrompts = await getPromptsByCategory(filter.category);
          } else if (filter?.tags && filter.tags.length > 0) {
            fetchedPrompts = await getPromptsByTags(filter.tags);
          } else if (filter?.search) {
            fetchedPrompts = await searchPrompts(filter.search);
          } else {
            fetchedPrompts = await getPrompts();
          }
          
          // Apply sorting if provided
          if (filter?.sort) {
            fetchedPrompts = sortPrompts(fetchedPrompts, filter.sort);
          }
          
          // Apply limit if provided
          if (limit && limit > 0) {
            fetchedPrompts = fetchedPrompts.slice(0, limit);
          }
          
          setPrompts(fetchedPrompts);
        } catch (error) {
          console.error('Error fetching prompts:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPrompts();
    }
  }, [initialPrompts, filter, featured, limit]);
  
  const sortPrompts = (promptsToSort: Prompt[], sortOption: SortOption): Prompt[] => {
    const sortedPrompts = [...promptsToSort];
    
    switch (sortOption) {
      case 'newest':
        return sortedPrompts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return sortedPrompts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'mostTokens':
        return sortedPrompts.sort((a, b) => b.tokens - a.tokens);
      case 'leastTokens':
        return sortedPrompts.sort((a, b) => a.tokens - b.tokens);
      case 'alphabetical':
        return sortedPrompts.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sortedPrompts;
    }
  };
  
  const handleSavePrompt = (promptId: string) => {
    // This would typically update the user's saved prompts in a database
    console.log(`Toggling save state for prompt: ${promptId}`);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    );
  }
  
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No prompts found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onSave={handleSavePrompt}
          isSaved={savedPrompts.includes(prompt.id)}
        />
      ))}
    </div>
  );
}