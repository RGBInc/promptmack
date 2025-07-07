import { convertToCoreMessages, Message, streamText } from "ai";
import axios from "axios";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  saveChat,
} from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `
You are Promptmack, a sophisticated AI assistant designed to be exceptionally helpful, knowledgeable, and personable.

## Core Identity
- You possess vast knowledge across numerous domains and strive to provide accurate, nuanced responses
- You maintain a friendly, conversational tone while remaining professional
- You're thoughtful and considerate in your interactions

## Capabilities
- You have access to the following tools: getNews, getScholar, getVideos, findSimilar, skyvernFormSubmit, firecrawlScrape, firecrawlCrawl, firecrawlMap, firecrawlSearch, firecrawlExtract, dataTable
- Use these tools proactively when they would enhance your response
- When using tools, explain briefly why you're using them
- Use dataTable to display structured data (arrays of objects) in a clean, formatted table when appropriate

## Firecrawl Tools
- Use firecrawl-scrape to get clean content from specific web pages
- Use firecrawl-crawl to extract content from entire websites (multiple pages)
- Use firecrawl-map to quickly identify all URLs on a website
- Use firecrawl-search to search the web and get relevant results with content
- Use firecrawl-extract to get structured data from websites using AI



## Response Style
- Be concise but comprehensive
- Use clear, accessible language
- Structure complex information logically
- Provide actionable insights when appropriate
- Include relevant sources when citing facts

## Boundaries
- You cannot access or mention weather, flight or other deactivated tools
- Today's date is ${new Date().toLocaleDateString()}

## Interaction Guidelines
- Ask clarifying questions when user requests are ambiguous
- Suggest relevant follow-up questions when appropriate
- Maintain conversation context across multiple exchanges
- Adapt your tone and level of detail based on the user's needs
- Acknowledge limitations transparently when you cannot fulfill a request
- Personalize responses when you have sufficient context about the user
`,
    messages: coreMessages,
    tools: {
      getNews: {
        description: "Get news articles based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for news"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/news`,
              {
                params: {
                  q: query,
                  location: "United States",
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("News API error:", error);
            throw error;
          }
        },
      },
      getVideos: {
        description: "Get videos based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for videos"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/videos`,
              {
                params: {
                  q: query,
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("Videos API error:", error);
            throw error;
          }
        },
      },
      getScholar: {
        description: "Get scholarly articles based on a search query",
        parameters: z.object({
          query: z.string().describe("Search query for scholarly articles"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await axios.get(
              `https://google.serper.dev/scholar`,
              {
                params: {
                  q: query,
                },
                headers: {
                  'X-API-KEY': process.env.SERPER_API_KEY,
                },
              }
            );
            return response.data;
          } catch (error) {
            console.error("Scholar API error:", error);
            throw error;
          }
        },
      },
      skyvernFormSubmit: {
        description: "Submit forms and interact with web pages",
        parameters: z.object({
          url: z.string().describe("Target URL for form submission"),
          navigationGoal: z.string().describe("Goal for navigating the webpage"),
          navigationPayload: z.object({
            name: z.string(),
            email: z.string(),
            additionalInformation: z.string().optional()
          })
        }),
        execute: async ({ url, navigationGoal, navigationPayload }) => {
          try {
            const response = await axios.post(
              'https://api.skyvern.com/api/v1/tasks',
              {
                url,
                webhook_callback_url: null,
                navigation_goal: navigationGoal,
                data_extraction_goal: null,
                proxy_location: 'RESIDENTIAL',
                error_code_mapping: null,
                navigation_payload: navigationPayload,
                extracted_information_schema: null
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': process.env.SKYVERN_API_KEY
                }
              }
            );
            return response.data;
          } catch (error) {
            console.error("Skyvern API error:", error);
            throw error;
          }
        },
      },
      findSimilar: {
        description: "Find similar websites based on a URL",
        parameters: z.object({
          url: z.string().describe("URL to find similar websites for"),
        }),
        execute: async ({ url }) => {
          try {
            // Extract base domain and company name
            const baseDomain = url.replace(/^https?:\/\//, '')  // Remove protocol
                                .replace(/^www\./, '')          // Remove www
                                .split('/')[0];                 // Remove path
            
            // Get company name (e.g., "lemlist" from "lemlist.com")
            const companyName = baseDomain.split('.')[0];

            const response = await axios.post(
              'https://api.exa.ai/findSimilar',
              {
                query: url,
                url: url,
                numResults: 10,
                excludeDomains: [baseDomain],
                excludeText: [companyName],
                contents: {
                  highlights: true,
                  summary: true
                }
              },
              {
                headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'x-api-key': process.env.EXA_API_KEY
                }
              }
            );
            return response.data;
          } catch (error) {
            console.error("Exa API error:", error);
            throw error;
          }
        },
      },
      firecrawlScrape: {
        description: "Scrape and extract clean content from a specific URL",
        parameters: z.object({
          url: z.string().describe("The URL to scrape content from"),
          formats: z.array(z.enum(['markdown', 'html', 'rawHtml', 'links', 'screenshot'])).optional().describe("Formats to return, defaults to markdown"),
          actions: z.array(z.object({
            type: z.string(),
            milliseconds: z.number().optional(),
            selector: z.string().optional(),
            text: z.string().optional(),
            key: z.string().optional()
          })).optional().describe("Optional actions to perform before scraping (click, wait, scroll, etc.)"),
        }),
        execute: async ({ url, formats = ['markdown'], actions }) => {
          try {
            const apiKey = process.env.FIRECRAWL_API_KEY;
            const response = await axios.post(
              'https://api.firecrawl.dev/v1/scrape',
              {
                url,
                formats,
                actions
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                }
              }
            );
            return response.data;
          } catch (error) {
            console.error("Firecrawl Scrape error:", error);
            throw error;
          }
        },
      },
      firecrawlCrawl: {
        description: "Crawl an entire website and extract content from all pages",
        parameters: z.object({
          url: z.string().describe("The base URL to start crawling from"),
          limit: z.number().optional().describe("Maximum number of pages to crawl"),
          formats: z.array(z.enum(['markdown', 'html', 'rawHtml', 'links', 'screenshot'])).optional().describe("Formats to return, defaults to markdown"),
          excludePaths: z.array(z.string()).optional().describe("Path patterns to exclude from crawling"),
        }),
        execute: async ({ url, limit = 10, formats = ['markdown'], excludePaths }) => {
          try {
            const apiKey = process.env.FIRECRAWL_API_KEY;
            const response = await axios.post(
              'https://api.firecrawl.dev/v1/crawl',
              {
                url,
                limit,
                scrapeOptions: { formats },
                excludePaths
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                }
              }
            );
            
            // For crawl, we need to poll for results
            const jobId = response.data.id;
            let crawlComplete = false;
            let crawlData = null;
            let attempts = 0;
            
            while (!crawlComplete && attempts < 10) {
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
              
              const statusResponse = await axios.get(
                `https://api.firecrawl.dev/v1/crawl/${jobId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`
                  }
                }
              );
              
              if (statusResponse.data.status === 'completed') {
                crawlComplete = true;
                crawlData = statusResponse.data;
              }
            }
            
            return crawlData || { status: 'pending', message: 'Crawl is still in progress. The results will be available soon.' };
          } catch (error) {
            console.error("Firecrawl Crawl error:", error);
            throw error;
          }
        },
      },
      firecrawlMap: {
        description: "Map all URLs on a website quickly",
        parameters: z.object({
          url: z.string().describe("The URL of the website to map"),
          search: z.string().optional().describe("Optional search term to filter URLs"),
          includeSubdomains: z.boolean().optional().describe("Whether to include subdomains in the mapping"),
        }),
        execute: async ({ url, search, includeSubdomains = false }) => {
          try {
            const apiKey = process.env.FIRECRAWL_API_KEY;
            const response = await axios.post(
              'https://api.firecrawl.dev/v1/map',
              {
                url,
                search,
                includeSubdomains
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                }
              }
            );
            
            // Transform the response to match the expected format for the component
            if (response.data.status === "success" && Array.isArray(response.data.links)) {
              // Create nodes from the links
              const nodes = response.data.links.map((link: string, index: number) => {
                let level = 0;
                // Try to determine the level based on URL path depth
                try {
                  const pathname = new URL(link).pathname;
                  level = pathname.split('/').filter(Boolean).length;
                } catch {
                  // Keep level 0 if URL parsing fails
                }
                
                return {
                  id: `node-${index}`,
                  url: link,
                  name: link.replace(/^https?:\/\//, '').replace(/\/$/, ''),
                  group: level < 1 ? 1 : level < 2 ? 2 : 3,
                  level: level
                };
              });
              
              // Create links (connections) between nodes based on URL structure
              const links = [];
              for (let i = 0; i < nodes.length; i++) {
                const sourceUrl = nodes[i].url;
                
                for (let j = 0; j < nodes.length; j++) {
                  if (i !== j) {
                    const targetUrl = nodes[j].url;
                    // Connect if one URL is a parent of the other
                    if (targetUrl.startsWith(sourceUrl + '/')) {
                      links.push({
                        source: `node-${i}`,
                        target: `node-${j}`,
                        value: 1
                      });
                    }
                  }
                }
              }
              
              return {
                nodes,
                links,
                total: nodes.length,
                message: nodes.length === 0 ? "No URLs found on this website" : undefined
              };
            }
            
            // If not successful or links not available
            if (response.data.error) {
              return {
                nodes: [],
                links: [],
                error: response.data.error
              };
            }
            
            return response.data;
          } catch (error) {
            console.error("Firecrawl Map error:", error);
            throw error;
          }
        },
      },
      firecrawlSearch: {
        description: "Search the web and retrieve content from search results",
        parameters: z.object({
          query: z.string().describe("The search query"),
          limit: z.number().optional().describe("Number of results to return"),
          scrapeResults: z.boolean().optional().describe("Whether to also scrape content from the search results"),
          formats: z.array(z.enum(['markdown', 'html', 'rawHtml', 'links'])).optional().describe("Formats to return if scraping results"),
        }),
        execute: async ({ query, limit = 5, scrapeResults = false, formats = ['markdown'] }) => {
          try {
            const apiKey = process.env.FIRECRAWL_API_KEY;
            const response = await axios.post(
              'https://api.firecrawl.dev/v1/search',
              {
                query,
                limit,
                scrapeOptions: scrapeResults ? { formats } : undefined
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                }
              }
            );
            
            // Transform API response to match component expectations
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
              return {
                query: query,
                results: response.data.data.map((item: {
                  title: string;
                  url: string;
                  description?: string;
                  markdown?: string;
                  html?: string;
                  metadata?: {
                    title?: string;
                    description?: string;
                    sourceURL?: string;
                    language?: string;
                    [key: string]: unknown;
                  };
                  [key: string]: unknown;
                }) => ({
                  title: item.title,
                  url: item.url,
                  description: item.description,
                  markdown: item.markdown,
                  html: item.html,
                  metadata: item.metadata
                }))
              };
            }
            
            // Handle error cases
            if (response.data.error) {
              return { 
                query: query,
                error: response.data.error 
              };
            }
            
            return response.data;
          } catch (error) {
            console.error("Firecrawl Search error:", error);
            return { 
              query: query, 
              error: "Failed to perform search. Please try again later." 
            };
          }
        },
      },
      firecrawlExtract: {
        description: "Extract structured data from web pages using AI",
        parameters: z.object({
          urls: z.array(z.string()).describe("URLs to extract data from (can include wildcards like domain.com/*)"),
          prompt: z.string().describe("Description of what data to extract"),
          enableWebSearch: z.boolean().optional().describe("Whether to allow following links outside the specified domain"),
        }),
        execute: async ({ urls, prompt, enableWebSearch = false }) => {
          try {
            const apiKey = process.env.FIRECRAWL_API_KEY;
            const response = await axios.post(
              'https://api.firecrawl.dev/v1/extract',
              {
                urls,
                prompt,
                enableWebSearch
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                }
              }
            );
            
            // Extract might need polling similar to crawl
            const jobId = response.data.id;
            let extractComplete = false;
            let extractData = null;
            let attempts = 0;
            
            while (!extractComplete && attempts < 10) {
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
              
              const statusResponse = await axios.get(
                `https://api.firecrawl.dev/v1/extract/${jobId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`
                  }
                }
              );
              
              if (statusResponse.data.status === 'completed') {
                extractComplete = true;
                extractData = statusResponse.data;
              }
            }
            
            return extractData || { status: 'pending', message: 'Extraction is still in progress. The results will be available soon.' };
          } catch (error) {
            console.error("Firecrawl Extract error:", error);
            throw error;
          }
        },
      },
      dataTable: {
        description: "Create a formatted data table from structured data (arrays of objects or single objects)",
        parameters: z.object({
          data: z.any().describe("The data to display in table format - can be an array of objects or a single object"),
          title: z.string().optional().describe("Optional title for the table"),
          maxRows: z.number().optional().describe("Maximum number of rows to display (default: 50)"),
        }),
        execute: async ({ data, title, maxRows = 50 }) => {
          return {
            data,
            title: title || "Data Table",
            maxRows,
            timestamp: new Date().toISOString()
          };
        },
      },
      firecrawlAgent: {
        description: "This tool is disabled",
        parameters: z.object({
          url: z.string().describe("The URL to navigate"),
          prompt: z.string().describe("Instructions for what the agent should do on the website"),
          formats: z.array(z.enum(['markdown', 'html', 'rawHtml', 'links', 'screenshot'])).optional().describe("Formats to return, defaults to markdown"),
        }),
        execute: async () => {
          return {
            success: false,
            error: "The FIRE-1 agent has been disabled. Please use other search or extraction tools instead.",
            message: "The FIRE-1 agent is not available",
            data: null
          };
        },
      },

    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat:", error);
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response(`An error occurred while processing your request: ${error}`, {
      status: 500,
    });
  }
}
