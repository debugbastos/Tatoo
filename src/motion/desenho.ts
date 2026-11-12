/**
 * Geometria e linha do tempo do beija-flor (src/data/beija-flor.json, do pacote Traço).
 *
 * Os traços vêm na ordem em que uma tatuadora faria (cabeça, bico, asa, corpo, cauda).
 * A linha do tempo intercala "voo" (a mão levanta e vai até o próximo traço) e "traço"
 * (a agulha percorre a linha). Tudo em função de t ∈ [0, 1], para o scroll ir e voltar.
 */
import desenhoJson from '../data/beija-flor.json';
import { clamp, lerp } from './engine';

interface TracoArquivo {
  g: number;
  c: number;
  w: number;
  d: number[];
}
interface DesenhoArquivo {
  caixa: [number, number, number, number];
  grupos: string[];
  tracos: TracoArquivo[];
}
const arquivo = desenhoJson as unknown as DesenhoArquivo;

/** Onde o desenho cabe no antebraço (saída do ferramentas/traco-fonte/encaixe.py). */
export const ENCAIXE = { escala: 0.42, giro: 15, cx: 834, cy: 690 };
/** Prancha = foto do braço (1536 × 1024). */
export const PRANCHA = { w: 1536, h: 1024 };
/** Mão (mao.webp 705 × 874): posição da ponta da agulha na imagem e escala na prancha. */
export const MAO = { w: 705, h: 874, pontaX: 6, pontaY: 526, escala: 0.42 };
/** Onde a mão espera antes do primeiro traço e por onde sai no fim (coordenadas da prancha). */
export const REPOUSO = { x: 1120, y: 610 };
export const SAIDA = { x: 1560, y: 1000 };
/** Centro do enquadramento (câmera) e área do desenho na prancha. */
export const FOCO = { x: 860, y: 720 };

export const GRUPOS: Record<string, string> = { cabeca: 'Cabeça', bico: 'Bico', asa: 'Asa', corpo: 'Corpo', cauda: 'Cauda' };

const centro = { x: arquivo.caixa[2] / 2, y: arquivo.caixa[3] / 2 };
export const TRANSFORM = `translate(${ENCAIXE.cx} ${ENCAIXE.cy}) rotate(${ENCAIXE.giro}) scale(${ENCAIXE.escala}) translate(${-centro.x} ${-centro.y})`;

const rad = (ENCAIXE.giro * Math.PI) / 180;
const cos = Math.cos(rad);
const sin = Math.sin(rad);
/** Ponto do desenho → ponto da prancha (mesma conta do atributo transform). */
export function naPrancha(x: number, y: number): { x: number; y: number } {
  const dx = (x - centro.x) * ENCAIXE.escala;
  const dy = (y - centro.y) * ENCAIXE.escala;
  return { x: ENCAIXE.cx + dx * cos - dy * sin, y: ENCAIXE.cy + dx * sin + dy * cos };
}

export interface Traco {
  grupo: number;
  largura: number;
  d: string;
  pts: number[];
  /** comprimento acumulado em cada ponto */
  acum: number[];
  comprimento: number;
}

export const tracos: Traco[] = arquivo.tracos.map((t) => {
  const acum = [0];
  let total = 0;
  let d = `M${t.d[0]} ${t.d[1]}`;
  for (let i = 2; i < t.d.length; i += 2) {
    total += Math.hypot(t.d[i] - t.d[i - 2], t.d[i + 1] - t.d[i - 1]);
    acum.push(total);
    d += `L${t.d[i]} ${t.d[i + 1]}`;
  }
  return { grupo: t.g, largura: t.w, d, pts: t.d, acum, comprimento: Math.max(total, 0.01) };
});

export const nomesGrupos = arquivo.grupos.map((g) => GRUPOS[g] ?? g);

/** Ponto a uma fração do traço (coordenadas do desenho). */
export function pontoNoTraco(tr: Traco, f: number): { x: number; y: number } {
  const alvo = clamp(f) * tr.comprimento;
  const { acum, pts } = tr;
  let i = 1;
  while (i < acum.length - 1 && acum[i] < alvo) i++;
  const a = acum[i - 1];
  const b = acum[i];
  const k = b > a ? (alvo - a) / (b - a) : 0;
  return { x: lerp(pts[(i - 1) * 2], pts[i * 2], k), y: lerp(pts[(i - 1) * 2 + 1], pts[i * 2 + 1], k) };
}

/* ---------- linha do tempo: voo + traço, ponderados pelo comprimento ---------- */
interface Segmento {
  tipo: 'voo' | 'traco';
  indice: number;
  inicio: number;
  fim: number;
}
const segmentos: Segmento[] = [];
{
  let pos = 0;
  let anterior = { x: REPOUSO.x, y: REPOUSO.y };
  tracos.forEach((tr, i) => {
    const ini = naPrancha(tr.pts[0], tr.pts[1]);
    const voo = 10 + Math.hypot(ini.x - anterior.x, ini.y - anterior.y) * 0.35;
    segmentos.push({ tipo: 'voo', indice: i, inicio: pos, fim: pos + voo });
    pos += voo;
    segmentos.push({ tipo: 'traco', indice: i, inicio: pos, fim: pos + tr.comprimento });
    pos += tr.comprimento;
    const fimPt = pontoNoTraco(tr, 1);
    anterior = naPrancha(fimPt.x, fimPt.y);
  });
  segmentos.forEach((s) => {
    s.inicio /= pos;
    s.fim /= pos;
  });
}

export interface EstadoDesenho {
  /** quantos traços já estão completos */
  completos: number;
  /** fração do traço atual (índice = completos), 0 se em voo */
  parcial: number;
  /** ponta da agulha na prancha */
  ponta: { x: number; y: number };
  /** 0..1 — a mão está levantada (em voo) */
  levantada: number;
  grupo: number;
}

/** Estado do desenho num tempo t ∈ [0, 1]. Busca binária nos segmentos. */
export function estadoEm(t: number): EstadoDesenho {
  t = clamp(t);
  let lo = 0;
  let hi = segmentos.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (segmentos[m].fim < t) lo = m + 1;
    else hi = m;
  }
  const s = segmentos[lo];
  const f = clamp((t - s.inicio) / (s.fim - s.inicio || 1));
  const tr = tracos[s.indice];
  if (s.tipo === 'traco') {
    const p = pontoNoTraco(tr, f);
    const completo = f >= 1;
    return { completos: s.indice + (completo ? 1 : 0), parcial: completo ? 0 : f, ponta: naPrancha(p.x, p.y), levantada: 0, grupo: tr.grupo };
  }
  // voo: da última ponta até o início deste traço, com a mão levantada no meio
  const de = s.indice === 0 ? REPOUSO : (() => {
    const p = pontoNoTraco(tracos[s.indice - 1], 1);
    return naPrancha(p.x, p.y);
  })();
  const ate = naPrancha(tr.pts[0], tr.pts[1]);
  const k = f * f * (3 - 2 * f);
  return {
    completos: s.indice,
    parcial: 0,
    ponta: { x: lerp(de.x, ate.x, k), y: lerp(de.y, ate.y, k) },
    levantada: Math.sin(Math.PI * f),
    grupo: s.indice === 0 ? 0 : tracos[s.indice - 1].grupo,
  };
}

/** Quanto de cada grupo já foi desenhado (0..1), dado o número de traços completos e o parcial. */
const totalPorGrupo = nomesGrupos.map((_, g) => tracos.filter((t) => t.grupo === g).reduce((s, t) => s + t.comprimento, 0));
export function progressoGrupos(completos: number, parcial: number): number[] {
  const feito = nomesGrupos.map(() => 0);
  for (let i = 0; i < completos && i < tracos.length; i++) feito[tracos[i].grupo] += tracos[i].comprimento;
  if (completos < tracos.length) feito[tracos[completos].grupo] += tracos[completos].comprimento * parcial;
  return feito.map((v, g) => clamp(v / (totalPorGrupo[g] || 1)));
}

/** Âncoras das legendas, na prancha. */
const pCabeca = pontoNoTraco(tracos[0], 0.4);
const pCauda = pontoNoTraco(tracos[tracos.length - 1], 1);
export const ANCORAS = {
  cabeca: naPrancha(pCabeca.x, pCabeca.y),
  cauda: naPrancha(pCauda.x, pCauda.y),
};
