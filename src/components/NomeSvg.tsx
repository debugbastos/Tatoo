import { useEffect, useMemo, useRef } from 'react';
import { FOLGA_NOME, montarNome } from '../utils/nome';
import './NomeSvg.css';

interface Props {
  /** Prefixo único para os ids dos recortes (clipPath). */
  id: string;
  className?: string;
  /** Espessura do contorno em pixels de tela. */
  contornoPx?: number;
}

/**
 * O nome gigante como caminhos SVG (funciona no Safari, ao contrário de <text> com tracejado).
 * Cada letra tem duas camadas: `.nome__contorno` (traço) e `.nome__cheio` (preenchimento
 * recortado por um retângulo que sobe de baixo para cima, `.nome__subida`).
 * Quem anima é o componente pai (hero, rodapé); por padrão as letras aparecem cheias.
 */
export function NomeSvg({ id, className = '', contornoPx = 1.2 }: Props) {
  const geo = useMemo(() => montarNome(), []);
  const svg = useRef<SVGSVGElement>(null);
  const folga = geo.altura * FOLGA_NOME;
  const vb = `${-folga} ${-folga} ${geo.largura + folga * 2} ${geo.altura + folga * 2}`;

  // Mantém o contorno com a mesma espessura em qualquer tamanho de tela.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const ajustar = () => {
      const escala = el.clientWidth / (geo.largura + folga * 2);
      if (escala > 0) el.style.setProperty('--nome-traco', String(contornoPx / escala));
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [geo, folga, contornoPx]);

  return (
    <svg ref={svg} className={`nome ${className}`} viewBox={vb} aria-hidden="true" focusable="false">
      <defs>
        {geo.letras.map((l, i) => (
          <clipPath id={`${id}-c${i}`} key={i}>
            <rect
              className="nome__subida"
              x={-geo.altura * 0.1}
              y={-geo.altura * 0.05}
              width={l.largura + geo.altura * 0.2}
              height={geo.altura * 1.15}
              data-altura={geo.altura * 1.15}
            />
          </clipPath>
        ))}
      </defs>
      {geo.letras.map((l, i) => (
        <g key={i} className="nome__letra" transform={`translate(${l.x} ${geo.altura}) scale(1 -1)`}>
          <path className="nome__cheio" d={l.d} clipPath={`url(#${id}-c${i})`} />
          <path className="nome__contorno" d={l.d} />
        </g>
      ))}
    </svg>
  );
}
