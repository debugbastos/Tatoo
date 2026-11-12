import { useEffect, useState } from 'react';

/** Acompanha uma media query (ex.: '(max-width: 820px)'). */
export function useMedia(query: string): boolean {
  const [bate, setBate] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const mudou = () => setBate(mq.matches);
    mudou();
    mq.addEventListener('change', mudou);
    return () => mq.removeEventListener('change', mudou);
  }, [query]);
  return bate;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useMobile = () => useMedia('(max-width: 820px)');
