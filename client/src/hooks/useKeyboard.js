import { useEffect, useRef, useCallback } from 'react';

/**
 * Tracks which keys are currently pressed.
 * Returns a ref to a Set<string> of lowercase key names.
 */
export function useKeyboard() {
  const keys = useRef(new Set());

  const onDown = useCallback((e) => {
    keys.current.add(e.key.toLowerCase());
  }, []);

  const onUp = useCallback((e) => {
    keys.current.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    // Clear all keys if window loses focus to avoid stuck keys
    const onBlur = () => keys.current.clear();
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [onDown, onUp]);

  return keys;
}
