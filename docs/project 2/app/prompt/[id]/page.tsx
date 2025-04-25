'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPromptById, getPrompts } from '@/lib/data';
import { Prompt } from '@/lib/types';
import PromptDetail from '@/components/prompt/PromptDetail';
import { PromptGrid } from '@/components/prompt/PromptGrid';
import { Skeleton } from '@/components/ui/skeleton';

// This needs to be a Server Component function
export async function generateStaticParams() {
  const prompts = await getPrompts();
  return prompts.map((prompt) => ({
    id: prompt.id.toString(),
  }));
}

export default function PromptPage() {
  const params = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
      try {
        const promptId = params.id as string;
        const fetchedPrompt = await getPromptById(promptId);
        
        if (fetchedPrompt) {
          setPrompt(fetchedPrompt);
        } else {
          // Handle not found
          router.push('/explore');
        }
      } catch (error) {
        console.error('Error fetching prompt:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrompt();
  }, [params.id, router]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
          
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-6" />
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
        <p className="text-muted-foreground mb-6">The prompt you're looking for doesn't seem to exist.</p>
        <Button onClick={() => router.push('/explore')}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="border rounded-lg p-6 mb-12 bg-card">
          <PromptDetail prompt={prompt} />
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Similar Prompts</h2>
          <PromptGrid 
            filter={{ 
              category: prompt.category,
              tags: prompt.tags.slice(0, 2)
            }} 
            limit={3} 
          />
        </div>
      </div>
    </div>
  );
}