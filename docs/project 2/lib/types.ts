export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tokens: number;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  tokens: number;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Collection {
  id: string;
  name: string;
  userId: string;
  promptIds: string[];
  createdAt: Date;
}

export type SortOption = 'newest' | 'oldest' | 'mostTokens' | 'leastTokens' | 'alphabetical';

export interface FilterOptions {
  category?: string;
  tags?: string[];
  search?: string;
  sort?: SortOption;
}