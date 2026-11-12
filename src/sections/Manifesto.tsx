import { useEffect, useMemo, useRef } from 'react';
import { Demo } from '../components/Demo';
import { artista, estudio, horario } from '../data/estudio';
import { manifesto } from '../data/textos';
import { faixa, prefersReduced, scrub, viewProgress } from '../motion/engine';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import emSessao from '../assets/img/em-sessao.webp';
import estrada from '../assets/img/estrada.webp';
import bancada from '../assets/img/bancada.webp';
import './Manifesto.css';

const FOTOS = [
  { src: emSessao, alt: 'Mãos de luva tatuando um traço fino nas costas de um cliente' },
  { src: estrada, alt: 'Thalles de costas, de boné, olhando o cânion e o rio' },
  { src: bancada, alt: 'Bancada com decalque e a máquina protegida por filme plástico' },
];

type Peca = { tipo: 'palavra'; texto: string } | { tipo: 'foto'; indice: number };

export function Manifesto() {
  const bloco = useRef<HTMLParagraphElement>(null);
  const textoLimpo = manifesto.replace(/\{img:\d\}\s?/g, '');

  const pecas = useMemo<Peca[]>(() => {
    const out: Peca[] = [];
    for (const parte of manifesto.split(/(\{img:\d\})/)) {
      const m = parte.match(/\{img:(\d)\}/);
      if (m) out.push({ tipo: 'foto', indice: Number(m[1]) });
      else for (const w of parte.split(/\s+/).filter(Boolean)) out.push({ tipo: 'palavra', texto: w });
    }
    return out;
  }, []);

  // O parágrafo começa cinza-escuro e acende letra por letra conforme a rolagem.
  useEffect(() => {
    const p = bloco.current;
    if (!p) return;
    const unidades = Array.from(p.querySelectorAll<HTMLElement>('[data-u]'));
    if (prefersReduced()) {
      unidades.forEach((u) => u.classList.add('aceso'));
      return;
    }
    let acesos = 0;
    return scrub(
      () => faixa(viewProgress(p), 0.18, 0.62),
      (v) => {
        const alvo = Math.round(v * unidades.length);
        if (alvo > acesos) for (let i = acesos; i < alvo; i++) unidades[i].classList.add('aceso');
        else for (let i = alvo; i < acesos; i++) unidades[i].classList.remove('aceso');
        acesos = alvo;
      },
      0.08,
    );
  }, []);

  return (
    <section id="manifesto" className="secao manifesto" aria-labelledby="manifesto-titulo">
      <p className="mono eyebrow">Manifesto</p>
      <h2 id="manifesto-titulo" className="sr">
        Manifesto
      </h2>
      <blockquote className="manifesto__citacao">
        <p className="sr">{textoLimpo}</p>
        <p ref={bloco} className="manifesto__texto" aria-hidden="true">
          {pecas.map((pc, i) =>
            pc.tipo === 'foto' ? (
              <span key={i} className="manifesto__foto" data-u>
                <img src={FOTOS[pc.indice].src} alt="" loading="lazy" decoding="async" />
              </span>
            ) : (
              <span key={i} className="manifesto__palavra">
                {Array.from(pc.texto).map((ch, j) => (
                  <span key={j} data-u>
                    {ch}
                  </span>
                ))}
              </span>
            ),
          )}
        </p>
        <footer className="mono muted manifesto__autor">— {artista.nome}, em legendas do Instagram</footer>
      </blockquote>

      <dl className="manifesto__info" ref={revelar}>
        {[
          ['Estúdio', estudio.nome],
          ['Cidade', `${estudio.endereco.cidade} — ${estudio.endereco.uf}`],
          ['Tatuador', artista.nome],
          ['Estilos', 'Autoral, realismo e fine line'],
          ['Atendimento', 'Com hora marcada, orçamento pelo WhatsApp'],
        ].map(([dt, dd], i) => (
          <div key={dt} data-fade style={cssVars({ '--d': `${i * 0.06}s` })}>
            <dt className="mono muted">{dt}</dt>
            <dd>{dd}</dd>
          </div>
        ))}
        <div data-fade style={cssVars({ '--d': '0.3s' })}>
          <dt className="mono muted">
            Horário <Demo />
          </dt>
          <dd>
            {horario.linhas.slice(0, 2).map(([d, h]) => (
              <span key={d} className="manifesto__hora">
                {d}: {h}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}
