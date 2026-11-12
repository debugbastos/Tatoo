import { useEffect, useId, useState, type FormEvent } from 'react';
import { Demo } from '../components/Demo';
import { agenda, artista, contato, estudio, linkWhatsApp, regras } from '../data/estudio';
import { revelar } from '../motion/reveal';
import { cssVars } from '../utils/css';
import { contagem, dataExtensa, proximaAbertura } from '../utils/tempo';
import './Agenda.css';

const LOCAIS = ['Antebraço', 'Braço', 'Costas', 'Costela', 'Perna', 'Mão ou punho', 'Pescoço ou nuca', 'Outro lugar'];
const TAMANHOS = ['Pequena (até 5 cm)', 'Média (5 a 15 cm)', 'Grande (15 a 30 cm)', 'Fechamento'];

interface Campos {
  nome: string;
  contato: string;
  local: string;
  tamanho: string;
  ideia: string;
}
type Erros = Partial<Record<keyof Campos, string>>;

function validar(c: Campos): Erros {
  const e: Erros = {};
  if (c.nome.trim().length < 2) e.nome = 'Escreva seu nome.';
  const digitos = c.contato.replace(/\D/g, '');
  const insta = /^@?[a-z0-9._]{2,30}$/i.test(c.contato.trim());
  if (!(digitos.length >= 10 && digitos.length <= 13) && !insta) e.contato = 'Informe um WhatsApp com DDD ou um @ do Instagram.';
  if (!c.local) e.local = 'Escolha o lugar do corpo.';
  if (c.ideia.trim().length < 10) e.ideia = 'Conte a ideia em pelo menos uma frase.';
  return e;
}

function Contagem() {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const alvo = proximaAbertura(agenda.diaAbertura, agenda.hora, estudio.fuso, new Date(agora));
  const c = contagem(alvo.getTime() - agora);
  return (
    <div className="contagem">
      <p className="mono muted contagem__rotulo">
        Próxima abertura de agenda <Demo />
      </p>
      <p className="contagem__data">{dataExtensa(alvo, estudio.fuso)}</p>
      <ol className="contagem__numeros" aria-label={`Faltam ${c.dias} dias, ${c.horas} horas e ${c.minutos} minutos`}>
        {(
          [
            ['dias', c.dias],
            ['horas', c.horas],
            ['min', c.minutos],
            ['seg', c.segundos],
          ] as const
        ).map(([r, v]) => (
          <li key={r} aria-hidden="true">
            <span className="contagem__n">{String(v).padStart(2, '0')}</span>
            <span className="mono muted">{r}</span>
          </li>
        ))}
      </ol>
      <p className="mono muted contagem__fuso">Horário de Paulo Afonso (BA)</p>
    </div>
  );
}

export function Agenda() {
  const id = useId();
  const [campos, setCampos] = useState<Campos>({ nome: '', contato: '', local: '', tamanho: TAMANHOS[1], ideia: '' });
  const [erros, setErros] = useState<Erros>({});
  const [pronto, setPronto] = useState<string | null>(null);

  const mudar = (k: keyof Campos) => (e: { target: { value: string } }) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }));
    if (erros[k]) setErros((er) => ({ ...er, [k]: undefined }));
  };

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const er = validar(campos);
    setErros(er);
    const primeiro = (Object.keys(er) as (keyof Campos)[])[0];
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const msg = [
      `Oi, Thalles! Sou ${campos.nome.trim()} e quero entrar na lista de espera.`,
      `Lugar do corpo: ${campos.local}. Tamanho: ${campos.tamanho}.`,
      `A ideia: ${campos.ideia.trim()}`,
      `Meu contato: ${campos.contato.trim()}`,
    ].join('\n');
    const link = linkWhatsApp(msg);
    setPronto(link);
    window.open(link, '_blank', 'noopener');
  }

  const erro = (k: keyof Campos) =>
    erros[k] ? (
      <span id={`${id}-${k}-erro`} className="campo__erro mono">
        {erros[k]}
      </span>
    ) : null;
  const aria = (k: keyof Campos) => ({
    id: `${id}-${k}`,
    'aria-invalid': erros[k] ? true : undefined,
    'aria-describedby': erros[k] ? `${id}-${k}-erro` : undefined,
  });

  return (
    <section id="agenda" className="secao agenda" aria-labelledby="agenda-titulo">
      <div className="secao__topo" ref={revelar}>
        <div>
          <p className="mono eyebrow">Agenda</p>
          <h2 id="agenda-titulo" className="titulo">
            <span className="mask">
              <span>Agenda</span>
            </span>
          </h2>
        </div>
        <p className="lead agenda__intro" data-fade>
          O agendamento é feito pelo WhatsApp {contato.whatsappExibicao} ou pelo direct do @{artista.instagram}. Você manda a ideia, recebe o
          orçamento e marca a data.
        </p>
      </div>

      <div className="agenda__grade">
        <div className="agenda__info" ref={revelar}>
          <div data-fade>
            <Contagem />
          </div>
          <div className="agenda__regras" data-fade style={cssVars({ '--d': '0.15s' })}>
            <h3 className="mono muted">
              Regras de atendimento <Demo />
            </h3>
            <dl>
              {regras.itens.map(([dt, dd]) => (
                <div key={dt}>
                  <dt className="mono">{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="agenda__canais" data-fade style={cssVars({ '--d': '0.25s' })}>
            <a className="btn btn--cheio" href={linkWhatsApp()} target="_blank" rel="noopener">
              WhatsApp {contato.whatsappExibicao} <span className="seta">↗</span>
            </a>
            <a className="btn" href={artista.instagramUrl} target="_blank" rel="noopener">
              Direct @{artista.instagram} <span className="seta">↗</span>
            </a>
          </div>
        </div>

        <form className="agenda__form" noValidate onSubmit={enviar} ref={revelar} aria-labelledby={`${id}-titulo`}>
          <h3 id={`${id}-titulo`} className="agenda__form-titulo">
            Lista de espera
          </h3>
          <p className="muted agenda__form-sub">Preencha e o WhatsApp abre com a sua mensagem pronta para o Thalles.</p>

          <div className="campo">
            <label htmlFor={`${id}-nome`} className="mono">
              Nome
            </label>
            <input {...aria('nome')} type="text" name="nome" autoComplete="name" value={campos.nome} onChange={mudar('nome')} />
            {erro('nome')}
          </div>
          <div className="campo">
            <label htmlFor={`${id}-contato`} className="mono">
              WhatsApp ou Instagram
            </label>
            <input
              {...aria('contato')}
              type="text"
              name="contato"
              placeholder="(75) 9 0000-0000 ou @seuusuario"
              autoComplete="tel"
              value={campos.contato}
              onChange={mudar('contato')}
            />
            {erro('contato')}
          </div>
          <div className="campo campo--duplo">
            <div>
              <label htmlFor={`${id}-local`} className="mono">
                Lugar do corpo
              </label>
              <select {...aria('local')} name="local" value={campos.local} onChange={mudar('local')}>
                <option value="">Escolha…</option>
                {LOCAIS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              {erro('local')}
            </div>
            <div>
              <label htmlFor={`${id}-tamanho`} className="mono">
                Tamanho
              </label>
              <select {...aria('tamanho')} name="tamanho" value={campos.tamanho} onChange={mudar('tamanho')}>
                {TAMANHOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="campo">
            <label htmlFor={`${id}-ideia`} className="mono">
              A ideia
            </label>
            <textarea
              {...aria('ideia')}
              name="ideia"
              rows={3}
              maxLength={400}
              placeholder="Conte o que você quer tatuar. Referências você manda depois, no WhatsApp."
              value={campos.ideia}
              onChange={mudar('ideia')}
            />
            {erro('ideia')}
          </div>
          <div className="campo">
            <span className="mono campo__rotulo">Profissional</span>
            <p className="campo__fixo">{artista.nome}</p>
          </div>

          <button type="submit" className="btn btn--cheio agenda__enviar">
            Enviar pelo WhatsApp <span className="seta">↗</span>
          </button>
          <p className="mono muted agenda__aviso">Nada fica salvo neste site: o envio só abre o WhatsApp com a mensagem.</p>
          {pronto && (
            <p className="agenda__ok" role="status">
              Mensagem pronta.{' '}
              <a className="link" href={pronto} target="_blank" rel="noopener">
                Se o WhatsApp não abriu, toque aqui.
              </a>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
