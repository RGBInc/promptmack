# PromptMack AI SDK Analysis and Modernization Plan

*Comprehensive analysis of current implementation and roadmap for modernization*

## Current State Analysis

### What We're Using

**Current Vercel AI SDK Version**: `3.4.9` (Released ~6 months ago)
**Latest Stable Version**: `4.2.x`
**Latest Beta Version**: `5.0.x-beta`

### Dependencies Analysis

```json
{
  "ai": "3.4.9",                    // 🔴 Outdated (2+ major versions behind)
  "@ai-sdk/google": "^0.0.51",     // ✅ Current Google provider
  "@google/genai": "^0.10.0",      // ✅ Current Google Generative AI
  "next": "15.0.0-canary.152",     // ✅ Latest Next.js
  "react": "19.0.0-rc",            // ✅ Latest React
  "next-auth": "5.0.0-beta.22"     // ✅ Latest NextAuth
}
```

## What We're Doing Well

### ✅ Strong Foundation

1. **Modern Tech Stack**
   - Next.js 15 (App Router)
   - React 19 RC
   - TypeScript with strict typing
   - Tailwind CSS for styling
   - PostgreSQL with Drizzle ORM

2. **Excellent Tool Architecture**
   - Well-structured tool definitions with Zod schemas
   - Comprehensive tool suite (10 tools covering research, web intelligence, automation)
   - Proper error handling and validation
   - Clean separation of concerns

3. **Advanced Features Already Implemented**
   - Streaming responses
   - Tool calling and orchestration
   - Multi-modal input support
   - Session management with NextAuth
   - Database persistence

4. **Good Development Practices**
   - TypeScript throughout
   - Component-based architecture
   - Proper file organization
   - Environment configuration

### ✅ Current AI SDK Usage Patterns

**What's Working Well:**

```typescript
// Good: Proper tool definition with Zod
const getNews = tool({
  description: 'Get recent news articles about a topic',
  parameters: z.object({
    query: z.string().describe('Search query for news'),
    limit: z.number().optional().describe('Number of results')
  }),
  execute: async ({ query, limit = 10 }) => {
    // Implementation
  }
});

// Good: Proper streaming setup
const result = await streamText({
  model: geminiProModel,
  messages,
  tools: { getNews, getScholar, /* ... */ },
  maxSteps: 5
});
```

## Areas for Improvement

### 🔴 Critical Issues

1. **Severely Outdated AI SDK**
   - Missing 2+ major versions of improvements
   - Security vulnerabilities in older versions
   - Missing performance optimizations
   - Incompatible with latest provider features

2. **Missing Modern AI SDK Features**
   - No structured data generation (`generateObject`)
   - Limited streaming capabilities
   - No message metadata support
   - No type-safe tool calls
   - No Server-Sent Events (SSE) protocol

### 🟡 Moderate Issues

1. **Limited Error Handling**
   - Basic error handling in API routes
   - No retry mechanisms for failed tool calls
   - Limited user feedback for errors

2. **Performance Optimizations**
   - No request caching
   - No streaming optimizations
   - No connection pooling for external APIs

3. **User Experience**
   - No loading states for tool execution
   - Limited progress indicators
   - No tool execution visualization

## Modernization Roadmap

### Phase 1: AI SDK 4.0 Migration (High Priority)

**Timeline**: 1-2 weeks
**Impact**: High performance and feature improvements

#### Step 1: Dependency Updates

```bash
# Update to AI SDK 4.x
npm install ai@^4.2.0 @ai-sdk/google@^1.0.0

# Run automated migration
npx @ai-sdk/codemod upgrade
```

#### Step 2: Code Changes Required

**API Route Updates:**

```typescript
// Before (v3.4.9)
const result = await streamText({
  model: geminiProModel,
  messages,
  tools,
  maxToolRoundtrips: 5
});

return result.toAIStreamResponse();

// After (v4.2.x)
const result = streamText({  // No await needed
  model: geminiProModel,
  messages,
  tools,
  maxSteps: 6  // maxToolRoundtrips + 1
});

return result.toDataStreamResponse();
```

**Provider Updates:**

```typescript
// Before
import { google } from '@ai-sdk/google';

// After - no changes needed for Google provider
import { google } from '@ai-sdk/google';
```

#### Step 3: Enhanced Features

**Add Structured Data Generation:**

```typescript
// New capability: Generate structured data
const dataTable = tool({
  description: 'Format data into structured tables',
  parameters: z.object({
    data: z.array(z.record(z.any())),
    schema: z.object({}).passthrough()
  }),
  execute: async ({ data, schema }) => {
    const result = await generateObject({
      model: geminiProModel,
      schema: z.object(schema),
      prompt: `Format this data: ${JSON.stringify(data)}`
    });
    return result.object;
  }
});
```

### Phase 2: AI SDK 5.0 Beta Integration (Medium Priority)

**Timeline**: 2-3 weeks
**Impact**: Cutting-edge features and future-proofing

#### New Features to Implement

**1. Enhanced Message System:**

```typescript
// New UIMessage and ModelMessage separation
import { convertToModelMessages, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  
  const result = streamText({
    model: geminiProModel,
    messages: convertToModelMessages(messages),
    tools
  });
  
  return result.toUIMessageStreamResponse();
}
```

**2. Type-Safe Tool Calls:**

```typescript
// Enhanced type safety for tools
{
  message.parts.map(part => {
    switch (part.type) {
      case 'tool-getNews':
        return <NewsToolResult data={part.result} />;
      case 'tool-getScholar':
        return <ScholarToolResult data={part.result} />;
      case 'tool-firecrawlScrape':
        return <ScrapeToolResult data={part.result} />;
    }
  });
}
```

**3. Message Metadata:**

```typescript
// Add performance and usage metadata
const metadataSchema = z.object({
  duration: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  toolsUsed: z.array(z.string()).optional()
});

return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'finish') {
      return {
        duration: Date.now() - startTime,
        totalTokens: part.totalUsage.totalTokens,
        toolsUsed: part.toolCalls?.map(tc => tc.toolName)
      };
    }
  }
});
```

**4. Enhanced useChat with Transport:**

```typescript
// Client-side improvements
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  maxSteps: 5
});
```

### Phase 3: Advanced Features (Low Priority)

**Timeline**: 3-4 weeks
**Impact**: Enhanced user experience and capabilities

#### 1. Agentic Control Features

```typescript
// Implement prepareStep for fine-grained control
const result = streamText({
  model: geminiProModel,
  messages,
  tools,
  prepareStep: ({ step, messages }) => {
    // Custom logic before each step
    if (step > 3) {
      return {
        messages: [...messages, {
          role: 'system',
          content: 'Focus on summarizing findings'
        }]
      };
    }
  }
});
```

#### 2. Data Parts for Dynamic UI

```typescript
// Stream custom data parts
const stream = createUIMessageStream({
  execute: writer => {
    writer.write({
      type: 'data-progress',
      id: 'research-progress',
      data: { 
        step: 'Searching news',
        progress: 25,
        status: 'loading'
      }
    });
  }
});
```

#### 3. Enhanced Tool Visualization

```typescript
// Real-time tool execution feedback
const ToolExecutionProgress = ({ message }) => {
  return (
    <div className="space-y-2">
      {message.parts
        .filter(part => part.type.startsWith('tool-'))
        .map((part, index) => (
          <ToolCard
            key={index}
            toolName={part.type.replace('tool-', '')}
            status={part.status}
            result={part.result}
            duration={part.metadata?.duration}
          />
        ))
      }
    </div>
  );
};
```

## Performance Optimizations

### 1. Streaming Improvements

```typescript
// Implement connection pooling
const httpAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50
});

// Add request caching
const cache = new Map();
const getCachedResult = (key: string, ttl: number) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
};
```

### 2. Error Handling Enhancement

```typescript
// Implement retry logic
const executeWithRetry = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

### 3. Database Optimizations

```typescript
// Add connection pooling and caching
const db = drizzle(postgres(connectionString, {
  max: 20,
  idle_timeout: 30000,
  connect_timeout: 60000
}));

// Implement message caching
const getCachedMessages = async (chatId: string) => {
  const cached = await redis.get(`chat:${chatId}`);
  if (cached) return JSON.parse(cached);
  
  const messages = await db.select().from(messagesTable)
    .where(eq(messagesTable.chatId, chatId));
  
  await redis.setex(`chat:${chatId}`, 300, JSON.stringify(messages));
  return messages;
};
```

## Security Enhancements

### 1. Rate Limiting

```typescript
// Implement rate limiting
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m')
});

export async function POST(req: Request) {
  const { success } = await ratelimit.limit(
    req.headers.get('x-forwarded-for') ?? 'anonymous'
  );
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Continue with request
}
```

### 2. Input Validation

```typescript
// Enhanced input validation
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(10000),
    id: z.string().uuid()
  })).max(50),
  chatId: z.string().uuid().optional()
});

export async function POST(req: Request) {
  const body = await req.json();
  const validatedData = chatRequestSchema.parse(body);
  // Continue with validated data
}
```

## Testing Strategy

### 1. Unit Tests for Tools

```typescript
// Test tool implementations
describe('getNews tool', () => {
  it('should fetch news articles', async () => {
    const result = await getNews.execute({
      query: 'AI technology',
      limit: 5
    });
    
    expect(result).toHaveProperty('articles');
    expect(result.articles).toHaveLength(5);
  });
});
```

### 2. Integration Tests

```typescript
// Test API endpoints
describe('/api/chat', () => {
  it('should handle chat requests', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });
    
    expect(response.ok).toBe(true);
  });
});
```

## Migration Timeline

### Week 1-2: AI SDK 4.0 Migration
- [ ] Update dependencies
- [ ] Run codemods
- [ ] Fix breaking changes
- [ ] Test all functionality
- [ ] Deploy to staging

### Week 3-4: Enhanced Features
- [ ] Implement structured data generation
- [ ] Add better error handling
- [ ] Improve streaming performance
- [ ] Add progress indicators

### Week 5-6: AI SDK 5.0 Beta (Optional)
- [ ] Evaluate beta stability
- [ ] Implement new message system
- [ ] Add type-safe tool calls
- [ ] Test metadata features

### Week 7-8: Polish and Optimization
- [ ] Performance optimizations
- [ ] Security enhancements
- [ ] Comprehensive testing
- [ ] Documentation updates

## Success Metrics

### Performance Metrics
- **Response Time**: Target <2s for simple queries, <10s for complex multi-tool workflows
- **Streaming Latency**: Target <500ms for first token
- **Error Rate**: Target <1% for tool executions
- **Uptime**: Target 99.9%

### User Experience Metrics
- **Tool Success Rate**: Target >95% successful tool executions
- **User Satisfaction**: Measure through feedback and usage patterns
- **Feature Adoption**: Track usage of new AI SDK features

### Technical Metrics
- **Code Coverage**: Target >80% for critical paths
- **Bundle Size**: Monitor and optimize
- **Memory Usage**: Profile and optimize

## Risk Assessment

### High Risk
- **Breaking Changes**: AI SDK 4.0 has significant breaking changes
- **Tool Compatibility**: Ensure all tools work with new SDK
- **Performance Regression**: Monitor for any performance issues

### Medium Risk
- **Beta Features**: AI SDK 5.0 beta may have instability
- **User Experience**: Changes to UI/UX during migration
- **Database Migration**: Potential schema changes needed

### Low Risk
- **Dependency Updates**: Most other dependencies are current
- **Infrastructure**: No major infrastructure changes needed

## Conclusion

PromptMack has a solid foundation but is significantly behind on AI SDK versions. The migration to AI SDK 4.0 should be prioritized as it offers:

1. **Immediate Benefits**: Performance improvements, bug fixes, security updates
2. **New Capabilities**: Structured data generation, better streaming, enhanced error handling
3. **Future-Proofing**: Compatibility with latest AI model features

The AI SDK 5.0 beta offers exciting new features but should be approached cautiously due to its beta status. Focus on the 4.0 migration first, then evaluate 5.0 based on stability and specific feature needs.

**Recommended Action**: Start with AI SDK 4.0 migration immediately, as the benefits far outweigh the migration effort, and the current version gap poses security and performance risks.

---

*This document should be updated as migration progresses and new AI SDK versions are released.*