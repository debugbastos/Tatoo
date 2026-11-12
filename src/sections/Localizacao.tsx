import { useState } from 'react';
import { Demo } from '../components/Demo';
import { Icone } from '../components/Icone';
import { estudio, horario, mapa } from '../data/estudio';
import { revelar } from '../motion/reveal';
import './Localizacao.css';

export function Localizacao() {
  // O mapa (Google) só carrega quando a pessoa pede — economiza dados e não rastreia quem só passou.
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const e = estudio.endereco;
  return (
    <section id="localizacao" className="secao local" aria-labelledby="local-titulo">
      <div className="local__grade">
        <div className="local__texto" ref={revelar}>
          <p className="mono eyebrow">Localização</p>
          <h2 id="local-titulo" className="titulo">
            <span className="mask">
              <span>Onde</span>
            </span>
            <span className="mask">
              <span>fica</span>
            </span>
          </h2>
          <address className="local__endereco" data-fade>
            <span className="local__rua">{e.rua}</span>
            <span>
              {e.bairro} — {e.cidade}, {e.uf}
            </span>
            <span className="mono muted">CEP {e.cep}</span>
          </address>
          <p className="muted" data-fade>
            {estudio.nome}. {horario.observacao}
          </p>
          <div className="local__horario" data-fade>
            <h3 className="mono muted">
              Horário <Demo />
            </h3>
            <dl>
              {horario.linhas.map(([d, h]) => (
                <div key={d}>
                  <dt>{d}</dt>
                  <dd className="mono">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a className="btn btn--cheio" href={mapa.abrir} target="_blank" rel="noopener" data-fade>
            <Icone nome="pino" tamanho={16} /> Abrir no Google Maps <span className="seta">↗</span>
          </a>
        </div>

        <div className="local__mapa-caixa" ref={revelar}>
        <div className="local__mapa" data-clip>
          {mostrarMapa ? (
            <iframe
              src={mapa.embed}
              title={`Mapa: ${e.rua}, ${e.bairro}, ${e.cidade} — ${e.uf}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <button type="button" className="local__capa" onClick={() => setMostrarMapa(true)}>
              <span className="local__alvo" aria-hidden="true">
                <Icone nome="pino" tamanho={28} />
              </span>
              <span className="local__capa-texto">
                {e.rua}, {e.bairro}
              </span>
              <span className="mono muted">Toque para carregar o mapa</span>
            </button>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
