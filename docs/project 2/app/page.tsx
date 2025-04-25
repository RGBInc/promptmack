'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, Bookmark, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenCounter } from '@/components/TokenCounter';
import { categories } from '@/lib/data';
import { PromptGrid } from '@/components/prompt/PromptGrid';
import { TokenUsage } from '@/components/dashboard/TokenUsage';
import { RecentPrompts } from '@/components/dashboard/RecentPrompts';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-small-black/[0.05] dark:bg-grid-small-white/[0.05] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-30">
          <div className="w-3/4 h-3/4 bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-5xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-muted mb-6">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            <span>The ultimate prompt library - Powered by you</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover. Copy. <span className="text-primary">Create.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The largest collection of curated AI prompts for every use case. 
            Boost your creativity and productivity with our library of expert-crafted prompts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for prompts..."
                  className="w-full pl-10 pr-16 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Button className="h-12 px-6" type="submit" onClick={handleSearch}>
              Search
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <TokenCounter used={2800} total={5000} />
            <p className="text-muted-foreground">Your token balance</p>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
          <Link href="/explore">
            <Button variant="ghost" className="gap-2">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/explore?category=${category.id}`}>
              <div 
                className="rounded-lg p-6 h-32 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border"
                style={{ backgroundColor: `${category.color}20` }} // Using color with opacity
              >
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Prompts Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Prompts</h2>
          <Link href="/explore?featured=true">
            <Button variant="ghost" className="gap-2">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <PromptGrid featured={true} limit={6} />
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why PromptVault?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Discover</h3>
            <p className="text-muted-foreground">
              Browse thousands of expert-crafted prompts organized by categories and tags
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Copy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Use</h3>
            <p className="text-muted-foreground">
              Copy prompts directly to your clipboard and use them in your favorite AI tools
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Save</h3>
            <p className="text-muted-foreground">
              Build your personal collection of favorite prompts for quick access
            </p>
          </div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TokenUsage className="lg:col-span-2" />
          <RecentPrompts className="lg:col-span-1" />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 bg-muted rounded-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to elevate your AI interactions?</h2>
          <p className="text-muted-foreground mb-8">
            Join PromptVault today and get access to our complete library of prompts,
            token tracking, and personalized collections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8">Get Started</Button>
            <Button size="lg" variant="outline" className="px-8">Learn More</Button>
          </div>
        </div>
      </section>
    </div>
  );
}