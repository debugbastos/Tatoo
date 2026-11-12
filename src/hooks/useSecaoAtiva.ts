import { useEffect, useState } from 'react';

/** Devolve o id da seção que ocupa a faixa central da tela. */
export function useSecaoAtiva(ids: readonly string[]): string {
  const [ativa, setAtiva] = useState('');
  useEffect(() => {
    const visiveis = new Map<string, number>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) visiveis.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let melhor = '';
        let maior = 0;
        for (const id of ids) {
          const v = visiveis.get(id) ?? 0;
          if (v > maior) {
            maior = v;
            melhor = id;
          }
        }
        setAtiva(melhor);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01, 1] },
    );
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return ativa;
}
