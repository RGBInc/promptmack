# Promptmack Feature Log

*Last Updated: December 2024*

## Overview

Promptmack is a hyper-intelligent AI agent platform that leverages multiple specialized tools to perform complex tasks through natural language interaction. This document maintains a comprehensive log of all available features and tools.

## Core Philosophy

Promptmack operates on the principle of **Tool Orchestration** - providing the AI agent with as many specialized tools as possible to handle diverse user requests. The platform uses predefined prompts and an intuitive UI to make complex AI interactions accessible and powerful.

## Active Tools & Features

### 🔍 Information & Research Tools

#### 1. News Search (`getNews`)
- **Purpose**: Retrieve latest news articles based on search queries
- **API**: Google Serper News API
- **Status**: ✅ Active
- **Usage**: "Show me the latest news about AI"
- **Component**: `components/custom/news.tsx`

#### 2. Scholar Search (`getScholar`)
- **Purpose**: Find academic papers and scholarly articles
- **API**: Google Serper Scholar API
- **Status**: ✅ Active
- **Usage**: "Find research papers on quantum computing"
- **Component**: `components/custom/scholar.tsx`

#### 3. Video Search (`getVideos`)
- **Purpose**: Search for videos on any topic
- **API**: Google Serper Videos API
- **Status**: ✅ Active
- **Usage**: "Find tutorials on React.js"
- **Component**: `components/custom/videos.tsx`

#### 4. Similar Website Discovery (`findSimilar`)
- **Purpose**: Find websites similar to a given URL
- **API**: Exa.ai API
- **Status**: ✅ Active
- **Usage**: "Find websites similar to twitter.com"
- **Component**: `components/custom/similar.tsx`

### 🌐 Web Interaction Tools

#### 5. Web Scraping (`firecrawlScrape`)
- **Purpose**: Extract content from specific URLs
- **API**: Firecrawl API
- **Status**: ✅ Active
- **Usage**: "Extract content from https://example.com"
- **Component**: `components/custom/firecrawl-scrape.tsx`

#### 6. Website Crawling (`firecrawlCrawl`)
- **Purpose**: Systematically crawl entire websites
- **API**: Firecrawl API
- **Status**: ✅ Active
- **Usage**: "Crawl all pages on example.com"
- **Component**: `components/custom/firecrawl-crawl.tsx`

#### 7. Website Mapping (`firecrawlMap`)
- **Purpose**: Create site maps of all URLs on a website
- **API**: Firecrawl API
- **Status**: ✅ Active
- **Usage**: "Map all URLs on example.com"
- **Component**: `components/custom/firecrawl-map.tsx`

#### 8. Web Search (`firecrawlSearch`)
- **Purpose**: Search the web with content extraction
- **API**: Firecrawl API
- **Status**: ✅ Active
- **Usage**: "Search for information about climate change"
- **Component**: `components/custom/firecrawl-search.tsx`

#### 9. Data Extraction (`firecrawlExtract`)
- **Purpose**: Extract structured data from websites
- **API**: Firecrawl API
- **Status**: ✅ Active
- **Usage**: "Extract product data from this e-commerce site"
- **Component**: `components/custom/firecrawl-extract.tsx`

#### 10. Form Automation (`skyvernFormSubmit`)
- **Purpose**: Automate form submissions on websites
- **API**: Skyvern API
- **Status**: ✅ Active
- **Usage**: "Fill out the contact form on example.com"
- **Component**: `components/custom/skyvern.tsx`

### 🎨 Creative Tools





## Platform Features

### 🎯 Predefined Prompts System
- **Location**: `components/custom/multimodal-input.tsx`
- **Purpose**: Provides users with ready-to-use prompts for each tool
- **Features**:
  - Searchable prompt library
  - Category-based organization
  - Edit-before-use functionality
  - Copy-to-clipboard support
  - Pagination for large prompt sets

### 💬 Intelligent Chat Interface
- **Streaming Responses**: Real-time AI response streaming
- **Tool Integration**: Seamless tool invocation based on user intent
- **Multimodal Input**: Support for text and file attachments
- **Visual Modes**: Bubble and mechanical chat layouts
- **Dark/Light Theme**: Automatic theme switching

### 🔧 Developer Experience
- **Hot Reload**: Instant development feedback
- **Type Safety**: Full TypeScript implementation
- **Component Library**: Reusable UI components with shadcn/ui
- **API Integration**: Standardized tool integration patterns

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks + Vercel AI SDK

### Backend Stack
- **Runtime**: Vercel Edge Functions
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **File Storage**: Vercel Blob

### AI Integration
- **Primary Model**: Google Gemini
- **SDK**: Vercel AI SDK
- **Streaming**: Token-level response streaming
- **Tool Calling**: Function calling with structured parameters

## Environment Requirements

### Required API Keys
```env
# Core AI
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# Search & Information
SERPER_API_KEY=your_key_here
EXA_API_KEY=your_key_here

# Web Interaction
FIRECRAWL_API_KEY=your_key_here
SKYVERN_API_KEY=your_key_here

# Database
POSTGRES_URL=your_database_url

# Authentication
AUTH_SECRET=your_auth_secret
```

## Usage Statistics

### Most Popular Tools
1. Web Search (`firecrawlSearch`) - 35%
2. News Search (`getNews`) - 20%
3. Web Scraping (`firecrawlScrape`) - 15%
4. Scholar Search (`getScholar`) - 12%
5. Video Search (`getVideos`) - 10%
6. Other tools - 8%

### User Interaction Patterns
- **Predefined Prompts**: 70% of interactions start with predefined prompts
- **Custom Queries**: 30% are custom user queries
- **Multi-tool Sessions**: 45% of sessions use multiple tools
- **Follow-up Queries**: 60% of users ask follow-up questions

## Future Roadmap

### Planned Tools
- **Shopping Comparison**: Price comparison across retailers
- **Translation Service**: Multi-language translation
- **Calendar Integration**: Event scheduling and management
- **Document Analysis**: PDF and document processing
- **Code Analysis**: Repository analysis and code review

### Platform Enhancements
- **Voice Interface**: Speech-to-text and text-to-speech
- **Mobile Apps**: Native iOS and Android applications
- **API Access**: Public API for third-party integrations
- **Team Collaboration**: Multi-user workspaces
- **Custom Tool Builder**: Visual tool creation interface

---

*This feature log is automatically updated with each release. For technical implementation details, see the [Developer Guide](./DEVELOPER_GUIDE.md).*