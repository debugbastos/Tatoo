import { useEffect, useRef } from 'react';
import type { Trabalho } from '../data/trabalhos';
import { artista } from '../data/estudio';
import { Icone } from './Icone';
import './Lightbox.css';

interface Props {
  itens: Trabalho[];
  indice: number;
  aoMudar: (i: number) => void;
  aoFechar: () => void;
}

/** Foto em tela cheia: setas, Esc, arrastar no celular, foco preso dentro do diálogo. */
export default function Lightbox({ itens, indice, aoMudar, aoFechar }: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const toque = useRef<number | null>(null);
  const t = itens[indice];
  const n = itens.length;
  const ir = (d: number) => aoMudar((indice + d + n) % n);

  useEffect(() => {
    document.body.classList.add('travado');
    fechar.current?.focus();
    return () => document.body.classList.remove('travado');
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar();
      else if (e.key === 'ArrowRight') aoMudar((indice + 1) % n);
      else if (e.key === 'ArrowLeft') aoMudar((indice - 1 + n) % n);
      else if (e.key === 'Tab' && caixa.current) {
        const focaveis = Array.from(caixa.current.querySelectorAll<HTMLElement>('button, a[href]'));
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [indice, n, aoFechar, aoMudar]);

  if (!t) return null;
  return (
    <div
      ref={caixa}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${t.titulo} — foto ${indice + 1} de ${n}`}
      onPointerDown={(e) => {
        toque.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (toque.current === null) return;
        const dx = e.clientX - toque.current;
        toque.current = null;
        if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
      }}
    >
      <div className="lightbox__fundo" onClick={aoFechar} aria-hidden="true" />
      <div className="lightbox__topo mono">
        <span>
          {String(indice + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button ref={fechar} type="button" className="lightbox__fechar" onClick={aoFechar} aria-label="Fechar">
          Fechar <Icone nome="fechar" tamanho={16} />
        </button>
      </div>
      <figure className="lightbox__figura">
        <img key={t.id} src={t.src} alt={t.alt} width={t.w} height={t.h} draggable={false} />
        <figcaption className="lightbox__legenda">
          <span className="mono muted">
            {t.estilo} · {t.local} · {artista.nome}
            {t.nota ? ` · ${t.nota}` : ''}
          </span>
          <span className="lightbox__titulo">{t.titulo}</span>
          <span className="lightbox__frase">“{t.legenda}”</span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox__seta lightbox__seta--ant" onClick={() => ir(-1)} aria-label="Foto anterior">
        <Icone nome="esquerda" />
      </button>
      <button type="button" className="lightbox__seta lightbox__seta--prox" onClick={() => ir(1)} aria-label="Próxima foto">
        <Icone nome="direita" />
      </button>
    </div>
  );
}
