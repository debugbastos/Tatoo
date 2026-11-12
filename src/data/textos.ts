/**
 * Textos do site. As citações entre aspas são do próprio Thalles, tiradas de legendas
 * dos posts do @thallestattoofc. Itens com `demo: true` são orientações gerais de exemplo,
 * que o Thalles precisa revisar antes da publicação.
 */

export const frases = {
  hero: 'O processo te fere, mas o propósito cura.',
  ideia: 'Cada tatuagem começa com uma ideia… e termina como uma obra única.',
  estrada: 'Nem só de tatuagem vive o tatuador.',
};

/** Manifesto: trecho de duas legendas do Thalles. `{img:n}` marca a foto inline. */
export const manifesto =
  'A arte começa muito antes da agulha tocar a pele. {img:0} Ela nasce nas experiências, nas pessoas {img:1} e em tudo aquilo que a gente vive pelo caminho. Não é só sobre tatuar. {img:2} É sobre as histórias, as pessoas e tudo que acontece enquanto a tattoo ganha vida.';

export const sobre = {
  depoimento:
    'Tem dias que eu paro e penso no quanto é doido viver disso. Sentar aqui, colocar a música pra tocar, trocar ideia com alguém e, algumas horas depois, entregar uma arte que vai acompanhar essa pessoa por muitos anos.',
  especialidades: ['Projetos autorais', 'Realismo', 'Fine line', 'Blackwork', 'Geométrico e pontilhismo', 'Fechamentos de braço e costas', 'Cobertura de cicatriz'],
  diferenciais: [
    ['Projeto exclusivo', 'Cada desenho é criado do zero, a partir da ideia de quem vai usar.'],
    ['Pensado para a anatomia', 'A composição acompanha o corpo — braço, costas, canela, coluna.'],
    ['Peças grandes', 'Fechamentos de braço e de costas, feitos em mais de uma sessão.'],
    ['Cicatriz vira arte', 'Coberturas de cicatriz com projetos pensados para a pele.'],
  ] as const,
};

export const processo = [
  { titulo: 'Primeiro contato', texto: 'Você chama no WhatsApp ou no direct do Instagram e conta o que tem em mente.' },
  { titulo: 'A ideia', texto: 'Referências, significado, lugar do corpo e tamanho. Quanto mais história, melhor o projeto.' },
  { titulo: 'O desenho', texto: 'O projeto é criado do zero, pensando na composição e em como ele acompanha a anatomia.' },
  { titulo: 'Orçamento', texto: 'O valor é por projeto: depende do tamanho, do estilo e do número de sessões.' },
  { titulo: 'Agendamento', texto: 'Data e horário marcados com antecedência. A sessão é feita com hora marcada.' },
  { titulo: 'Sessão', texto: 'O desenho vai para a pele em decalque, ainda dá para ajustar a posição, e a agulha começa.' },
  { titulo: 'Cuidados', texto: 'Você sai com as orientações de cicatrização — e com uma arte para a vida toda.' },
] as const;

export const regua = {
  demo: true,
  marcos: [
    { dia: 0, titulo: 'Saída do estúdio', texto: 'Pele protegida com filme. Você recebe as orientações de cuidado.' },
    { dia: 3, titulo: 'Primeiros dias', texto: 'Higiene com sabonete neutro, secar sem esfregar, hidratar com o produto indicado.' },
    { dia: 15, titulo: 'Descamação', texto: 'Coceira e pele soltando são comuns. Não coçar e não arrancar casquinhas.' },
    { dia: 30, titulo: 'Camada de cima fechada', texto: 'Cores e traços assentam. Protetor solar sempre que for se expor ao sol.' },
  ],
};

export const faq = [
  { p: 'Dói fazer tatuagem?', r: 'Depende da região do corpo e da sensibilidade de cada pessoa. Áreas com osso perto da pele, como costela e canela, costumam incomodar mais. Durante a sessão dá para fazer pausas.', demo: true },
  { p: 'Quanto tempo demora a cicatrização?', r: 'A camada de cima da pele costuma fechar em algumas semanas, mas a cicatrização completa leva mais tempo. O Thalles passa o passo a passo na sessão.', demo: true },
  { p: 'Posso tomar sol, ir à praia ou piscina?', r: 'Durante a cicatrização, o recomendado é evitar sol direto, mar e piscina. Depois, use protetor solar para a tatuagem durar.', demo: true },
  { p: 'Como cuidar da tatuagem?', r: 'Lavar com sabonete neutro, secar com cuidado, hidratar com o produto indicado e não coçar. Siga as orientações que você recebe no estúdio.', demo: true },
  { p: 'Posso levar acompanhante?', r: 'Confirme pelo WhatsApp na hora de agendar: depende do espaço e do tamanho da sessão.', demo: true },
  { p: 'Como funciona o orçamento?', r: 'Pelo WhatsApp (75) 98848-7070. Você manda a ideia, o lugar do corpo, o tamanho e referências, e recebe o valor do projeto.' },
  { p: 'Dá para mudar o desenho?', r: 'Sim. O projeto é criado com você, e o decalque permite ajustar a posição na pele antes de começar.' },
];
