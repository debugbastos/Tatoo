import { Icone, type NomeIcone } from '../components/Icone';
import { artista, contato, linkWhatsApp } from '../data/estudio';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import './Contato.css';

export function Contato() {
  const canais: Array<{ icone: NomeIcone; rotulo: string; valor: string; href: string; externo: boolean }> = [
    { icone: 'whatsapp', rotulo: 'WhatsApp', valor: contato.whatsappExibicao, href: linkWhatsApp(), externo: true },
    { icone: 'instagram', rotulo: 'Instagram', valor: `@${artista.instagram}`, href: artista.instagramUrl, externo: true },
    { icone: 'telefone', rotulo: 'Telefone', valor: contato.whatsappExibicao, href: contato.telefoneHref, externo: false },
  ];
  if (contato.email) canais.push({ icone: 'conversa', rotulo: 'E-mail', valor: contato.email, href: `mailto:${contato.email}`, externo: false });

  return (
    <section id="contato" className="secao contato" aria-labelledby="contato-titulo">
      <div ref={revelar}>
        <p className="mono eyebrow">Contato</p>
        <h2 id="contato-titulo" className="contato__titulo">
          <span className="mask">
            <span>Vamos criar</span>
          </span>
          <span className="mask" style={cssVars({ '--d': '0.08s' })}>
            <span>o seu projeto?</span>
          </span>
        </h2>
        <p className="mono muted contato__cita" data-fade style={cssVars({ '--d': '0.2s' })}>
          — como o Thalles termina quase toda legenda
        </p>
      </div>

      <ul className="contato__canais" ref={revelar}>
        {canais.map((c, i) => (
          <li key={c.rotulo} data-fade style={cssVars({ '--d': `${i * 0.07}s` })}>
            <a href={c.href} {...(c.externo ? { target: '_blank', rel: 'noopener' } : {})} className="canal">
              <span className="canal__icone">
                <Icone nome={c.icone} tamanho={22} />
              </span>
              <span className="mono muted canal__rotulo">{c.rotulo}</span>
              <span className="canal__valor">{c.valor}</span>
              <span className="canal__seta" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="contato__cta" ref={revelar}>
        <a className="btn btn--cheio contato__btn" href={linkWhatsApp()} target="_blank" rel="noopener" data-fade>
          Agendar pelo WhatsApp <span className="seta">↗</span>
        </a>
      </div>
    </section>
  );
}
