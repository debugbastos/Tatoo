/** Ícones em linha (traço de 1.4px), desenhados à mão para o site. Sem biblioteca externa. */
const caminhos = {
  seta: 'M5 19 19 5M8 5h11v11',
  baixo: 'M12 4v16M5 13l7 7 7-7',
  cima: 'M12 20V4M5 11l7-7 7 7',
  fechar: 'M5 5l14 14M19 5 5 19',
  esquerda: 'M20 12H4M11 5l-7 7 7 7',
  direita: 'M4 12h16M13 5l7 7-7 7',
  mais: 'M12 5v14M5 12h14',
  whatsapp: 'M4 20l1.3-4.2A8 8 0 1 1 8.4 19L4 20Z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1c-1-.4-2-1.4-2.4-2.4l1-1-1-2L9.6 7.5Z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z M17.3 6.6h.01',
  telefone: 'M6.6 3.5 9 3l2 4.5-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4.5 2-.5 2.4a2 2 0 0 1-2.2 1.6A16 16 0 0 1 3 5.7a2 2 0 0 1 1.6-2.2Z',
  pino: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z M12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z',
  relogio: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z M12 7v5l3 2',
  // etapas do processo
  conversa: 'M4 5h16v11H9l-5 4V5Z M8 9.5h8M8 12.5h5',
  ideia: 'M9 18h6M10 21h4M12 3a6 6 0 0 1 3.5 10.9V16h-7v-2.1A6 6 0 0 1 12 3Z',
  lapis: 'M4 20l1-4L16 5l3 3L8 19l-4 1Z M14 7l3 3',
  etiqueta: 'M3 12V4h8l10 10-8 8L3 12Z M7.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z',
  calendario: 'M4 6h16v14H4V6Z M4 10h16M8 3v5M16 3v5M8 14h3',
  agulha: 'M3 21l6-6M9 15l2 2 9-9-2-2-9 9Z M14 6l4 4M17 3l4 4',
  cuidado: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
} as const;

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, tamanho = 20, className }: { nome: NomeIcone; tamanho?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={caminhos[nome]} />
    </svg>
  );
}
