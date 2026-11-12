import { useEffect, useRef } from 'react';
import { Demo } from '../components/Demo';
import { estudio } from '../data/estudio';
import { prefersReduced, scrub, viewProgress } from '../motion/engine';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import fotoEstudio from '../assets/img/estudio.webp';
import bancada from '../assets/img/bancada.webp';
import emSessao from '../assets/img/em-sessao.webp';
import './Estudio.css';

/** O que dá para ver nas fotos do próprio estúdio. */
const HIGIENE_REAL = ['Luvas durante a sessão', 'Máquina e bancada protegidas com filme plástico'];
/** Práticas comuns que o estúdio precisa confirmar. */
const HIGIENE_DEMO = ['Agulhas e cartuchos de uso único, abertos na sua frente', 'Luvas e barreiras descartáveis, trocadas a cada cliente'];

export function Estudio() {
  const foto = useRef<HTMLDivElement>(null);

  // Zoom progressivo na foto grande do estúdio.
  useEffect(() => {
    const el = foto.current;
    const img = el?.querySelector<HTMLImageElement>('img');
    if (!el || !img || prefersReduced()) return;
    return scrub(
      () => viewProgress(el),
      (p) => {
        img.style.scale = String(1.18 - p * 0.18);
      },
      0.1,
    );
  }, []);

  return (
    <section id="estudio" className="secao estudio" aria-labelledby="estudio-titulo">
      <div className="secao__topo" ref={revelar}>
        <div>
          <p className="mono eyebrow">O estúdio</p>
          <h2 id="estudio-titulo" className="titulo">
            <span className="mask">
              <span>Arcan</span>
            </span>
            <span className="mask" style={cssVars({ '--d': '0.08s' })}>
              <span>Studio</span>
            </span>
          </h2>
        </div>
        <p className="estudio__intro lead" data-fade>
          É no {estudio.nome}, em {estudio.endereco.cidade}, que o Thalles atende com hora marcada. Um estúdio que também sai de casa: o Arcan
          participou do Enérgicon, encontro de cultura geek e otaku.
        </p>
      </div>

      <div className="estudio__grade">
        <div className="estudio__grande" ref={revelar}>
          <div ref={foto} className="estudio__moldura" data-clip>
            <img src={fotoEstudio} alt="Interior do Arcan Studio Tattoo: maca, luminária e o tatuador trabalhando" width={900} height={1200} loading="lazy" decoding="async" />
          </div>
          <p className="mono muted estudio__legenda">Ambiente — {estudio.nome}</p>
        </div>
        <div className="estudio__lado" ref={revelar}>
          <figure className="estudio__peq" data-clip style={cssVars({ '--d': '0.1s' })}>
            <img src={bancada} alt="Decalque de um floral e a máquina embalada em filme, na bancada" width={900} height={1200} loading="lazy" decoding="async" />
            <figcaption className="mono muted">Bancada — decalque e máquina protegida</figcaption>
          </figure>
          <figure className="estudio__peq" data-clip style={cssVars({ '--d': '0.2s' })}>
            <img src={emSessao} alt="Mãos de luva preta tatuando um traço fino nas costas" width={720} height={960} loading="lazy" decoding="async" />
            <figcaption className="mono muted">Sessão — luvas e traço fino</figcaption>
          </figure>
        </div>
        <div className="estudio__higiene" ref={revelar}>
          <h3 className="mono muted" data-fade>
            Higiene e segurança
          </h3>
          <ul>
            {HIGIENE_REAL.map((h, i) => (
              <li key={h} data-fade style={cssVars({ '--d': `${0.05 + i * 0.07}s` })}>
                {h}
              </li>
            ))}
            {HIGIENE_DEMO.map((h, i) => (
              <li key={h} data-fade style={cssVars({ '--d': `${0.2 + i * 0.07}s` })}>
                {h} <Demo />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
