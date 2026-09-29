import { useState, useEffect } from 'react';

// State that outlives its screen for the rest of the app session. Cooking mode
// replaces the recipe screen, so without this every trip there and back would
// reset the baker's count, switches and cupboard. Not persisted to storage.
const sessionStore = new Map();

export function useSessionState(key, createInitial) {
  const [state, setState] = useState(() =>
    sessionStore.has(key) ? sessionStore.get(key) : createInitial()
  );

  useEffect(() => {
    sessionStore.set(key, state);
  }, [key, state]);

  return [state, setState];
}
