import { useState, useEffect, useRef } from 'react';

export function useRotatingText(
  lines: string[],
  intervalMs = 2500,
  active = true,
): { text: string; opacity: number } {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || lines.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      fadeRef.current = setTimeout(() => {
        setIdx(i => {
          const next = i + 1;
          // once the list is exhausted, loop the last two
          return next >= lines.length ? Math.max(0, lines.length - 2) : next;
        });
        setFading(false);
      }, 250);
    }, intervalMs);
    return () => {
      clearInterval(timer);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [active, lines.length, intervalMs]);

  useEffect(() => {
    if (!active) { setIdx(0); setFading(false); }
  }, [active]);

  return {
    text: lines[Math.min(idx, lines.length - 1)] ?? '',
    opacity: fading ? 0 : 1,
  };
}
