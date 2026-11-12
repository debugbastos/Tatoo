/**
 * Motor de animação do site.
 *
 * Faz o papel do GSAP + ScrollTrigger num arquivo só, sem dependências:
 * - um único laço requestAnimationFrame compartilhado (onTick);
 * - progresso de seções presas ao scroll (pinProgress) e de elementos cruzando a tela (viewProgress);
 * - scrub: segue o progresso com suavização, como `scrub: 0.6` do ScrollTrigger;
 * - tween: animações por tempo com easing (usadas na intro).
 * Cada função devolve uma função de limpeza, para useEffect e React Strict Mode.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Converte v do intervalo [a, b] para [0, 1], com limite. */
export const faixa = (v: number, a: number, b: number) => clamp((v - a) / (b - a || 1));

export const ease = {
  linear: (t: number) => t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};

type Tick = (agora: number, dt: number) => void;
const ticks = new Set<Tick>();
let raf = 0;
let ultimo = 0;

function quadro(agora: number) {
  const dt = Math.min(0.1, Math.max(0, (agora - ultimo) / 1000));
  ultimo = agora;
  ticks.forEach((t) => t(agora, dt));
  raf = ticks.size ? requestAnimationFrame(quadro) : 0;
}

/** Registra uma função no laço de animação. Devolve a limpeza. */
export function onTick(fn: Tick): () => void {
  ticks.add(fn);
  if (!raf) {
    ultimo = performance.now();
    raf = requestAnimationFrame(quadro);
  }
  return () => {
    ticks.delete(fn);
  };
}

export function prefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** 0 quando o topo da seção encosta no topo da tela; 1 quando o fim dela encosta no fim da tela. */
export function pinProgress(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const curso = r.height - window.innerHeight;
  if (curso <= 0) return r.top <= 0 ? 1 : 0;
  return clamp(-r.top / curso);
}

/** 0 quando o topo do elemento entra pela base da tela; 1 quando o fim dele sai pelo topo. */
export function viewProgress(el: Element): number {
  const r = el.getBoundingClientRect();
  return clamp((window.innerHeight - r.top) / (window.innerHeight + r.height));
}

/**
 * Segue um valor lido a cada quadro com suavização exponencial (segundos até ~63%).
 * Só chama `aplicar` quando o valor muda.
 */
export function scrub(ler: () => number, aplicar: (v: number) => void, suavidade = 0.12): () => void {
  let atual = ler();
  let aplicado = Number.NaN;
  const reduzido = prefersReduced();
  return onTick((_agora, dt) => {
    const alvo = ler();
    const k = reduzido || suavidade <= 0 ? 1 : 1 - Math.exp(-dt / suavidade);
    atual += (alvo - atual) * k;
    if (Math.abs(alvo - atual) < 0.0002) atual = alvo;
    if (atual !== aplicado) {
      aplicado = atual;
      aplicar(atual);
    }
  });
}

interface TweenOpcoes {
  duracao: number;
  atraso?: number;
  easing?: (t: number) => number;
  aoAtualizar: (t: number) => void;
  aoTerminar?: () => void;
}

/** Animação por tempo (segundos). Devolve a função que cancela. */
export function tween({ duracao, atraso = 0, easing = ease.outCubic, aoAtualizar, aoTerminar }: TweenOpcoes): () => void {
  let inicio = -1;
  let terminado = false;
  const parar = onTick((agora) => {
    if (inicio < 0) inicio = agora + atraso * 1000;
    if (agora < inicio) return;
    const t = clamp((agora - inicio) / (duracao * 1000));
    aoAtualizar(easing(t));
    if (t >= 1) {
      terminado = true;
      parar();
      aoTerminar?.();
    }
  });
  return () => {
    if (!terminado) parar();
  };
}

/** Executa `fn` depois de `s` segundos, dentro do mesmo laço (cancelável). */
export function depois(s: number, fn: () => void): () => void {
  return tween({ duracao: 0.001, atraso: s, aoAtualizar: () => {}, aoTerminar: fn });
}
