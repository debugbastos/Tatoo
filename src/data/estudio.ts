/**
 * Dados do estúdio e do tatuador — fonte única de verdade do site.
 *
 * REAL: tirado do Instagram @thallestattoofc (bio, legendas e fotos) e do endereço informado.
 * DEMONSTRATIVO: tudo marcado com `demo: true`. Aparece no site com o selo "Demonstrativo"
 * e precisa ser confirmado pelo Thalles antes de publicar (ver README).
 */

export const artista = {
  nome: 'Thalles Silva',
  artistico: 'Thalles',
  funcao: 'Tatuador',
  /** Bio do Instagram, palavra por palavra. */
  bio: ['Tattoos autorais • Realismo • Fine Line', 'Tattoo • Moto • Lifestyle'],
  estilos: ['Autoral', 'Realismo', 'Fine line'],
  instagram: 'thallestattoofc',
  instagramUrl: 'https://www.instagram.com/thallestattoofc/',
} as const;

export const estudio = {
  nome: 'Arcan Studio Tattoo',
  endereco: {
    rua: 'Av. Beira Rio',
    bairro: 'Jardim Bahia',
    cidade: 'Paulo Afonso',
    uf: 'BA',
    cep: '48602-000',
  },
  fuso: 'America/Bahia',
} as const;

export const enderecoLinha = `${estudio.endereco.rua} — ${estudio.endereco.bairro}, ${estudio.endereco.cidade} — ${estudio.endereco.uf}, ${estudio.endereco.cep}`;
const consultaMapa = `${estudio.endereco.rua}, ${estudio.endereco.bairro}, ${estudio.endereco.cidade} - ${estudio.endereco.uf}, ${estudio.endereco.cep}`;
export const mapa = {
  abrir: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultaMapa)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(consultaMapa)}&output=embed`,
};

export const contato = {
  /** Número da bio do Instagram (wa.me/5575988487070). */
  whatsapp: '5575988487070',
  whatsappExibicao: '(75) 98848-7070',
  telefoneHref: 'tel:+5575988487070',
  /** Não informado. Se existir, preencha aqui e o site mostra automaticamente. */
  email: '' as string,
};

export function linkWhatsApp(mensagem = 'Oi, Thalles! Vim pelo site e quero fazer um orçamento.') {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/* ------------------------------------------------------------------ */
/* DEMONSTRATIVO — confirmar com o Thalles                             */
/* ------------------------------------------------------------------ */

export const horario = {
  demo: true,
  linhas: [
    ['Terça a sexta', '9h às 19h'],
    ['Sábado', '9h às 14h'],
    ['Domingo e segunda', 'Fechado'],
  ] as const,
  observacao: 'Atendimento com hora marcada.',
};

export const regras = {
  demo: true,
  itens: [
    ['Sinal', 'Reserva a data e é abatido no valor final'],
    ['Orçamento', 'Por projeto, pelo WhatsApp'],
    ['Retoque', 'Avaliado depois da cicatrização'],
    ['Idade', 'Somente maiores de 18 anos, com documento'],
  ] as const,
};

/** Agenda mensal: a contagem regressiva aponta sempre para o próximo dia de abertura. */
export const agenda = {
  demo: true,
  diaAbertura: 1,
  hora: 9,
};
