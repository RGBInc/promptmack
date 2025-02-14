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
- See current implementation for how to properly implement new functionalities in:  
  - `chat/route.ts`  
  - `message.tsx`  
  - The custom component(s)  
  - `multimodal-input.tsx` suggested action  