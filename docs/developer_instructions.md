This is a Vercel AI SDK adaptive AI agent that performs tasks and actions for users. 
It can stream components and present a dynamic UI. Given an API and we want to add it to the agent. 
Here's the process:

Files to modify:

<relevant_files>

app/(chat)/api/chat/route.ts  
# Add tool for API integration and update system prompt

components/custom/message.tsx  
# Add import, loading, and result states ONLY—nothing else (follow "news" as an example)

components/custom/component.tsx  
# Create human-friendly components with seamless UI

components/custom/multimodal-input.tsx  
# Add trigger action

.env.example  
# Add API keys

For database operations (i.e., not an external API):

db --> migrate.ts, queries.ts, schema.ts  
lib --> drizzle and other pertinent files  

</relevant_files>

Implementation Requirements:

- Use the tools system for integration (don't use string parsing).  
- Keep existing `route.ts` functionality intact.  
- Maintain existing loading and result states pattern in `message.tsx` and don't forget to import the component.  
- Add tool to existing `tools` object.  
- Update system prompt to include new capability.  
- See current implementation of news functionality for how to properly implement new functionalities in:  
  - `chat/route.ts`  
  - `message.tsx`  
  - The custom component(s)  
  - `multimodal-input.tsx` suggested action  

At the core of generative UI are tools , which are functions you provide to the model to perform specialized tasks like getting the weather in a location. The model can decide when and how to use these tools based on the context of the conversation.

Generative UI is the process of connecting the results of a tool call to a React component. Here's how it works:

You provide the model with a prompt or conversation history, along with a set of tools.
Based on the context, the model may decide to call a tool.
If a tool is called, it will execute and return data.
This data can then be passed to a React component for rendering.
By passing the tool results to React components, you can create a generative UI experience that's more engaging and adaptive to your needs.

types of tools e.g. tools that call a database e.g. a neon postgres, tools that call an external api, tools that executre fucntions, tools that render an input component or ui, tools that manipulate existing components

# 20 Types of Generative UI Tools

## 1. **Database Query Tools**
   - Tools that interact with a database (e.g., Neon Postgres, Supabase) to fetch, insert, update, or delete records.

## 2. **External API Call Tools**
   - Tools that make HTTP requests to third-party APIs (e.g., OpenAI API, Stripe API, Twilio, Notion API).

## 3. **Function Execution Tools**
   - Tools that trigger specific backend functions or serverless functions (e.g., AWS Lambda, Firebase Functions).

## 4. **State Management Tools**
   - Tools that store and manipulate global or local state (e.g., Zustand, Jotai, Redux).

## 5. **Input Component Tools**
   - Tools that render interactive input elements like text fields, dropdowns, or sliders.

## 6. **UI Rendering Tools**
   - Tools that dynamically generate UI components based on data or user actions.

## 7. **Component Manipulation Tools**
   - Tools that modify the properties, visibility, or styles of existing components.

## 8. **AI Integration Tools**
   - Tools that send prompts and receive responses from AI models (e.g., GPT-4, Claude, Gemini).

## 9. **File Upload & Storage Tools**
   - Tools that handle file uploads and manage storage (e.g., BunnyCDN, Cloudinary, Firebase Storage).

## 10. **Authentication & Authorization Tools**
   - Tools that handle user login, authentication, and role-based access control (e.g., Clerk, Auth0, Firebase Auth).

## 11. **Event-Driven Tools**
   - Tools that listen for events and trigger actions (e.g., WebSockets, Pub/Sub messaging).

## 12. **Data Transformation Tools**
   - Tools that process and format data before passing it to another function or component.

## 13. **Visualization Tools**
   - Tools that generate charts, graphs, and visual data representations (e.g., Recharts, D3.js, Chart.js).

## 14. **Web Scraping Tools**
   - Tools that extract data from external web pages (e.g., Puppeteer, Playwright, Scrapy).

## 15. **Automation & Workflow Tools**
   - Tools that define and execute multi-step processes (e.g., Zapier, n8n, Pipedream).

## 16. **Notification & Alert Tools**
   - Tools that send email, SMS, push notifications, or in-app alerts (e.g., Twilio, OneSignal, SendGrid).

## 17. **Code Execution Tools**
   - Tools that run arbitrary code snippets (e.g., WASM execution, Pyodide for Python).

## 18. **Logging & Monitoring Tools**
   - Tools that track user actions, errors, and system performance (e.g., Sentry, Datadog, LogRocket).

## 19. **Content Generation Tools**
   - Tools that generate structured content like blog posts, emails, or social media posts.

## 20. **Agentic Tools**
   - Tools that run AI-driven autonomous agents that take actions based on user input or system triggers.