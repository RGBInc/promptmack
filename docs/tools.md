# Promptmack Tools Documentation

This document provides a comprehensive overview of the tools available in Promptmack, their purpose, parameters, and usage examples.

## Core Concepts

In Promptmack, tools are specialized functions that the AI can call to perform specific actions based on user requests. Each tool consists of:

1. **Description**: Explains what the tool does to the AI
2. **Parameters**: Defines the inputs the tool expects
3. **Execution Logic**: Code that runs when the tool is called
4. **UI Component**: Visual representation of the tool's results

## Available Tools

### 1. News Search Tool

The News Search tool retrieves news articles based on user queries.

#### Parameters

| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| query     | string | Yes      | Search query for news     |

#### Usage Examples

- "Show me the latest news about artificial intelligence"
- "Find news articles about climate change"
- "What's happening with SpaceX lately?"

#### Implementation Details

This tool uses the Google Serper API to fetch news results and displays them in a responsive grid with article titles, snippets, sources, and images.

```typescript
// Tool definition
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
}
```

### 2. Scholar Search Tool

The Scholar Search tool retrieves scholarly articles and academic papers based on user queries.

#### Parameters

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| query     | string | Yes      | Search query for scholarly articles |

#### Usage Examples

- "Find academic papers about quantum computing"
- "Show me recent research on mRNA vaccines"
- "Find scholarly articles about machine learning in healthcare"

#### Implementation Details

This tool uses the Google Serper API (scholar endpoint) to fetch academic results and displays them with titles, authors, publication details, and citations.

```typescript
// Tool definition
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
}
```

### 3. Similar Website Search Tool

The Similar Website Search tool finds websites that are similar to a given URL.

#### Parameters

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| url       | string | Yes      | URL to find similar websites for    |

#### Usage Examples

- "Find websites similar to twitter.com"
- "Show me alternatives to slack.com"
- "What are some sites like medium.com?"

#### Implementation Details

This tool uses the Exa.ai API to find similar websites to a given URL, excluding the original domain and company name from results.

```typescript
// Tool definition
findSimilar: {
  description: "Find similar websites based on a URL",
  parameters: z.object({
    url: z.string().describe("URL to find similar websites for"),
  }),
  execute: async ({ url }) => {
    try {
      // Extract base domain and company name
      const baseDomain = url.replace(/^https?:\/\//, '')  
                          .replace(/^www\./, '')          
                          .split('/')[0];                 
      
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
}
```

### 4. Video Search Tool

The Video Search tool retrieves videos based on user queries.

#### Parameters

| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| query     | string | Yes      | Search query for videos   |

#### Usage Examples

- "Find tutorials on React.js"
- "Show me videos about cooking pasta"
- "Get videos explaining quantum physics"

#### Implementation Details

This tool uses the Google Serper API (videos endpoint) to fetch video results and displays them in a grid with thumbnails, titles, channels, and view counts.

```typescript
// Tool definition
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
}
```

### 5. Form Submission Tool (Skyvern)

The Form Submission tool allows automated interactions with web forms and pages.

#### Parameters

| Parameter       | Type   | Required | Description                       |
|-----------------|--------|----------|-----------------------------------|
| url             | string | Yes      | Target URL for form submission    |
| navigationGoal  | string | Yes      | Goal for navigating the webpage   |
| navigationPayload | object | Yes    | Form data to submit               |

#### Usage Examples

- "Fill out a contact form on example.com"
- "Sign up for a newsletter on techblog.com"
- "Register for an event on meetup.com"

#### Implementation Details

This tool uses the Skyvern API to automate form submissions and web interactions, allowing complex web tasks to be performed through natural language.

```typescript
// Tool definition
skyvernFormSubmit: {
  description: "Submit forms and interact with web pages using Skyvern API",
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
}
```

### 6. Weather Tool

The Weather Tool retrieves current weather conditions for a specified location.

#### Parameters

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| latitude  | number | Yes      | Latitude coordinate     |
| longitude | number | Yes      | Longitude coordinate    |

#### Usage Examples

- "What's the weather in New York?"
- "Show me the forecast for Tokyo"
- "Is it raining in London right now?"

#### Implementation Details

This tool uses the Open-Meteo API to fetch weather data and displays current conditions, temperature, and forecast.

```typescript
// Tool definition
getWeather: {
  description: "Get the current weather at a location",
  parameters: z.object({
    latitude: z.number().describe("Latitude coordinate"),
    longitude: z.number().describe("Longitude coordinate"),
  }),
  execute: async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
}
```

### 7. Flight Status Tool (Currently Deactivated)

The Flight Status Tool retrieves the status of a specific flight.

#### Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| flightNumber | string | Yes      | Flight number             |
| date         | string | Yes      | Date of the flight        |

#### Usage Examples

- "Check the status of flight AA123 today"
- "Is flight DL456 on time for tomorrow?"
- "When will flight UA789 arrive?"

#### Implementation Details

This tool simulates flight status data for demonstration purposes.

```typescript
// Tool definition
displayFlightStatus: {
  description: "Display the status of a flight",
  parameters: z.object({
    flightNumber: z.string().describe("Flight number"),
    date: z.string().describe("Date of the flight"),
  }),
  execute: async ({ flightNumber, date }) => {
    const flightStatus = await generateSampleFlightStatus({
      flightNumber,
      date,
    });

    return flightStatus;
  },
}
```

### 8. Flight Search Tool (Currently Deactivated)

The Flight Search Tool searches for flights between specified locations.

#### Parameters

| Parameter   | Type   | Required | Description                  |
|-------------|--------|----------|------------------------------|
| origin      | string | Yes      | Origin airport or city       |
| destination | string | Yes      | Destination airport or city  |

#### Usage Examples

- "Find flights from New York to London"
- "Show me flights to Paris next week"
- "What are the cheapest flights from Chicago to Miami?"

#### Implementation Details

This tool simulates flight search results for demonstration purposes.

```typescript
// Tool definition
searchFlights: {
  description: "Search for flights based on the given parameters",
  parameters: z.object({
    origin: z.string().describe("Origin airport or city"),
    destination: z.string().describe("Destination airport or city"),
  }),
  execute: async ({ origin, destination }) => {
    const results = await generateSampleFlightSearchResults({
      origin,
      destination,
    });

    return results;
  },
}
```

## Adding New Tools

To add a new tool to Promptmack, follow these steps:

1. **Define the Tool**: Add a new tool definition in `app/(chat)/api/chat/route.ts`
2. **Create a Component**: Create a UI component in the appropriate directory
3. **Update Message Renderer**: Add the tool to the rendering logic in `components/custom/message.tsx`
4. **Update System Prompt**: Update the system prompt to inform the AI about the new tool
5. **Add Environment Variables**: Add any API keys to `.env.example` and your local `.env`
6. **Test & Document**: Test the tool with various prompts and document its usage

For detailed implementation instructions, refer to the [Development Workflow](./development_workflow.md) documentation.

## Best Practices

1. **Error Handling**: Always include proper error handling in tool execution
2. **Loading States**: Implement meaningful loading states in UI components
3. **User Experience**: Focus on making output easily scannable and actionable
4. **Security**: Never expose API keys in client-side code
5. **Documentation**: Keep this document updated when adding or modifying tools

## Tools Currently in Development

The following tools are planned for future releases:

1. **Shopping Search Tool**: Compare prices across online retailers
2. **Translation Tool**: Translate text between languages
3. **Calendar Integration**: Schedule events and set reminders
4. **Document Analysis**: Extract insights from uploaded documents 