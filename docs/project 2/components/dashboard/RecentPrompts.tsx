import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import { format } from 'date-fns';

// Sample recent prompts
const recentPrompts = [
  {
    id: '1',
    title: 'Creative Story Generator',
    category: '1',
    tokens: 350,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '3',
    title: 'Code Refactoring Assistant',
    category: '3',
    tokens: 280,
    createdAt: new Date('2023-04-10'),
  },
  {
    id: '5',
    title: 'Data Analysis Report',
    category: '4',
    tokens: 650,
    createdAt: new Date('2023-06-20'),
  },
  {
    id: '9',
    title: 'AI Conversation Designer',
    category: '5',
    tokens: 580,
    createdAt: new Date('2023-10-08'),
  },
];

interface RecentPromptsProps {
  className?: string;
}

export function RecentPrompts({ className }: RecentPromptsProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recent Prompts</CardTitle>
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View All
            </Button>
          </Link>
        </div>
        <CardDescription>Your recently viewed prompts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentPrompts.map((prompt) => {
            const category = categories.find(c => c.id === prompt.category);
            
            return (
              <div key={prompt.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="font-medium">{prompt.title}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge 
                      className="text-xs" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--primary))' }}
                    >
                      {category?.name || 'Uncategorized'}
                    </Badge>
                    <span>{prompt.tokens} tokens</span>
                    <span>•</span>
                    <span>{format(prompt.createdAt, 'MMM d')}</span>
                  </div>
                </div>
                <Link href={`/prompt/${prompt.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}