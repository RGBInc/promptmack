# Promptmack: Hyper-Intelligent System Architecture Guide

## Core Philosophy
- Universal chat history as primary storage → enables rich context injection
- Fluid component integration > rigid database schemas
- Stateless > stateful where possible
- Context preservation > data normalization

## Component Integration Flow (4-File Pattern)
```mermaid
route.ts → message.tsx → [feature].tsx → multimodal-input.tsx
   ↑          ↓             ↓              ↓
 API      Orchestration   Rendering     User Input
```

### 1. API Integration (route.ts)
```typescript
pattern: {
  endpoint: async ({ params }) => {
    try {
      const response = await axios.[method](
        'url',
        payload,
        { headers: { auth } }
      );
      return response.data;
    }
  }
}
```
!pitfall: Avoid nested error handling, let cascade up

### 2. Message Orchestration (message.tsx)
```typescript
pattern: {
  import { Feature } from "../feature/feature";
  // Add to tool invocation chain
  {toolInvocation.name === "feature" && (
    <Feature featureData={toolInvocation.output} />
  )}
}
```
!pitfall: Maintain loading state parity across features

### 3. Feature Component (feature.tsx)
```typescript
pattern: {
  export const Feature = ({ featureData?: FeatureType }) => {
    if (!featureData) return <LoadingState />;
    return <ContentState data={featureData} />;
  }
}
```
!pitfall: Always handle null/undefined states

### 4. User Input (multimodal-input.tsx)
```typescript
pattern: {
  {
    title: "Feature",
    label: "Action",
    action: "Trigger phrase"
  }
}
```
!pitfall: Keep actions atomic and unambiguous

## Data Architecture Philosophy

### Current: Chat-as-Database
```yaml
advantages:
  - Natural language persistence
  - Rich context preservation
  - Zero schema migration
  - Temporal coherence
  - AI-native format
```

### Future: Memory-as-Service
```yaml
concept:
  - Vectorized chat history
  - Semantic clustering
  - Temporal decay
  - Context resurrection
  - Multi-modal memory
```

## Integration Guidelines

### New Feature Checklist
1. route.ts: Add API integration
2. feature.tsx: Create component
3. message.tsx: Add orchestration
4. multimodal-input.tsx: Add trigger

### Data Flow
```
User Input → API Call → Component Render → Chat History
     ↑____________________________________________|
```

## Advanced Concepts

### Memory Architecture
```typescript
interface Memory {
  short_term: ChatHistory;  // Recent interactions
  long_term: VectorStore;   // Semantic embeddings
  working: Context;         // Active session state
}
```

### Context Injection
```typescript
pattern: {
  const context = {
    chat_history: recent_messages,
    semantic_memory: relevant_vectors,
    user_state: current_session
  }
}
```

## Future Considerations

### Hybrid Storage
- Chat history for narrative context
- Vector store for semantic search
- Graph DB for relationship mapping
- Time-series for temporal patterns

### Memory Optimization
- Semantic deduplication
- Temporal relevance decay
- Context compression
- Incremental embedding

## Implementation Philosophy

### Core Principles
1. Chat history IS the database
2. Components ARE the features
3. Context IS the state
4. Memory IS the service

### Why This Works
- Natural language as universal interface
- Context preservation over data normalization
- Semantic search over rigid queries
- Fluid evolution over fixed schemas

## Anti-Patterns to Avoid
- Premature data normalization
- Over-specific components
- Rigid state management
- Context isolation

## Power User Notes
- Leverage chat history for context injection
- Use semantic search for feature discovery
- Think in flows, not tables
- Design for context, not data

---

Remember: The system is not just a chat interface with features - it's a context-aware, memory-enabled intelligence amplification platform. Design accordingly.
