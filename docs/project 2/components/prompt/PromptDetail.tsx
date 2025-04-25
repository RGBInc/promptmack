'use client';

import { useState } from 'react';
import { Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Prompt } from '@/lib/types';
import { categories } from '@/lib/data';
import { format } from 'date-fns';

interface PromptDetailProps {
  prompt: Prompt;
  onSave?: (promptId: string) => void;
  isSaved?: boolean;
}

export default function PromptDetail({ prompt, onSave, isSaved = false }: PromptDetailProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  
  const category = categories.find(c => c.id === prompt.category);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(prompt.id);
    }
    setSaved(!saved);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{prompt.title}</h2>
        <Badge 
          className="ml-2" 
          style={{ backgroundColor: category?.color || 'hsl(var(--primary))' }}
        >
          {category?.name || 'Uncategorized'}
        </Badge>
      </div>
      
      <p className="text-muted-foreground">{prompt.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {prompt.tags.map(tag => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="border rounded-md p-4 bg-muted/50 relative group mt-6">
        <pre className="text-sm whitespace-pre-wrap font-mono">{prompt.content}</pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>Created: {format(prompt.createdAt, 'MMM d, yyyy')}</p>
          <p>Tokens: {prompt.tokens}</p>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleSave}>
              {saved ? 
                <><BookmarkCheck className="h-4 w-4" /> Saved</> : 
                <><Bookmark className="h-4 w-4" /> Save</>
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{saved ? 'Remove from collection' : 'Add to collection'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}