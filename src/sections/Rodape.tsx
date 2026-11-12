import { useEffect, useRef } from 'react';
import { NomeSvg } from '../components/NomeSvg';
import { Demo } from '../components/Demo';
import { artista, contato, estudio, horario, linkWhatsApp } from '../data/estudio';
import { faixa, prefersReduced, scrub } from '../motion/engine';
import './Rodape.css';

const LINKS = [
  ['#trabalhos', 'Trabalhos'],
  ['#sobre', 'Sobre'],
  ['#estudio', 'Estúdio'],
  ['#processo', 'Processo'],
  ['#agenda', 'Agenda'],
  ['#cuidados', 'Cuidados'],
  ['#localizacao', 'Localização'],
  ['#contato', 'Contato'],
] as const;

export function Rodape() {
  const nome = useRef<HTMLDivElement>(null);

  // O nome gigante aparece em contorno e é preenchido de baixo para cima com a rolagem.
  useEffect(() => {
    const el = nome.current;
    if (!el) return;
    const subidas = Array.from(el.querySelectorAll<SVGRectElement>('.nome__subida'));
    const alturas = subidas.map((r) => Number(r.dataset.altura) || 0);
    const aplicar = (p: number) =>
      subidas.forEach((r, i) => {
        const k = faixa(p, i * 0.06, 0.64 + i * 0.06);
        r.setAttribute('height', String(alturas[i] * k));
      });
    if (prefersReduced()) {
      aplicar(1);
      return;
    }
    const ler = () => {
      const r = el.getBoundingClientRect();
      return faixa(window.innerHeight - r.top, r.height * 0.15, r.height + 40);
    };
    return scrub(ler, aplicar, 0.12);
  }, []);

  const e = estudio.endereco;
  return (
    <footer className="rodape">
      <div className="rodape__colunas">
        <div>
          <p className="rodape__marca">Thalles</p>
          <p className="mono muted">
            {artista.funcao} · {artista.estilos.join(', ')}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="mono muted">Navegação</h2>
          <ul>
            {LINKS.map(([href, r]) => (
              <li key={href}>
                <a className="link-rodape" href={href}>
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mono muted">Endereço</h2>
          <address>
            {estudio.nome}
            <br />
            {e.rua} — {e.bairro}
            <br />
            {e.cidade}, {e.uf} · {e.cep}
          </address>
          <h2 className="mono muted rodape__sub">
            Horário <Demo />
          </h2>
          {horario.linhas.map(([d, h]) => (
            <p key={d}>
              {d}: {h}
            </p>
          ))}
        </div>
        <div>
          <h2 className="mono muted">Contato</h2>
          <p>
            <a className="link-rodape" href={linkWhatsApp()} target="_blank" rel="noopener">
              WhatsApp {contato.whatsappExibicao}
            </a>
          </p>
          <p>
            <a className="link-rodape" href={contato.telefoneHref}>
              Telefone {contato.whatsappExibicao}
            </a>
          </p>
          <p>
            <a className="link-rodape" href={artista.instagramUrl} target="_blank" rel="noopener">
              Instagram @{artista.instagram}
            </a>
          </p>
        </div>
      </div>

      <div className="rodape__nome" ref={nome}>
        <NomeSvg id="rodape-nome" contornoPx={1} />
      </div>

      <div className="rodape__base mono muted">
        <p>
          © {new Date().getFullYear()} {artista.nome} · {estudio.nome}. Todos os direitos reservados.
        </p>
        <button
          type="button"
          className="rodape__topo"
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
        >
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  );
}
