/**
 * Trabalhos reais do Thalles, tirados do Instagram @thallestattoofc.
 * `legenda` é um trecho da legenda original do post. `foco` é o object-position da foto.
 */
import i19 from '../assets/img/trabalhos/0019.webp';
import i48 from '../assets/img/trabalhos/0048.webp';
import i62 from '../assets/img/trabalhos/0062.webp';
import i10 from '../assets/img/trabalhos/0010.webp';
import i28 from '../assets/img/trabalhos/0028.webp';
import i54 from '../assets/img/trabalhos/0054.webp';
import i34 from '../assets/img/trabalhos/0034.webp';
import i27 from '../assets/img/trabalhos/0027.webp';
import i66 from '../assets/img/trabalhos/0066.webp';
import i56 from '../assets/img/trabalhos/0056.webp';
import i37 from '../assets/img/trabalhos/0037.webp';
import i38 from '../assets/img/trabalhos/0038.webp';
import i24 from '../assets/img/trabalhos/0024.webp';
import i15 from '../assets/img/trabalhos/0015.webp';
import i68 from '../assets/img/trabalhos/0068.webp';
import i35 from '../assets/img/trabalhos/0035.webp';

export const ESTILOS = ['Fine line', 'Realismo', 'Blackwork', 'Geométrico', 'Aquarela'] as const;
export type Estilo = (typeof ESTILOS)[number];

export interface Trabalho {
  id: string;
  src: string;
  w: number;
  h: number;
  titulo: string;
  estilo: Estilo;
  local: string;
  legenda: string;
  foco: string;
  alt: string;
  nota?: string;
}

export const trabalhos: Trabalho[] = [
  { id: 'dragao', src: i19, w: 825, h: 1100, titulo: 'Dragão e floral', estilo: 'Realismo', local: 'Costas', foco: '55% 45%',
    legenda: 'Força e delicadeza dividindo o mesmo espaço.', alt: 'Dragão com lírios em preto e cinza descendo pelas costas de uma cliente' },
  { id: 'oliveira', src: i48, w: 825, h: 1100, titulo: 'Ramo de oliveira', estilo: 'Fine line', local: 'Clavícula', foco: '55% 62%',
    legenda: 'Até os recomeços podem florescer.', alt: 'Ramo de oliveira em traço fino contornando a clavícula' },
  { id: 'samurai', src: i62, w: 619, h: 1100, titulo: 'Samurai', estilo: 'Blackwork', local: 'Fechamento de costas', foco: '50% 45%',
    legenda: 'Mais do que preencher espaço, é criar uma história na pele.', alt: 'Fechamento de costas com um samurai e ornamentos orientais em preto' },
  { id: 'lirio', src: i10, w: 825, h: 1100, titulo: 'Lírio vermelho', estilo: 'Fine line', local: 'Costas', foco: '45% 62%',
    legenda: 'Nem toda flor representa delicadeza.', alt: 'Lírio em traço fino vermelho nas costas' },
  { id: 'indigena', src: i28, w: 825, h: 1100, titulo: 'Indígena', estilo: 'Blackwork', local: 'Ombro', foco: '68% 55%',
    legenda: 'Uma tatuagem não precisa falar alto para ser lembrada.', alt: 'Mulher indígena com cocar em traço preto no ombro' },
  { id: 'mandala-canela', src: i54, w: 720, h: 960, titulo: 'Mandala geométrica', estilo: 'Geométrico', local: 'Canela', foco: '50% 58%',
    legenda: 'Geometria, precisão e equilíbrio.', alt: 'Mandala geométrica em pontilhismo na canela' },
  { id: 'pontilhismo', src: i34, w: 720, h: 960, titulo: 'Pontilhismo', estilo: 'Geométrico', local: 'Joelho e canela', foco: '55% 45%',
    legenda: 'Uma arte única, dedicada e cheia de personalidade.', alt: 'Mandala e faixas em pontilhismo cobrindo joelho e canela' },
  { id: 'leao', src: i27, w: 599, h: 1100, titulo: 'Leão coroado', estilo: 'Realismo', local: 'Antebraço', foco: '55% 45%',
    legenda: 'O leão não precisa rugir o tempo todo para impor respeito.', alt: 'Leão com coroa em realismo preto e cinza no antebraço' },
  { id: 'coluna', src: i66, w: 825, h: 1100, titulo: 'Floral e frase', estilo: 'Fine line', local: 'Coluna', foco: '42% 55%',
    legenda: 'Uma frase que ganha ainda mais significado quando se transforma em arte.', alt: 'Flores e uma frase em traço fino descendo pela coluna' },
  { id: 'pulso', src: i56, w: 720, h: 960, titulo: 'Floral delicado', estilo: 'Fine line', local: 'Punho e mão', foco: '45% 50%',
    legenda: 'Uma tatuagem delicada não precisa chamar atenção pelo tamanho.', alt: 'Ramo de flores roxas em traço fino no punho' },
  { id: 'libelula', src: i37, w: 720, h: 960, titulo: 'Libélula', estilo: 'Aquarela', local: 'Antebraço', foco: '50% 45%',
    legenda: 'Delicadamente forte.', alt: 'Libélula em aquarela com a frase “Delicadamente forte” no antebraço' },
  { id: 'deuses', src: i38, w: 619, h: 1100, titulo: 'Deuses', estilo: 'Blackwork', local: 'Fechamento de braço', foco: '55% 40%',
    legenda: 'Os deuses não pedem permissão, eles impõem presença.', alt: 'Fechamento de braço em blackwork com figuras da mitologia' },
  { id: 'tribal', src: i24, w: 825, h: 1100, titulo: 'Tribal', estilo: 'Blackwork', local: 'Peito e ombro', foco: '50% 40%',
    legenda: 'Algumas tatuagens não precisam de explicação.', alt: 'Tribal polinésio em preto no peito e no ombro' },
  { id: 'sol', src: i15, w: 720, h: 960, titulo: 'Sol e ramos', estilo: 'Fine line', local: 'Antebraço', foco: '55% 50%',
    legenda: 'O sol não brilha para chamar atenção.', alt: 'Sol com ramos de folhas e lettering no antebraço' },
  { id: 'braco-fechado', src: i68, w: 619, h: 1100, titulo: 'Braço fechado', estilo: 'Geométrico', local: 'Braço inteiro', foco: '50% 45%',
    legenda: 'Um projeto completo, pensado para acompanhar toda a anatomia do braço.', alt: 'Braço inteiro fechado com mandalas e padrões geométricos', nota: 'Cicatrizado' },
  { id: 'nome', src: i35, w: 825, h: 1100, titulo: 'Nome e flor', estilo: 'Fine line', local: 'Ombro', foco: '45% 55%',
    legenda: 'Alguns nomes carregam histórias. Outros carregam amor.', alt: 'Nome em letra cursiva com uma flor, no ombro' },
];
