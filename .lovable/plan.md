

# Implementation: Animated Loading Status Messages

## Overview
Replace the static/bouncing loading indicators with rotating status text that shows "Thinking...", "Searching our library...", and "Drafting..." as time progresses.

## Files to Modify

### 1. `src/components/DemoChat.tsx`

**Add state and loading messages array (after line 20):**
```typescript
const [loadingPhase, setLoadingPhase] = useState(0);

const loadingMessages = [
  "Thinking...",
  "Searching our library...",
  "Drafting..."
];
```

**Add useEffect for phase transitions (after line 29):**
```typescript
useEffect(() => {
  if (!isLoading) {
    setLoadingPhase(0);
    return;
  }
  
  const timer1 = setTimeout(() => setLoadingPhase(1), 2000);
  const timer2 = setTimeout(() => setLoadingPhase(2), 5000);
  
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, [isLoading]);
```

**Replace bouncing dots (lines 144-154) with:**
```tsx
{isLoading && (
  <div className="flex justify-start">
    <div className="bg-muted text-foreground rounded-2xl px-4 py-3 text-sm">
      <p className="text-muted-foreground animate-pulse">
        {loadingMessages[loadingPhase]}
      </p>
    </div>
  </div>
)}
```

### 2. `src/components/Sidekick.tsx`

**Add state and loading messages array (after line 45):**
```typescript
const [loadingPhase, setLoadingPhase] = useState(0);

const loadingMessages = [
  "Thinking...",
  "Searching our library...",
  "Drafting..."
];
```

**Add useEffect for phase transitions (after auto-scroll effect, around line 102):**
```typescript
useEffect(() => {
  if (!isLoading) {
    setLoadingPhase(0);
    return;
  }
  
  const timer1 = setTimeout(() => setLoadingPhase(1), 2000);
  const timer2 = setTimeout(() => setLoadingPhase(2), 5000);
  
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, [isLoading]);
```

**Update loading indicator (line 306) from static "Thinking..." to:**
```tsx
<p className="text-sm text-muted-foreground animate-pulse">
  {loadingMessages[loadingPhase]}
</p>
```

## Expected Behavior

| Time | Message Displayed |
|------|-------------------|
| 0-2s | "Thinking..." |
| 2-5s | "Searching our library..." |
| 5s+  | "Drafting..." |

When the response arrives, the loading indicator disappears and the phase resets to 0 for the next request.

