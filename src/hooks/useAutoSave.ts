import { useState, useEffect, useRef, useCallback } from "react";

export const useAutoSave = <T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 1000
): boolean => {
  const [saving, setSaving] = useState(false);
  const previousDataRef = useRef<T>(data);
  const timeoutRef = useRef<any>(null);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setSaving(true);
      await saveFunction(data);
      setSaving(false);
    }, delay);
  }, [data, delay, saveFunction]);

  useEffect(() => {
    // Check if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
      debouncedSave();
      previousDataRef.current = data;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave]);

  return saving;
};
