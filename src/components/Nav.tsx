import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSecaoAtiva } from '../hooks/useSecaoAtiva';
import { artista, contato, enderecoLinha, linkWhatsApp } from '../data/estudio';
import { onTick, prefersReduced } from '../motion/engine';
import './Nav.css';

const LINKS = [
  ['trabalhos', 'Trabalhos'],
  ['sobre', 'Sobre'],
  ['estudio', 'Estúdio'],
  ['processo', 'Processo'],
  ['agenda', 'Agenda'],
  ['cuidados', 'Cuidados'],
  ['localizacao', 'Local'],
  ['contato', 'Contato'],
] as const;
const IDS = LINKS.map(([id]) => id);

export function Nav() {
  const ativa = useSecaoAtiva(IDS);
  const [aberto, setAberto] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const marca = useRef<HTMLSpanElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // Some ao descer, volta ao subir; ganha fundo depois do topo.
  useEffect(() => {
    let ultimoY = window.scrollY;
    const reduzido = prefersReduced();
    return onTick(() => {
      const el = nav.current;
      if (!el) return;
      const y = window.scrollY;
      el.classList.toggle('nav--fundo', y > 40);
      if (!reduzido && !document.body.classList.contains('travado')) {
        if (y > ultimoY + 6 && y > 160) el.classList.add('nav--oculta');
        else if (y < ultimoY - 6) el.classList.remove('nav--oculta');
      }
      ultimoY = y;
    });
  }, []);

  // Indicador desliza até o link da seção atual.
  useLayoutEffect(() => {
    const m = marca.current;
    const ul = lista.current;
    if (!m || !ul) return;
    const link = ul.querySelector<HTMLAnchorElement>(`a[href="#${ativa}"]`);
    if (!link) {
      m.style.opacity = '0';
      return;
    }
    m.style.opacity = '1';
    m.style.transform = `translateX(${link.offsetLeft}px)`;
    m.style.width = `${link.offsetWidth}px`;
  }, [ativa]);

  // Menu mobile: trava a rolagem, foca o primeiro link, Esc fecha, devolve o foco.
  useEffect(() => {
    if (!aberto) return;
    document.body.classList.add('travado');
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };
    window.addEventListener('keydown', tecla);
    const b = botao.current;
    return () => {
      document.body.classList.remove('travado');
      window.removeEventListener('keydown', tecla);
      b?.focus();
    };
  }, [aberto]);

  return (
    <>
      <header ref={nav} className="nav">
        <a className="nav__marca" href="#inicio" aria-label={`${artista.nome}, início`}>
          <span className="nav__nome">Thalles</span>
          <span className="nav__sub mono">Tattoo</span>
        </a>
        <nav aria-label="Seções" className="nav__links">
          <ul ref={lista}>
            {LINKS.map(([id, rotulo]) => (
              <li key={id}>
                <a href={`#${id}`} className={ativa === id ? 'ativo' : ''} aria-current={ativa === id ? 'true' : undefined}>
                  {rotulo}
                </a>
              </li>
            ))}
          </ul>
          <span ref={marca} className="nav__marcador" aria-hidden="true" />
        </nav>
        <div className="nav__acoes">
          <a className="btn btn--cheio nav__cta" href={linkWhatsApp()} target="_blank" rel="noopener">
            Agendar <span className="seta">↗</span>
          </a>
          <button
            ref={botao}
            className="nav__menu mono"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="nav__menu-linhas" aria-hidden="true" />
            {aberto ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="menu-mobile"
        className={`menu ${aberto ? 'menu--aberto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!aberto}
        inert={!aberto}
      >
        <nav aria-label="Menu">
          <ol>
            {LINKS.map(([id, rotulo], i) => (
              <li key={id} style={{ transitionDelay: aberto ? `${0.05 + i * 0.04}s` : '0s' }}>
                <a href={`#${id}`} onClick={() => setAberto(false)}>
                  <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                  {rotulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu__pe mono muted">
          <p>{enderecoLinha}</p>
          <p>
            <a className="link" href={linkWhatsApp()} target="_blank" rel="noopener">
              WhatsApp {contato.whatsappExibicao}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
