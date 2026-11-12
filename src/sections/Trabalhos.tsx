import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { ESTILOS, trabalhos, type Estilo } from '../data/trabalhos';
import { artista } from '../data/estudio';
import { onTick, prefersReduced } from '../motion/engine';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import './Trabalhos.css';

// O lightbox só é baixado quando alguém abre uma foto (code splitting).
const Lightbox = lazy(() => import('../components/Lightbox'));

type Filtro = 'Todos' | Estilo;
/** Na grade completa, duas fotos ganham destaque (2×2): a primeira à esquerda e a décima à direita. */
const DESTAQUES: Record<number, string> = { 0: ' obra--destaque', 9: ' obra--destaque obra--direita' };
const FILTROS: Filtro[] = ['Todos', ...ESTILOS];

export function Trabalhos() {
  const [filtro, setFiltro] = useState<Filtro>('Todos');
  const [aberto, setAberto] = useState<number | null>(null);
  const grade = useRef<HTMLDivElement>(null);
  const origem = useRef<HTMLElement | null>(null);
  const lista = useMemo(() => (filtro === 'Todos' ? trabalhos : trabalhos.filter((t) => t.estilo === filtro)), [filtro]);
  const contagem = useMemo(() => {
    const c: Record<string, number> = { Todos: trabalhos.length };
    for (const t of trabalhos) c[t.estilo] = (c[t.estilo] ?? 0) + 1;
    return c;
  }, []);

  // Parallax discreto: cada foto desliza um pouco dentro da moldura.
  useEffect(() => {
    const g = grade.current;
    if (!g || prefersReduced()) return;
    const desk = window.matchMedia('(min-width: 1024px)');
    return onTick(() => {
      if (!desk.matches) return;
      const vh = window.innerHeight;
      g.querySelectorAll<HTMLElement>('.obra__img').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 em volta do centro
        const img = el.firstElementChild as HTMLElement | null;
        if (img) img.style.translate = `0 ${(p * (i % 2 ? -26 : -14)).toFixed(1)}px`;
      });
    });
  }, [filtro]);

  return (
    <section id="trabalhos" className="secao trabalhos" aria-labelledby="trabalhos-titulo">
      <div className="secao__topo" ref={revelar}>
        <div>
          <p className="mono eyebrow">Mostruário</p>
          <h2 id="trabalhos-titulo" className="titulo">
            <span className="mask">
              <span>Trabalhos</span>
            </span>
          </h2>
        </div>
        <p className="trabalhos__intro muted" data-fade>
          Fotos reais, publicadas no Instagram{' '}
          <a className="link" href={artista.instagramUrl} target="_blank" rel="noopener">
            @{artista.instagram}
          </a>
          . Toque numa foto para ver em tela cheia.
        </p>
      </div>

      <div className="trabalhos__filtros" role="group" aria-label="Filtrar por estilo">
        {FILTROS.map((f) => (
          <button key={f} type="button" className="filtro mono" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
            {f}
            <span className="filtro__n">{String(contagem[f] ?? 0).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <p className="sr" aria-live="polite">
        {lista.length} trabalhos{filtro === 'Todos' ? '' : ` em ${filtro}`}.
      </p>

      <div className="trabalhos__grade" ref={grade} key={filtro}>
        {lista.map((t, i) => (
          <figure key={t.id} className={`obra${filtro === 'Todos' ? DESTAQUES[i] ?? '' : ''}`} ref={revelar}>
            <button
              type="button"
              className="obra__botao"
              aria-label={`Abrir em tela cheia: ${t.titulo}, ${t.estilo}, ${t.local}`}
              onClick={(e) => {
                origem.current = e.currentTarget;
                setAberto(i);
              }}
            >
              <span className="obra__img" data-clip style={cssVars({ '--d': `${(i % 3) * 0.08}s` })}>
                <img src={t.src} alt={t.alt} width={t.w} height={t.h} loading="lazy" decoding="async" style={{ objectPosition: t.foco }} />
              </span>
              <span className="obra__mais mono" aria-hidden="true">
                Ver ↗
              </span>
            </button>
            <figcaption className="obra__legenda" data-fade style={cssVars({ '--d': `${0.2 + (i % 3) * 0.08}s` })}>
              <span className="mono muted">
                {String(trabalhos.indexOf(t) + 1).padStart(2, '0')} — {t.estilo}
                {t.nota ? ` · ${t.nota}` : ''}
              </span>
              <span className="obra__titulo">{t.titulo}</span>
              <span className="mono muted">{t.local}</span>
            </figcaption>
          </figure>
        ))}
        {filtro === 'Todos' && (
          <a className="obra-cta" href={artista.instagramUrl} target="_blank" rel="noopener" ref={revelar}>
            <span className="mono muted" data-fade>
              Mais trabalhos
            </span>
            <span className="obra-cta__titulo" data-fade>
              O portfólio completo está no Instagram
            </span>
            <span className="obra-cta__link mono" data-fade>
              @{artista.instagram} <span className="seta">↗</span>
            </span>
          </a>
        )}
      </div>

      {aberto !== null && (
        <Suspense fallback={null}>
          <Lightbox
            itens={lista}
            indice={aberto}
            aoMudar={setAberto}
            aoFechar={() => {
              setAberto(null);
              origem.current?.focus();
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
