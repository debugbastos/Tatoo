import { useEffect, useId, useRef, useState } from 'react';
import { Demo } from '../components/Demo';
import { Icone } from '../components/Icone';
import { faq, regua } from '../data/textos';
import { faixa, prefersReduced, scrub, viewProgress } from '../motion/engine';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import './Cuidados.css';


export function Cuidados() {
  const trilho = useRef<HTMLDivElement>(null);
  const [aberta, setAberta] = useState<number | null>(0);
  const id = useId();

  // Régua de cicatrização: preenche com a rolagem; cada marco acende quando é alcançado.
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const fio = el.querySelector<HTMLElement>('.regua__fio i');
    const marcos = Array.from(el.querySelectorAll<HTMLElement>('.marco'));
    const aplicar = (p: number) => {
      fio?.style.setProperty('--p', String(p));
      marcos.forEach((m) => m.classList.toggle('marco--ok', p >= Number(m.dataset.pos) - 0.001));
    };
    if (prefersReduced()) {
      aplicar(1);
      return;
    }
    return scrub(() => faixa(viewProgress(el), 0.2, 0.6), aplicar, 0.1);
  }, []);

  return (
    <section id="cuidados" className="secao cuidados" aria-labelledby="cuidados-titulo">
      <div className="secao__topo" ref={revelar}>
        <div>
          <p className="mono eyebrow">Depois da sessão</p>
          <h2 id="cuidados-titulo" className="titulo">
            <span className="mask">
              <span>Cuidados</span>
            </span>
          </h2>
        </div>
        <p className="lead cuidados__intro" data-fade>
          A tatuagem termina na maca, mas a cicatrização é com você. A régua abaixo é uma orientação geral: o Thalles passa as
          orientações definitivas na sessão.
        </p>
      </div>

      <div className="regua" ref={trilho}>
        <p className="regua__selo">
          <Demo texto="Orientação geral — revisar com o Thalles" />
        </p>
        <div className="regua__fio" aria-hidden="true">
          <i />
        </div>
        <ol className="regua__marcos">
          {regua.marcos.map((m, i) => {
            // marcos igualmente espaçados: os dias reais estão no rótulo
            const pos = i / (regua.marcos.length - 1);
            return (
              <li key={m.dia} className={`marco ${pos >= 1 ? 'marco--fim' : ''}`} data-pos={pos} style={cssVars({ '--x': pos })}>
                <span className="marco__ponto" aria-hidden="true" />
                <span className="marco__dia">
                  Dia <strong>{m.dia}</strong>
                </span>
                <h3 className="marco__titulo">{m.titulo}</h3>
                <p className="muted marco__texto">{m.texto}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="faq" ref={revelar}>
        <h3 className="mono muted faq__titulo" data-fade>
          Perguntas frequentes
        </h3>
        <ul>
          {faq.map((item, i) => {
            const aberto = aberta === i;
            return (
              <li key={item.p} className={`faq__item ${aberto ? 'faq__item--aberto' : ''}`} data-fade style={cssVars({ '--d': `${i * 0.05}s` })}>
                <h4>
                  <button
                    type="button"
                    className="faq__pergunta"
                    aria-expanded={aberto}
                    aria-controls={`${id}-r${i}`}
                    id={`${id}-p${i}`}
                    onClick={() => setAberta(aberto ? null : i)}
                  >
                    <span>{item.p}</span>
                    <Icone nome="mais" className="faq__icone" />
                  </button>
                </h4>
                <div className="faq__resposta" id={`${id}-r${i}`} role="region" aria-labelledby={`${id}-p${i}`}>
                  <div>
                    <p>
                      {item.r} {item.demo ? <Demo texto="Revisar" /> : null}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
