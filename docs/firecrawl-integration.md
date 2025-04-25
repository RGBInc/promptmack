# Firecrawl Integration

This document outlines the integration of Firecrawl tools into the Promptmack AI agent.

## Overview

Firecrawl provides powerful web interaction capabilities to our AI agent, including web scraping, crawling, site mapping, search, data extraction, and agent-based web navigation. All Firecrawl tools use the Firecrawl API, which requires the `FIRECRAWL_API_KEY` environment variable to be set.

## Implementation Status

All Firecrawl tools have been fully integrated into our application:

| Feature | Component | Message Loading State | Message Result State | Route.ts Tool | Suggested Action |
|---------|-----------|----------------------|---------------------|---------------|------------------|
| Web Scraping | ✅ FirecrawlScrape | ✅ Implemented | ✅ Implemented | ✅ firecrawlScrape | ✅ "Scrape Content" |
| Web Crawling | ✅ FirecrawlCrawl | ✅ Implemented | ✅ Implemented | ✅ firecrawlCrawl | ✅ "Crawl Website" |
| Site Mapping | ✅ FirecrawlMap | ✅ Implemented | ✅ Implemented | ✅ firecrawlMap | ✅ "Map Website" |
| Web Search | ✅ FirecrawlSearch | ✅ Implemented | ✅ Implemented | ✅ firecrawlSearch | ✅ "Search Web" |
| Data Extraction | ✅ FirecrawlExtract | ✅ Implemented | ✅ Implemented | ✅ firecrawlExtract | ✅ "Extract Data" |
| Web Navigation | ✅ FirecrawlAgent | ✅ Implemented | ✅ Implemented | ✅ firecrawlAgent | ✅ "Navigate Website" |

## Component Details

### 1. Web Scraping (FirecrawlScrape)
- **Purpose**: Extracts clean content from specific web pages
- **Features**: Supports markdown rendering, link extraction, and screenshots
- **File**: `components/firecrawl/scrape.tsx`

### 2. Web Crawling (FirecrawlCrawl)
- **Purpose**: Crawls entire websites (multiple pages)
- **Features**: Pagination controls, filterable results, progress tracking
- **File**: `components/firecrawl/crawl.tsx`

### 3. Site Mapping (FirecrawlMap)
- **Purpose**: Visualizes all URLs on a website in a graph format
- **Features**: Interactive node graph, filterable link list
- **File**: `components/firecrawl/map.tsx`

### 4. Web Search (FirecrawlSearch)
- **Purpose**: Searches the web and retrieves content from search results
- **Features**: Expandable results, content preview
- **File**: `components/firecrawl/search.tsx`

### 5. Data Extraction (FirecrawlExtract)
- **Purpose**: Extracts structured data from websites using AI
- **Features**: JSON data display, expandable/collapsible items
- **File**: `components/firecrawl/extract.tsx`

### 6. Web Navigation (FirecrawlAgent)
- **Purpose**: Uses an AI agent to intelligently navigate websites
- **Features**: Displays agent instructions, responses, and screenshots
- **File**: `components/firecrawl/agent.tsx`

## Integration Points

1. **route.ts**
   - All tools are defined in the API route
   - Each tool is properly documented with parameters

2. **message.tsx**
   - All components are imported
   - Both loading and result states are implemented for each tool

3. **multimodal-input.tsx**
   - Suggested actions for all Firecrawl tools are implemented
   - Icons and labels for user-friendly interface

## Environment Variables

```
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

## Usage Example

The AI agent can use these tools to:
1. Search the web for information (`firecrawlSearch`)
2. Extract specific content from URLs (`firecrawlScrape`)
3. Map website structures (`firecrawlMap`) 
4. Extract structured data (`firecrawlExtract`)
5. Navigate complex websites (`firecrawlAgent`)
6. Crawl entire websites for comprehensive analysis (`firecrawlCrawl`) 