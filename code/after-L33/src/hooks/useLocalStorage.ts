import { useEffect, useState } from "react";

// Like useState, but the value survives a page refresh.
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    // runs once, on the first render only
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : (JSON.parse(saved) as T);
    } catch {
      return initial; // storage blocked or broken JSON
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked: the app still works, it just forgets on refresh
    }
  }, [key, value]);

  return [value, setValue] as const;
}
