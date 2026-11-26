import { useState, useEffect } from 'react';

/**
 * Syncs a piece of state with localStorage so progress, bookmarks and
 * chat history survive page reloads without needing a database.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable - fail silently, the app still works.
    }
  }, [key, value]);

  return [value, setValue];
}
