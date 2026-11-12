import { artista } from '../data/estudio';
import { frases, sobre } from '../data/textos';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import retrato from '../assets/img/retrato.webp';
import estrada from '../assets/img/estrada.webp';
import './Sobre.css';

export function Sobre() {
  return (
    <section id="sobre" className="secao sobre" aria-labelledby="sobre-titulo">
      <div className="sobre__fotos" ref={revelar}>
        <figure className="sobre__retrato" data-clip>
          <img src={retrato} alt="Retrato de Thalles Silva, de boné e barba, olhando para cima" width={900} height={1200} loading="lazy" decoding="async" />
        </figure>
        <figure className="sobre__estrada" data-clip style={cssVars({ '--d': '0.2s' })}>
          <img src={estrada} alt="Thalles de costas, olhando o cânion do rio" width={900} height={1200} loading="lazy" decoding="async" />
          <figcaption className="mono muted">“{frases.estrada}”</figcaption>
        </figure>
      </div>

      <div className="sobre__texto" ref={revelar}>
        <p className="mono eyebrow">Sobre o tatuador</p>
        <h2 id="sobre-titulo" className="titulo sobre__nome">
          <span className="mask">
            <span>Thalles</span>
          </span>
          <span className="mask" style={cssVars({ '--d': '0.08s' })}>
            <span>Silva</span>
          </span>
        </h2>
        <ul className="sobre__bio mono" data-fade style={cssVars({ '--d': '0.2s' })}>
          {artista.bio.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <blockquote className="sobre__depoimento" data-fade style={cssVars({ '--d': '0.3s' })}>
          <p>“{sobre.depoimento}”</p>
          <footer className="mono muted">— {artista.nome}</footer>
        </blockquote>
        <p className="lead sobre__ideia" data-fade style={cssVars({ '--d': '0.4s' })}>
          {frases.ideia}
        </p>
      </div>

      <div className="sobre__detalhes" ref={revelar}>
        <div className="sobre__esp" data-fade>
          <h3 className="mono muted">Especialidades</h3>
          <ul>
            {sobre.especialidades.map((e, i) => (
              <li key={e} style={cssVars({ '--d': `${i * 0.05}s` })}>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <ol className="sobre__dif">
          {sobre.diferenciais.map(([t, d], i) => (
            <li key={t} data-fade style={cssVars({ '--d': `${0.1 + i * 0.08}s` })}>
              <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="sobre__dif-titulo">{t}</h3>
              <p className="muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
