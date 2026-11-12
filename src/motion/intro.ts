/**
 * Intro do hero (~3,5 s), sem tela de carregamento:
 *  0,0 s  tela preta, o nome é desenhado em contorno, letra por letra;
 *  1,2 s  as letras são preenchidas de baixo para cima;
 *  1,9 s  a foto entra (espera a imagem decodificar, com tempo limite);
 *  2,3 s  a navegação surge; 2,4 s textos revelados por máscara; 3,5 s fim.
 * Rolar, tocar ou apertar uma tecla termina a intro na hora.
 */
import { depois, ease, tween } from './engine';

export function iniciarIntro(hero: HTMLElement, foto: HTMLImageElement | null): () => void {
  const html = document.documentElement;
  const contornos = Array.from(hero.querySelectorAll<SVGPathElement>('.hero__nome .nome__contorno'));
  const subidas = Array.from(hero.querySelectorAll<SVGRectElement>('.hero__nome .nome__subida'));
  const alturas = subidas.map((r) => Number(r.dataset.altura) || Number(r.getAttribute('height')) || 0);
  const comprimentos = contornos.map((p) => p.getTotalLength());
  const cancelar: Array<() => void> = [];
  let terminou = false;

  html.classList.add('intro', 'intro-run');
  contornos.forEach((p, i) => {
    p.style.strokeDasharray = `${comprimentos[i]} ${comprimentos[i]}`;
    p.style.strokeDashoffset = String(comprimentos[i]);
  });
  subidas.forEach((r) => r.setAttribute('height', '0'));

  const fase = (classe: string) => hero.classList.add(classe);

  function terminar() {
    if (terminou) return;
    terminou = true;
    cancelar.forEach((c) => c());
    contornos.forEach((p) => {
      p.style.strokeDasharray = '';
      p.style.strokeDashoffset = '';
    });
    subidas.forEach((r, i) => r.setAttribute('height', String(alturas[i])));
    hero.classList.add('hero--foto', 'hero--textos', 'is-in');
    html.classList.add('intro-nav');
    window.setTimeout(() => html.classList.remove('intro', 'intro-nav', 'intro-run'), 700);
    html.classList.add('intro-done');
    pararEscuta();
  }

  // 1. contorno, letra por letra
  contornos.forEach((p, i) => {
    cancelar.push(
      tween({
        duracao: 0.8,
        atraso: 0.15 + i * 0.12,
        easing: ease.inOutCubic,
        aoAtualizar: (t) => {
          p.style.strokeDashoffset = String(comprimentos[i] * (1 - t));
        },
      }),
    );
  });
  // 2. preenchimento de baixo para cima
  subidas.forEach((r, i) => {
    cancelar.push(
      tween({
        duracao: 0.7,
        atraso: 1.2 + i * 0.07,
        easing: ease.outCubic,
        aoAtualizar: (t) => r.setAttribute('height', String(alturas[i] * t)),
      }),
    );
  });
  // 3. foto: espera a imagem (máx. 2,2 s depois do início) para não revelar um quadro vazio
  const fotoPronta = foto?.decode ? foto.decode().catch(() => undefined) : Promise.resolve();
  const limite = new Promise<void>((ok) => {
    cancelar.push(depois(2.2, ok));
  });
  let fotoFeita = false;
  cancelar.push(
    depois(1.9, () => {
      Promise.race([fotoPronta, limite]).then(() => {
        if (terminou || fotoFeita) return;
        fotoFeita = true;
        fase('hero--foto');
      });
    }),
  );
  // 4. navegação, textos e fim
  cancelar.push(depois(2.3, () => html.classList.add('intro-nav')));
  cancelar.push(depois(2.4, () => fase('hero--textos')));
  cancelar.push(depois(2.45, () => hero.classList.add('is-in')));
  cancelar.push(depois(3.5, terminar));

  // quem quiser navegar não espera
  const pular = () => terminar();
  const opcoes: AddEventListenerOptions = { passive: true };
  window.addEventListener('wheel', pular, opcoes);
  window.addEventListener('touchmove', pular, opcoes);
  window.addEventListener('keydown', pular);
  function pararEscuta() {
    window.removeEventListener('wheel', pular);
    window.removeEventListener('touchmove', pular);
    window.removeEventListener('keydown', pular);
  }

  return () => {
    // Desmontagem — inclui a montagem dupla do React Strict Mode em desenvolvimento:
    // só cancela; a próxima montagem recomeça a intro do zero.
    if (terminou) return;
    cancelar.forEach((c) => c());
    pararEscuta();
  };
}
