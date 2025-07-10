# Gemini Model Configuration Guide

## Current Setup

Your Promptmack application is currently using **Gemini 2.5 Flash** as the primary AI model.

### Current Configuration Location
- **File**: `ai/index.ts`
- **Current Model**: `google("gemini-2.5-flash")`
- **Models Available**: `geminiProModel` and `geminiFlashModel` (both using the same model currently)

## How to Change the Gemini Model

### Available Gemini Models

1. **Gemini 2.5 Flash** (Current)
   - `google("gemini-2.5-flash")`
   - Latest and fastest model
   - Best for most use cases

2. **Gemini 2.0 Flash**
   - `google("gemini-2.0-flash")`
   - Previous generation, still very capable

3. **Gemini 1.5 Pro**
   - `google("gemini-1.5-pro")`
   - More powerful for complex reasoning
   - Larger context window

4. **Gemini 1.5 Flash**
   - `google("gemini-1.5-flash")`
   - Faster but less capable than Pro

### Step-by-Step Model Change

1. **Edit the AI Configuration**
   ```typescript
   // In ai/index.ts
   export const geminiProModel = wrapLanguageModel({
     model: google("gemini-1.5-pro"), // Change this line
     middleware: customMiddleware,
   });
   ```

2. **Different Models for Different Purposes**
   ```typescript
   // Use different models for different use cases
   export const geminiProModel = wrapLanguageModel({
     model: google("gemini-1.5-pro"), // For complex reasoning
     middleware: customMiddleware,
   });

   export const geminiFlashModel = wrapLanguageModel({
     model: google("gemini-2.0-flash"), // For fast responses
     middleware: customMiddleware,
   });
   ```

3. **Update Route Usage (if needed)**
   ```typescript
   // In app/(chat)/api/chat/route.ts
   const result = await streamText({
     model: geminiProModel, // or geminiFlashModel
     // ... rest of configuration
   });
   ```

## Model Comparison

| Model | Speed | Capability | Context | Best For |
|-------|-------|------------|---------|----------|
| Gemini 2.5 Flash | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Large | Latest model, best overall |
| Gemini 2.0 Flash | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Large | General use, fast responses |
| Gemini 1.5 Pro | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Largest | Complex reasoning, analysis |
| Gemini 1.5 Flash | ⭐⭐⭐⭐ | ⭐⭐⭐ | Large | Balanced speed/capability |

## Enhanced Proactive Behavior

I've updated your system prompt to make the agent more proactive and leading:

### Key Changes Made
- **Leadership Approach**: Agent now takes initiative and anticipates needs
- **Proactive Tool Usage**: Automatically uses tools to enrich responses
- **Strategic Thinking**: Provides insights and recommendations, not just answers
- **Executive Communication**: Uses confident, authoritative language
- **Comprehensive Responses**: Expands on simple questions with valuable context

### New Behavior Patterns
- Suggests follow-up actions and next steps
- Identifies opportunities and potential issues
- Provides multiple perspectives on problems
- Uses data and evidence to support recommendations
- Challenges assumptions constructively

## Testing the Changes

After making changes:
1. Restart your development server
2. Test with various prompts to see the more proactive behavior
3. The agent should now take more initiative and provide richer, more strategic responses

## Recommendations

1. **Keep Gemini 2.5 Flash** for most use cases - it's the latest and most advanced
2. **Consider Gemini 1.5 Pro** if you need maximum reasoning capability for complex tasks
3. **Monitor performance** and adjust based on your specific needs
4. **Test the new proactive behavior** with real user scenarios

The enhanced system prompt will make your agent much more leading and initiative-taking while maintaining helpfulness and accuracy.