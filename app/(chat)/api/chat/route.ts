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
- You have access to the following tools: news, scholar, similar, form-submit, and videos
- Use these tools proactively when they would enhance your response
- When using tools, explain briefly why you're using them

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
