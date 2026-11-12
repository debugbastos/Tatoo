import { useEffect, useRef } from 'react';
import { Icone, type NomeIcone } from '../components/Icone';
import { processo } from '../data/textos';
import { faixa, prefersReduced, scrub, viewProgress } from '../motion/engine';
import { revelar } from '../motion/reveal';
import './Processo.css';

const ICONES: NomeIcone[] = ['conversa', 'ideia', 'lapis', 'etiqueta', 'calendario', 'agulha', 'cuidado'];

export function Processo() {
  const lista = useRef<HTMLOListElement>(null);

  // A linha vertical enche com a rolagem; cada etapa acende quando a linha chega nela.
  useEffect(() => {
    const ol = lista.current;
    if (!ol) return;
    const etapas = Array.from(ol.querySelectorAll<HTMLElement>('.etapa'));
    const linha = ol.parentElement?.querySelector<HTMLElement>('.processo__linha i');
    const aplicar = (p: number) => {
      if (linha) linha.style.transform = `scaleY(${p})`;
      etapas.forEach((e, i) => e.classList.toggle('etapa--acesa', p >= (i + 0.35) / etapas.length));
    };
    if (prefersReduced()) {
      aplicar(1);
      return;
    }
    return scrub(() => faixa(viewProgress(ol), 0.18, 0.72), aplicar, 0.1);
  }, []);

  return (
    <section id="processo" className="secao processo" aria-labelledby="processo-titulo">
      <div className="processo__cabeca" ref={revelar}>
        <p className="mono eyebrow">Como funciona</p>
        <h2 id="processo-titulo" className="titulo">
          <span className="mask">
            <span>Da ideia</span>
          </span>
          <span className="mask">
            <span>à pele</span>
          </span>
        </h2>
        <p className="lead processo__intro" data-fade>
          Sete passos, do primeiro “oi” no WhatsApp até a tatuagem cicatrizada.
        </p>
      </div>

      <div className="processo__corpo">
        <div className="processo__linha" aria-hidden="true">
          <i />
        </div>
        <ol ref={lista} className="processo__lista">
          {processo.map((p, i) => (
            <li key={p.titulo} className="etapa">
              <span className="etapa__icone">
                <Icone nome={ICONES[i]} tamanho={28} />
              </span>
              <span className="etapa__n mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="etapa__titulo">{p.titulo}</h3>
              <p className="etapa__texto muted">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
