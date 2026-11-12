import { useEffect, useLayoutEffect, useRef } from 'react';
import { NomeSvg } from '../components/NomeSvg';
import { artista, estudio, linkWhatsApp } from '../data/estudio';
import { frases } from '../data/textos';
import { iniciarIntro } from '../motion/intro';
import { prefersReduced, scrub, viewProgress } from '../motion/engine';
import { cssVars } from '../utils/css';
import { proporcaoNome } from '../utils/nome';
import fotoHero from '../assets/img/hero.webp';
import './Hero.css';

export function Hero() {
  const secao = useRef<HTMLElement>(null);
  const foto = useRef<HTMLImageElement>(null);
  const [linha1, linha2] = frases.hero.split(', ');

  // Intro antes da primeira pintura, para não piscar o estado final.
  useLayoutEffect(() => {
    const el = secao.current;
    if (!el) return;
    if (prefersReduced() || document.documentElement.classList.contains('intro-done')) {
      el.classList.add('hero--foto', 'hero--textos', 'is-in');
      document.documentElement.classList.remove('intro');
      return;
    }
    return iniciarIntro(el, foto.current);
  }, []);

  // Ao rolar: a foto desce devagar e o nome sobe (profundidade).
  useEffect(() => {
    const el = secao.current;
    if (!el || prefersReduced()) return;
    const img = el.querySelector<HTMLElement>('.hero__foto-img');
    const nome = el.querySelector<HTMLElement>('.hero__nome');
    return scrub(
      () => viewProgress(el),
      (p) => {
        const s = Math.max(0, p - 0.5) * 2; // 0 com o hero inteiro na tela, 1 quando ele sai
        if (img) img.style.transform = `translate3d(0, ${s * 12}%, 0) scale(${1 + s * 0.06})`;
        if (nome) nome.style.transform = `translate3d(0, ${-s * 30}%, 0)`;
      },
      0.08,
    );
  }, []);

  return (
    <section id="inicio" ref={secao} className="hero" aria-labelledby="hero-titulo">
      <h1 id="hero-titulo" className="sr">
        {artista.nome} — tatuador em {estudio.endereco.cidade}, {estudio.endereco.uf}
      </h1>

      <figure className="hero__foto">
        <div className="hero__foto-quadro">
          <img
            ref={foto}
            className="hero__foto-img"
            src={fotoHero}
            width={900}
            height={1600}
            fetchPriority="high"
            alt="Thalles Silva, de luvas, passa o decalque roxo na perna de um cliente com um marcador vermelho"
          />
        </div>
        <span className="hero__canto hero__canto--a" aria-hidden="true" />
        <span className="hero__canto hero__canto--b" aria-hidden="true" />
        <figcaption className="hero__legenda mono muted">
          <span>Em sessão</span>
          <span>{estudio.nome}</span>
        </figcaption>
      </figure>

      <div className="hero__esq">
        <p className="mono hero__indice" data-fade>
          <span>Nº 001</span>
          <span className="muted">{artista.funcao}</span>
        </p>
        <blockquote className="hero__frase">
          <p>
            <span className="mask" style={cssVars({ '--d': '0s' })}>
              <span>{linha1},</span>
            </span>
            <span className="mask" style={cssVars({ '--d': '0.1s' })}>
              <span>{linha2}</span>
            </span>
          </p>
          <footer className="mono muted hero__autor" data-fade style={cssVars({ '--d': '0.35s' })}>
            — {artista.nome}
          </footer>
        </blockquote>
        <div className="hero__acoes" data-fade style={cssVars({ '--d': '0.45s' })}>
          <a className="btn btn--cheio" href={linkWhatsApp()} target="_blank" rel="noopener">
            Agendar pelo WhatsApp <span className="seta">↗</span>
          </a>
          <a className="btn" href="#trabalhos">
            Ver trabalhos <span className="seta">↓</span>
          </a>
        </div>
      </div>

      <dl className="hero__dir mono" data-fade style={cssVars({ '--d': '0.3s' })}>
        <div>
          <dt className="muted">Estilos</dt>
          {artista.estilos.map((e) => (
            <dd key={e}>{e}</dd>
          ))}
        </div>
        <div>
          <dt className="muted">Estúdio</dt>
          <dd>{estudio.nome}</dd>
          <dd>
            {estudio.endereco.cidade} — {estudio.endereco.uf}
          </dd>
        </div>
        <div>
          <dt className="muted">Instagram</dt>
          <dd>
            <a className="link" href={artista.instagramUrl} target="_blank" rel="noopener">
              @{artista.instagram}
            </a>
          </dd>
        </div>
      </dl>

      <div className="hero__nome" style={cssVars({ '--proporcao': proporcaoNome().toFixed(3) })}>
        <NomeSvg id="hero-nome" contornoPx={1.3} />
      </div>

      <a className="hero__rolar mono muted" href="#sessao" data-fade style={cssVars({ '--d': '0.6s' })}>
        <span className="hero__rolar-linha" aria-hidden="true" />
        Role · a sessão começa
      </a>
    </section>
  );
}
