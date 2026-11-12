import { useEffect, useMemo, useRef } from 'react';
import { NomeSvg } from '../components/NomeSvg';
import { useReducedMotion } from '../hooks/useMedia';
import { clamp, faixa, lerp, pinProgress, scrub } from '../motion/engine';
import {
  ANCORAS,
  FOCO,
  MAO,
  PRANCHA,
  REPOUSO,
  SAIDA,
  TRANSFORM,
  estadoEm,
  naPrancha,
  nomesGrupos,
  pontoNoTraco,
  progressoGrupos,
  tracos,
} from '../motion/desenho';
import braco from '../assets/img/braco.webp';
import mao from '../assets/img/mao.webp';
import './Sessao.css';

/** Fases da linha do tempo (fração do pin). */
const T = { decalque: [0.03, 0.12], desenho: [0.14, 0.86], saida: [0.86, 0.93], fim: 0.93 } as const;
const SESSAO_MIN = 100; // duração mostrada no HUD (peça demonstrativa)
const ultimoPonto = (() => {
  const p = pontoNoTraco(tracos[tracos.length - 1], 1);
  return naPrancha(p.x, p.y);
})();

function relogio(min: number) {
  const m = Math.floor(min);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

/** Enquadramento da prancha para a proporção da tela (a câmera segue o antebraço). */
function enquadrar(aspecto: number) {
  let w: number;
  let h: number;
  if (aspecto >= 1) {
    h = 640;
    w = h * aspecto;
  } else {
    w = 470;
    h = Math.min(PRANCHA.h, w / aspecto);
    w = h * aspecto;
  }
  const x = FOCO.x - w / 2;
  const y = clamp(FOCO.y - h / 2, 0, PRANCHA.h - h);
  return { x, y, w, h };
}

export function Sessao() {
  const secao = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const prancha = useRef<SVGSVGElement>(null);
  const reduzido = useReducedMotion();

  // Os caminhos são renderizados uma vez; o motor só mexe no tracejado.
  const caminhos = useMemo(
    () => ({
      decalque: nomesGrupos.map((_, g) => (
        <g key={g} data-grupo={g}>
          {tracos.map((t, i) => (t.grupo === g ? <path key={i} d={t.d} strokeWidth={t.largura * 1.5 + 0.8} /> : null))}
        </g>
      )),
      tinta: tracos.map((t, i) => <path key={i} d={t.d} strokeWidth={t.largura * 1.15 + 0.35} />),
    }),
    [],
  );

  useEffect(() => {
    const el = secao.current;
    const caixa = pin.current;
    const svg = prancha.current;
    if (!el || !caixa || !svg) return;

    const tinta = Array.from(svg.querySelectorAll<SVGPathElement>('.sessao__tinta path'));
    const decalque = Array.from(svg.querySelectorAll<SVGGElement>('.sessao__decalque g'));
    const maoG = svg.querySelector<SVGGElement>('.sessao__mao');
    const nome = caixa.querySelector<HTMLElement>('.sessao__nome .nome');
    const hud = {
      etapa: caixa.querySelector<HTMLElement>('[data-hud="etapa"]'),
      sessao: caixa.querySelector<HTMLElement>('[data-hud="sessao"]'),
      fase: caixa.querySelector<HTMLElement>('[data-hud="fase"]'),
      barra: caixa.querySelector<HTMLElement>('[data-hud="barra"]'),
    };
    const fases = Array.from(caixa.querySelectorAll<HTMLElement>('.sessao__fases li'));
    const legendas = Array.from(caixa.querySelectorAll<HTMLElement>('.legenda'));
    const tituloA = caixa.querySelector<HTMLElement>('.sessao__titulo-a');
    const tituloB = caixa.querySelector<HTMLElement>('.sessao__titulo-b');
    const fios = Array.from(caixa.querySelectorAll<SVGLineElement>('.sessao__fios line'));
    const pontos = Array.from(caixa.querySelectorAll<SVGCircleElement>('.sessao__fios circle'));

    const comp = tracos.map((t) => t.comprimento);
    tinta.forEach((p, i) => {
      p.style.strokeDasharray = `${comp[i]} ${comp[i] + 2}`;
      p.style.strokeDashoffset = String(comp[i]);
    });
    let feitos = 0;
    let parcial = -1;
    let fim = false;
    let vb = enquadrar(caixa.clientWidth / Math.max(1, caixa.clientHeight));

    // Legendas: âncora no desenho → rótulo deslocado em pixels de tela.
    function posicionar() {
      const W = caixa!.clientWidth;
      const H = caixa!.clientHeight;
      vb = enquadrar(W / Math.max(1, H));
      svg!.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
      const escala = Math.max(W / vb.w, H / vb.h);
      const ox = (W - vb.w * escala) / 2;
      const oy = (H - vb.h * escala) / 2;
      const tela = (p: { x: number; y: number }) => ({ x: ox + (p.x - vb.x) * escala, y: oy + (p.y - vb.y) * escala });
      const estreito = W < 700;
      const baixo = H < 520; // celular deitado: sem espaço para legendas, o HUD basta
      const alvos = [
        { a: tela(ANCORAS.cabeca), d: estreito ? { x: 46, y: fim ? -150 : -120 } : fim ? { x: -230, y: 210 } : { x: -190, y: 150 } },
        { a: tela(ANCORAS.cauda), d: fim ? { x: 240, y: -20 } : { x: 200, y: 60 } },
      ];
      legendas.forEach((l, i) => {
        const esconder = baixo || (i === 1 && estreito);
        l.classList.toggle('oculta', esconder);
        fios[i]?.classList.toggle('oculta', esconder);
        pontos[i]?.classList.toggle('oculta', esconder);
      });
      alvos.forEach(({ a, d }, i) => {
        const r = legendas[i];
        if (!r) return;
        // o rótulo inteiro precisa caber na tela, não só o ponto de encaixe
        const larg = r.offsetWidth || 180;
        const alt = r.offsetHeight || 40;
        const lx = d.x < 0 ? clamp(a.x + d.x, larg + 12, W - 12) : clamp(a.x + d.x, 12, W - larg - 12);
        let ly = clamp(a.y + d.y, 40, H - 40);
        // não deixa o rótulo encostar no título/frase da seção: desce até abaixo dele
        const t = (fim ? tituloB : tituloA)?.getBoundingClientRect();
        const c = caixa!.getBoundingClientRect();
        if (t && t.width > 0) {
          const esq = (d.x < 0 ? lx - larg : lx) + c.left;
          const dir = esq + larg;
          const topo = ly - alt / 2 + c.top;
          const sobrepoe = esq < t.right + 16 && dir > t.left && topo < t.bottom + 16 && topo + alt > t.top;
          if (sobrepoe) ly = clamp(t.bottom - c.top + 24 + alt / 2, 40, H - 40);
        }
        r.style.left = `${lx}px`;
        r.style.top = `${ly}px`;
        r.classList.toggle('legenda--esq', d.x < 0);
        const fio = fios[i];
        fio?.setAttribute('x1', String(a.x));
        fio?.setAttribute('y1', String(a.y));
        fio?.setAttribute('x2', String(lx));
        fio?.setAttribute('y2', String(ly));
        pontos[i]?.setAttribute('cx', String(a.x));
        pontos[i]?.setAttribute('cy', String(a.y));
      });
      caixa!.querySelector<SVGSVGElement>('.sessao__fios')?.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }

    function render(P: number) {
      // 1. tinta, traço a traço (ida e volta)
      const t = faixa(P, T.desenho[0], T.desenho[1]);
      const e = estadoEm(t);
      const alvo = e.completos;
      if (alvo > feitos) for (let i = feitos; i < alvo; i++) tinta[i].style.strokeDashoffset = '0';
      else if (alvo < feitos) for (let i = alvo; i < feitos; i++) tinta[i].style.strokeDashoffset = String(comp[i]);
      if (parcial >= 0 && parcial !== alvo && parcial < tinta.length) {
        tinta[parcial].style.strokeDashoffset = parcial < alvo ? '0' : String(comp[parcial]);
      }
      feitos = alvo;
      if (alvo < tinta.length) {
        tinta[alvo].style.strokeDashoffset = String(comp[alvo] * (1 - e.parcial));
        parcial = alvo;
      } else parcial = -1;

      // 2. decalque: aparece por fase e é limpo no fim
      const limpa = 1 - faixa(P, T.saida[0], T.saida[1]);
      decalque.forEach((g, i) => {
        const entra = faixa(P, T.decalque[0] + i * 0.012, T.decalque[0] + 0.05 + i * 0.012);
        g.style.opacity = String(entra * limpa * 0.55);
      });

      // 3. mão: entra, segue a ponta, levanta entre traços, sai no fim
      if (maoG) {
        let x = e.ponta.x;
        let y = e.ponta.y;
        let opac = 1;
        if (P < T.desenho[0]) {
          const k = faixa(P, 0.02, T.desenho[0]);
          const s = 1 - k * k * (3 - 2 * k);
          x = REPOUSO.x + s * 260;
          y = REPOUSO.y + s * 160;
          opac = k;
        } else if (P > T.saida[0]) {
          const k = faixa(P, T.saida[0], T.saida[1]);
          const s = k * k;
          x = lerp(ultimoPonto.x, SAIDA.x, s);
          y = lerp(ultimoPonto.y, SAIDA.y, s);
          opac = 1 - k;
        }
        const lev = e.levantada;
        maoG.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - lev * 16).toFixed(1)}) rotate(${(-3 + lev * 4).toFixed(2)}) scale(${(1 + lev * 0.04).toFixed(3)})`);
        maoG.style.opacity = String(opac);
      }

      // 4. nome gigante ao fundo
      if (nome) nome.style.transform = `translate3d(${lerp(5, -5, P).toFixed(2)}%, 0, 0)`;

      // 5. HUD e fases
      const pct = Math.round(t * 100);
      if (hud.etapa) hud.etapa.textContent = P < T.desenho[0] ? 'Decalque' : t < 1 ? `Desenhando — ${pct}%` : 'Concluído — 100%';
      if (hud.sessao) hud.sessao.textContent = `${relogio(t * SESSAO_MIN)} / ${relogio(SESSAO_MIN)}`;
      if (hud.fase) hud.fase.textContent = P < T.desenho[0] ? '—' : t >= 1 ? 'Finalizada' : nomesGrupos[e.grupo];
      if (hud.barra) hud.barra.style.transform = `scaleX(${t})`;
      const prog = progressoGrupos(e.completos, e.parcial);
      fases.forEach((li, g) => {
        li.style.setProperty('--p', String(prog[g]));
        li.classList.toggle('ativa', t > 0 && t < 1 && g === e.grupo && prog[g] < 1);
        li.classList.toggle('feita', prog[g] >= 1);
      });

      // 6. legendas
      legendas[0]?.classList.toggle('visivel', P > T.desenho[0] + 0.02);
      legendas[1]?.classList.toggle('visivel', P > T.decalque[1]);
      fios.forEach((f, i) => f.classList.toggle('visivel', legendas[i]?.classList.contains('visivel') ?? false));
      pontos.forEach((c, i) => c.classList.toggle('visivel', legendas[i]?.classList.contains('visivel') ?? false));

      // 7. encerramento
      const agoraFim = P >= T.fim;
      if (agoraFim !== fim) {
        fim = agoraFim;
        el!.classList.toggle('sessao--fim', fim);
        posicionar();
      }
    }

    posicionar();
    const ro = new ResizeObserver(() => posicionar());
    ro.observe(caixa);

    if (reduzido) {
      el.classList.add('sessao--estatica');
      render(1);
      return () => ro.disconnect();
    }
    el.classList.remove('sessao--estatica');
    const parar = scrub(() => pinProgress(el), render, 0.1);
    return () => {
      parar();
      ro.disconnect();
    };
  }, [reduzido]);

  const K = MAO.escala;
  return (
    <section id="sessao" ref={secao} className="sessao" aria-labelledby="sessao-titulo">
      <div ref={pin} className="sessao__pin">
        <div className="sessao__nome" aria-hidden="true">
          <NomeSvg id="sessao-nome" />
        </div>

        <svg
          ref={prancha}
          className="sessao__prancha"
          viewBox={`0 ${PRANCHA.h - 640} ${PRANCHA.w} 640`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-labelledby="sessao-desc"
        >
          <desc id="sessao-desc">
            Um antebraço em preto e branco recebe uma tatuagem de beija-flor em traço fino. Conforme a página rola, a agulha desenha
            cada linha sobre o decalque roxo; no fim, o decalque é limpo e a tatuagem fica pronta.
          </desc>
          <image href={braco} x={0} y={0} width={PRANCHA.w} height={PRANCHA.h} />
          <g transform={TRANSFORM}>
            <g className="sessao__decalque" transform="translate(3 3)">
              {caminhos.decalque}
            </g>
            <g className="sessao__tinta">{caminhos.tinta}</g>
          </g>
          <g className="sessao__mao" style={{ opacity: 0 }}>
            <image href={mao} x={-MAO.pontaX * K} y={-MAO.pontaY * K} width={MAO.w * K} height={MAO.h * K} />
          </g>
        </svg>

        <div className="sessao__legendas" aria-hidden="true">
          <svg className="sessao__fios">
            <line />
            <line />
            <circle r={3} />
            <circle r={3} />
          </svg>
          <p className="legenda mono">
            <span className="legenda__a">Beija-flor — 9 cm</span>
            <span className="legenda__b muted">
              <span className="durante">Fine line · agulha 3RL</span>
              <span className="depois">Traço finalizado</span>
            </span>
          </p>
          <p className="legenda mono">
            <span className="legenda__a">
              <span className="durante">Decalque</span>
              <span className="depois">Limpeza</span>
            </span>
            <span className="legenda__b muted">
              <span className="durante">Guia roxo, sai no fim</span>
              <span className="depois">Decalque removido</span>
            </span>
          </p>
        </div>

        <header className="sessao__titulo">
          <div className="sessao__titulo-a">
            <p className="mono eyebrow">A sessão</p>
            <h2 id="sessao-titulo" className="sessao__h2">
              Traço a traço.
            </h2>
            <p className="sessao__sub">Role a página: a agulha acompanha você.</p>
          </div>
          <div className="sessao__titulo-b" aria-live="polite">
            <p className="mono eyebrow">Fim da sessão</p>
            <p className="sessao__h2">Pronto.</p>
            <p className="sessao__sub">Agora, começa o cuidado.</p>
            <a className="btn sessao__link" href="#cuidados">
              Ver cuidados <span className="seta">↓</span>
            </a>
          </div>
        </header>

        <aside className="hud mono" aria-label="Painel da sessão (peça demonstrativa)">
          <dl>
            <div>
              <dt>Tatuagem</dt>
              <dd>Beija-flor — 9 cm</dd>
            </div>
            <div>
              <dt>Agulha</dt>
              <dd>3RL</dd>
            </div>
            <div>
              <dt>Etapa</dt>
              <dd data-hud="etapa">Decalque</dd>
            </div>
            <div>
              <dt>Fase</dt>
              <dd data-hud="fase">—</dd>
            </div>
            <div>
              <dt>Sessão</dt>
              <dd data-hud="sessao">0:00 / 1:40</dd>
            </div>
          </dl>
          <div className="hud__trilho" aria-hidden="true">
            <span data-hud="barra" />
          </div>
          <p className="hud__nota muted">Peça demonstrativa</p>
        </aside>

        <ol className="sessao__fases mono" aria-label="Fases do desenho">
          {nomesGrupos.map((g, i) => (
            <li key={g}>
              <span className="muted">{String(i + 1).padStart(2, '0')}</span>
              {g}
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
