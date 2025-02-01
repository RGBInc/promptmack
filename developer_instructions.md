This is a Vercel AI SDK adaptive AI agent that performs tasks and actions for users. It can stream components and present a dynamic ui. Given an API and we want to add it to the agent. Here's the process:
 

Files to modify:

<relevant_files>

app/(chat)/api/chat/route.ts // Add tool for API integration and update system prompt

components/custom/message.tsx // Add import, loading and result states ONLY nothing else

components/custom/component.tsx // Create human friendly components with seamless UI

components/custom/multimodal-input.tsx // Add trigger action

.env.example // Add API keys

</relevant_files>

  

Implementation Requirements:

- Use tools system for integration (don't use string parsing)

- Keep existing route.ts functionality intact

- Maintain existing loading and result states pattern in message.tsx

- Add tool to existing tools object

- Update system prompt to include new capability

- Use getNews functionality as an example of how to properly implement new functionalities in the chat > route.ts, message.tsx, the custom component(s), and the multimodal-input suggested action