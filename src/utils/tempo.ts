/**
 * Datas no fuso do estúdio (America/Bahia, sem horário de verão), independente do fuso
 * de quem visita o site.
 */
function partes(data: Date, fuso: string) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: fuso,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const p: Record<string, number> = {};
  for (const { type, value } of f.formatToParts(data)) if (type !== 'literal') p[type] = Number(value);
  return { ano: p.year, mes: p.month, dia: p.day, hora: p.hour, minuto: p.minute, segundo: p.second };
}

/** Diferença (ms) entre o relógio do fuso e o UTC naquele instante. */
function deslocamento(data: Date, fuso: string): number {
  const p = partes(data, fuso);
  return Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto, p.segundo) - Math.floor(data.getTime() / 1000) * 1000;
}

/** Converte "dia/mês/ano hora:00 no fuso" para um Date real. */
export function noFuso(ano: number, mes: number, dia: number, hora: number, fuso: string): Date {
  const palpite = Date.UTC(ano, mes - 1, dia, hora);
  const d = deslocamento(new Date(palpite), fuso);
  return new Date(palpite - d);
}

/** Próximo dia `dia` do mês às `hora` (no fuso), a partir de agora. */
export function proximaAbertura(dia: number, hora: number, fuso: string, agora = new Date()): Date {
  const p = partes(agora, fuso);
  let alvo = noFuso(p.ano, p.mes, dia, hora, fuso);
  if (alvo.getTime() <= agora.getTime()) {
    const mes = p.mes === 12 ? 1 : p.mes + 1;
    const ano = p.mes === 12 ? p.ano + 1 : p.ano;
    alvo = noFuso(ano, mes, dia, hora, fuso);
  }
  return alvo;
}

export function contagem(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { dias: Math.floor(s / 86400), horas: Math.floor((s % 86400) / 3600), minutos: Math.floor((s % 3600) / 60), segundos: s % 60 };
}

export function dataExtensa(data: Date, fuso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' }).format(data);
}
