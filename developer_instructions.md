This is a Vercel AI SDK chatbot that can stream components and really present a dynamic ui. Given an API here's current ways we've been implementing it. if you find a much better, more holistic or efficient way, please advise when needing to change things:

  

Files to modify:

<relevant_files>

app/(chat)/api/chat/route.ts // Add tool for API integration and update system prompt

components/custom/message.tsx // Add import, loading and result states ONLY nothing else

components/custom/component.tsx // Create human friendly components with seamless UI

components/custom/multimodal-input.tsx // Add trigger action

.env.local // Add API keys

next.config.mjs // Allow media domains

</relevant_files>

  

Implementation Requirements:

- Use tools system for integration (don't use string parsing)

- Keep existing route.ts functionality intact

- Maintain existing loading and result states pattern in message.tsx

- Add tool to existing tools object

- Update system prompt to include new capability

- Remove any duplicate config files (next.config.js)