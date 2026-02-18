import { useState, useEffect, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode(): { activated: boolean; reset: () => void } {
  const [index, setIndex] = useState(0);
  const [activated, setActivated] = useState(() => {
    try { return localStorage.getItem('magos-activated') === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activated) return;
      if (e.key === KONAMI_CODE[index]) {
        const next = index + 1;
        if (next === KONAMI_CODE.length) {
          setActivated(true);
          try { localStorage.setItem('magos-activated', 'true'); } catch {}
          setIndex(0);
        } else {
          setIndex(next);
        }
      } else {
        setIndex(e.key === KONAMI_CODE[0] ? 1 : 0);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, activated]);

  const reset = useCallback(() => {
    setActivated(false);
    setIndex(0);
    try { localStorage.removeItem('magos-activated'); } catch {}
  }, []);

  return { activated, reset };
}
