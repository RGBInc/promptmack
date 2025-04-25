import { Prompt, Category, User } from './types';

// Sample categories with beautiful colors
export const categories: Category[] = [
  { id: '1', name: 'Creative Writing', description: 'Prompts for stories, poems, and creative content', color: 'hsl(var(--chart-1))' },
  { id: '2', name: 'Business', description: 'Prompts for marketing, sales, and business writing', color: 'hsl(var(--chart-2))' },
  { id: '3', name: 'Programming', description: 'Prompts for coding, debugging, and documentation', color: 'hsl(var(--chart-3))' },
  { id: '4', name: 'Academic', description: 'Prompts for essays, research, and academic writing', color: 'hsl(var(--chart-4))' },
  { id: '5', name: 'Conversational', description: 'Prompts for chatbots and conversational AI', color: 'hsl(var(--chart-5))' },
];

// Sample tags
export const allTags = [
  'storytelling', 'marketing', 'productivity', 'analysis', 'creativity',
  'code', 'research', 'summary', 'email', 'blog', 'essay', 'fiction',
  'poetry', 'technical', 'data', 'SEO', 'social media', 'presentation',
  'report', 'long-form', 'short-form'
];

// Sample user
export const sampleUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  tokens: 5000,
  role: 'user',
  createdAt: new Date(),
};

// Sample prompts
export const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Creative Story Generator',
    description: 'Generates a creative story based on a few input parameters',
    content: 'Write a creative short story about [PROTAGONIST] who discovers [OBJECT] in [SETTING]. The story should have a tone that is [TONE] and include a surprise twist at the end.',
    tokens: 350,
    category: '1',
    tags: ['storytelling', 'creativity', 'fiction'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    featured: true,
  },
  {
    id: '2',
    title: 'Marketing Email Sequence',
    description: 'Creates a 3-part email sequence for product launches',
    content: 'Create a 3-part email sequence for launching [PRODUCT]. The first email should introduce the problem, the second should present the solution, and the third should include a compelling call to action with urgency.',
    tokens: 520,
    category: '2',
    tags: ['marketing', 'email', 'sales'],
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2023-03-15'),
    featured: false,
  },
  {
    id: '3',
    title: 'Code Refactoring Assistant',
    description: 'Helps refactor and improve existing code',
    content: 'Refactor the following code to improve readability, performance, and adherence to best practices. Explain your changes.\n\n```\n[CODE]\n```',
    tokens: 280,
    category: '3',
    tags: ['code', 'technical', 'productivity'],
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-12'),
    featured: true,
  },
  {
    id: '4',
    title: 'Academic Essay Structure',
    description: 'Provides a structure for academic essays',
    content: 'Create a detailed outline for an academic essay on the topic of [TOPIC]. Include an introduction with a thesis statement, at least three main sections with supporting evidence, and a conclusion that reinforces the thesis.',
    tokens: 420,
    category: '4',
    tags: ['academic', 'essay', 'research'],
    createdAt: new Date('2023-05-05'),
    updatedAt: new Date('2023-05-07'),
    featured: false,
  },
  {
    id: '5',
    title: 'Data Analysis Report',
    description: 'Generates a structured data analysis report',
    content: 'Analyze the following data and create a comprehensive report with key insights, trends, and recommendations:\n\n[DATA]',
    tokens: 650,
    category: '4',
    tags: ['data', 'analysis', 'report'],
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-06-22'),
    featured: true,
  },
  {
    id: '6',
    title: 'Blog Post Outline',
    description: 'Creates a detailed outline for engaging blog posts',
    content: 'Create a detailed outline for a blog post titled "[TITLE]" targeting [AUDIENCE]. Include a compelling introduction, at least 5 main sections with subpoints, and a conclusion with a call to action.',
    tokens: 380,
    category: '2',
    tags: ['blog', 'marketing', 'SEO'],
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2023-07-15'),
    featured: false,
  },
  {
    id: '7',
    title: 'Technical Documentation',
    description: 'Generates clear technical documentation',
    content: 'Create comprehensive technical documentation for [PRODUCT/FEATURE] including: overview, getting started guide, API references, examples, troubleshooting section, and FAQs.',
    tokens: 720,
    category: '3',
    tags: ['technical', 'documentation', 'code'],
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-10'),
    featured: true,
  },
  {
    id: '8',
    title: 'Poetry Generator',
    description: 'Creates poetry in various styles',
    content: 'Write a [STYLE] poem about [TOPIC] that evokes the emotion of [EMOTION]. The poem should be approximately [LENGTH] lines long.',
    tokens: 300,
    category: '1',
    tags: ['poetry', 'creativity', 'storytelling'],
    createdAt: new Date('2023-09-18'),
    updatedAt: new Date('2023-09-20'),
    featured: false,
  },
  {
    id: '9',
    title: 'AI Conversation Designer',
    description: 'Designs conversational flows for chatbots',
    content: 'Design a conversational flow for a chatbot that helps users with [TASK]. Include greeting, main options, responses to common questions, error handling, and closing.',
    tokens: 580,
    category: '5',
    tags: ['conversational', 'technical', 'productivity'],
    createdAt: new Date('2023-10-08'),
    updatedAt: new Date('2023-10-12'),
    featured: true,
  },
  {
    id: '10',
    title: 'Social Media Campaign',
    description: 'Plans a complete social media campaign',
    content: 'Create a 2-week social media campaign plan for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include post ideas for each platform (Twitter, Instagram, Facebook, LinkedIn), hashtags, best posting times, and engagement strategies.',
    tokens: 850,
    category: '2',
    tags: ['social media', 'marketing', 'content'],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-20'),
    featured: false,
  },
];

// Helper functions to simulate API calls
export async function getPrompts() {
  return samplePrompts;
}

export async function getPromptById(id: string) {
  return samplePrompts.find(prompt => prompt.id === id);
}

export async function getCategories() {
  return categories;
}

export async function getPromptsByCategory(categoryId: string) {
  return samplePrompts.filter(prompt => prompt.category === categoryId);
}

export async function getPromptsByTags(tags: string[]) {
  return samplePrompts.filter(prompt => 
    tags.some(tag => prompt.tags.includes(tag))
  );
}

export async function searchPrompts(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return samplePrompts.filter(prompt => 
    prompt.title.toLowerCase().includes(lowercaseQuery) ||
    prompt.description.toLowerCase().includes(lowercaseQuery) ||
    prompt.content.toLowerCase().includes(lowercaseQuery) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export async function getFeaturedPrompts() {
  return samplePrompts.filter(prompt => prompt.featured);
}