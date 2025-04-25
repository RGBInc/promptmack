'use client';

import { useState } from 'react';
import { Check, Copy, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PromptDetail from './PromptDetail';

interface PromptCardProps {
  prompt: Prompt;
  onSave?: (promptId: string) => void;
  isSaved?: boolean;
}

export function PromptCard({ prompt, onSave, isSaved = false }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [showDetail, setShowDetail] = useState(false);
  
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
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{prompt.title}</CardTitle>
            <Badge 
              className="ml-2 shrink-0" 
              style={{ backgroundColor: category?.color || 'hsl(var(--primary))' }}
            >
              {category?.name || 'Uncategorized'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {prompt.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {prompt.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{prompt.tokens}</span> tokens
          </div>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
                  {saved ? 
                    <BookmarkCheck className="h-4 w-4 text-primary" /> : 
                    <Bookmark className="h-4 w-4" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{saved ? 'Saved to collection' : 'Save to collection'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetail(true)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View prompt</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                  {copied ? 
                    <Check className="h-4 w-4 text-primary" /> : 
                    <Copy className="h-4 w-4" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy prompt'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prompt Details</DialogTitle>
          </DialogHeader>
          <PromptDetail prompt={prompt} onSave={handleSave} isSaved={saved} />
        </DialogContent>
      </Dialog>
    </>
  );
}