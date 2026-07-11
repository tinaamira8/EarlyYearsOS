import { useState, useCallback, useEffect } from 'react';

const PREFIX = 'eyos_';

export function usePersistedState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const storageKey = `${PREFIX}${key}`;

  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      console.warn('usePersistedState write failed:', e);
    }
  }, [storageKey, value]);

  const set = useCallback((val: T | ((prev: T) => T)) => {
    setValue(val);
  }, []);

  return [value, set];
}

let _idCounter = 0;
export function generateId(): string {
  _idCounter++;
  return `${Date.now()}-${_idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}
