/**
 * Geometria do nome gigante a partir de src/data/letras.json (gerado por ferramentas/letras.py).
 * As letras estão em unidades da fonte com y para cima; aqui elas viram caminhos SVG prontos.
 */
import letrasJson from '../data/letras.json';

interface LetraFonte {
  d: string;
  avanco: number;
}
interface LetrasArquivo {
  texto: string;
  upm: number;
  altura: number;
  /** Espaço extra entre letras, em fração do em (vem do ferramentas/letras.py). */
  tracking?: number;
  letras: Record<string, LetraFonte>;
}

const dados = letrasJson as LetrasArquivo;

export interface LetraPosta {
  ch: string;
  d: string;
  x: number;
  largura: number;
}

export interface NomeGeometria {
  letras: LetraPosta[];
  largura: number;
  altura: number;
}

/** Monta o nome com o espaçamento entre letras (tracking) em unidades da fonte. */
export function montarNome(texto = dados.texto, tracking = dados.tracking ?? 0): NomeGeometria {
  const espaco = dados.upm * tracking;
  let x = 0;
  const letras: LetraPosta[] = [];
  for (const ch of texto) {
    const l = dados.letras[ch];
    if (!l) continue;
    letras.push({ ch, d: l.d, x, largura: l.avanco });
    x += l.avanco + espaco;
  }
  return { letras, largura: x - espaco, altura: dados.altura };
}

/** Folga em volta das letras no viewBox (o contorno não fica cortado). */
export const FOLGA_NOME = 0.04;

/** Largura ÷ altura do nome desenhado (com a folga): o CSS usa para limitar a altura. */
export function proporcaoNome(): number {
  const g = montarNome();
  const f = g.altura * FOLGA_NOME;
  return (g.largura + f * 2) / (g.altura + f * 2);
}
