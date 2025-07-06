# Promptmack Developer Guide

*Complete Guide to Extending Promptmack with New Tools*

## Overview

This guide provides step-by-step instructions for developers (human or AI) to add new tools to the Promptmack platform. The process is designed to be simple, consistent, and maintainable.

## Quick Start: Adding a New Tool

Adding a new tool to Promptmack requires modifying **4 core files**:

1. **`app/(chat)/api/chat/route.ts`** - Define the tool function
2. **`components/[category]/your-tool.tsx`** - Create the UI component
3. **`components/custom/message.tsx`** - Register the component
4. **`components/custom/multimodal-input.tsx`** - Add predefined prompts

## Step-by-Step Implementation

### Step 1: Define the Tool Function

**File**: `app/(chat)/api/chat/route.ts`

```typescript
// 1. Add your tool to the tools array
const tools = {
  // ... existing tools
  yourToolName: {
    description: 'Clear description of what your tool does',
    parameters: z.object({
      query: z.string().describe('Parameter description'),
      // Add more parameters as needed
    }),
  },
};

// 2. Implement the tool function
if (toolName === 'yourToolName') {
  const { query } = args;
  
  try {
    // Your API call or logic here
    const response = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.YOUR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    const data = await response.json();
    
    return {
      toolName: 'yourToolName',
      args,
      result: data,
    };
  } catch (error) {
    return {
      toolName: 'yourToolName',
      args,
      result: { error: 'Failed to fetch data' },
    };
  }
}
```

### Step 2: Create the UI Component

**File**: `components/[category]/your-tool.tsx`

```typescript
import { ToolInvocation } from 'ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface YourToolProps {
  toolInvocation: ToolInvocation;
}

export function YourTool({ toolInvocation }: YourToolProps) {
  const { result } = toolInvocation;
  
  if (!result) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  if (result.error) {
    return (
      <Card className="w-full max-w-2xl border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{result.error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Tool Results
          <Badge variant="secondary">{result.items?.length || 0} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result.items?.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description}
              </p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 3: Register the Component

**File**: `components/custom/message.tsx`

```typescript
// 1. Import your component
import { YourTool } from '@/components/[category]/your-tool';

// 2. Add to the component mapping
const toolComponents: Record<string, React.ComponentType<any>> = {
  // ... existing tools
  yourToolName: YourTool,
};
```

### Step 4: Add Predefined Prompts

**File**: `components/custom/multimodal-input.tsx`

```typescript
// Add to the prompts array
const prompts = [
  // ... existing prompts
  {
    title: "Your Tool Action",
    label: "Your Tool",
    prompt: "Use your tool to [specific action] for [specific purpose]",
  },
  {
    title: "Another Your Tool Action",
    label: "Your Tool",
    prompt: "Help me [specific task] using your tool",
  },
];
```

### Step 5: Add Environment Variables

**File**: `.env.local`

```env
# Add your API key
YOUR_API_KEY=your_api_key_here
```

**File**: `.env.example`

```env
# Document the required variable
YOUR_API_KEY=your_api_key_here
```

### Step 6: Update Documentation

**File**: `docs/tools.md`

Add comprehensive documentation for your tool:

```markdown
## Your Tool Name

### Description
Brief description of what the tool does and when to use it.

### Parameters
- `query` (string, required): Description of the query parameter
- `option` (string, optional): Description of optional parameters

### Usage Examples
```
Find information about [topic]
Analyze [data] using [method]
```

### Implementation Details
- **API**: Your API Service
- **Rate Limits**: X requests per minute
- **Response Format**: JSON with items array
- **Error Handling**: Graceful fallbacks implemented

### Code Example
```typescript
// Example of how the tool is called
const result = await yourToolName({
  query: "example query",
  option: "example option"
});
```
```

## File Structure Reference

```
proptmack/
├── app/(chat)/api/chat/
│   └── route.ts                 # Tool definitions and logic
├── components/
│   ├── custom/
│   │   ├── message.tsx          # Component registration
│   │   └── multimodal-input.tsx # Predefined prompts
│   ├── search/                  # Search-related tools
│   ├── web/                     # Web interaction tools
│   ├── creative/                # Creative tools
│   └── [your-category]/         # Your tool components
├── docs/
│   ├── tools.md                 # Tool documentation
│   ├── FEATURE_LOG.md           # Feature tracking
│   └── DEVELOPER_GUIDE.md       # This guide
└── .env.local                   # Environment variables
```

## Best Practices

### 1. Error Handling
```typescript
try {
  const response = await apiCall();
  return { toolName, args, result: response };
} catch (error) {
  console.error(`${toolName} error:`, error);
  return {
    toolName,
    args,
    result: { error: 'User-friendly error message' }
  };
}
```

### 2. Loading States
```typescript
if (!result) {
  return <LoadingComponent />;
}
```

### 3. Parameter Validation
```typescript
parameters: z.object({
  query: z.string().min(1).describe('Query cannot be empty'),
  limit: z.number().min(1).max(100).optional().describe('Number of results (1-100)'),
})
```

### 4. Responsive Design
```typescript
<Card className="w-full max-w-2xl"> {/* Responsive width */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid */}
```

### 5. Accessibility
```typescript
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`Open ${title} in new tab`}
>
```

## Testing Your Tool

### 1. Local Development
```bash
npm run dev
```

### 2. Test Cases
- Valid input with expected results
- Invalid input handling
- API failure scenarios
- Empty/null responses
- Rate limiting

### 3. Manual Testing
1. Use predefined prompts
2. Test with custom queries
3. Verify error states
4. Check responsive design
5. Test accessibility

## Common Patterns

### Search Tools
```typescript
// Pattern for search-based tools
parameters: z.object({
  query: z.string().describe('Search query'),
  limit: z.number().optional().describe('Number of results'),
})
```

### Data Processing Tools
```typescript
// Pattern for data processing tools
parameters: z.object({
  input: z.string().describe('Data to process'),
  format: z.enum(['json', 'csv', 'xml']).optional(),
})
```

### Web Interaction Tools
```typescript
// Pattern for web interaction tools
parameters: z.object({
  url: z.string().url().describe('Target URL'),
  action: z.enum(['scrape', 'analyze', 'monitor']),
})
```

## Troubleshooting

### Common Issues

1. **Tool not appearing in chat**
   - Check tool registration in `route.ts`
   - Verify component mapping in `message.tsx`

2. **Component not rendering**
   - Check import path in `message.tsx`
   - Verify component export

3. **API errors**
   - Check environment variables
   - Verify API key permissions
   - Check rate limits

4. **TypeScript errors**
   - Ensure proper type definitions
   - Check parameter schema

### Debug Mode
```typescript
// Add logging for debugging
console.log('Tool called:', toolName, args);
console.log('API response:', response);
```

## Advanced Features

### Streaming Responses
```typescript
// For tools that support streaming
if (toolName === 'streamingTool') {
  const stream = await createStreamingResponse(args);
  return stream;
}
```

### File Upload Support
```typescript
// For tools that process files
parameters: z.object({
  file: z.string().describe('Base64 encoded file'),
  fileType: z.string().describe('File MIME type'),
})
```

### Caching
```typescript
// Simple caching pattern
const cacheKey = `tool_${toolName}_${JSON.stringify(args)}`;
const cached = cache.get(cacheKey);
if (cached) return cached;

const result = await apiCall();
cache.set(cacheKey, result, { ttl: 300 }); // 5 minutes
return result;
```

## Contributing

### Pull Request Checklist
- [ ] Tool function implemented in `route.ts`
- [ ] UI component created
- [ ] Component registered in `message.tsx`
- [ ] Predefined prompts added
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Error handling implemented
- [ ] Tests written
- [ ] Responsive design verified

### Code Review Guidelines
- Follow existing code patterns
- Ensure proper error handling
- Verify accessibility compliance
- Check performance implications
- Validate security considerations

---

*For questions or support, refer to the project documentation or create an issue in the repository.*