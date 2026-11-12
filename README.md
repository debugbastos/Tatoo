# Thalles Silva — site do tatuador

Site de uma página do tatuador **Thalles Silva** (Arcan Studio Tattoo, Paulo Afonso, BA), reconstruído em **React + Vite + TypeScript** sobre a base oficial **Code Makers + Traço**.

A peça central é uma sessão de tatuagem feita em código: conforme a pessoa rola a página, um beija-flor é tatuado traço por traço sobre um antebraço, com a mão de luva seguindo a ponta da agulha. Se a pessoa rolar para cima, o desenho volta.

---

## Comandos

```bash
npm install      # instala as dependências (Node 20.19 ou mais novo)
npm run dev      # servidor local com recarga automática (http://localhost:5173)
npm run build    # confere os tipos (tsc) e gera a pasta dist/
npm run preview  # serve a pasta dist/ para conferir o build
```

A pasta `dist/` funciona em qualquer hospedagem estática (Vercel, Netlify, Hostinger, GitHub Pages ou uma subpasta), porque o `vite.config.ts` usa `base: './'`.

---

## Estrutura

```
index.html                 SEO: título, descrição, Open Graph, JSON-LD (TattooParlor)
public/                    favicon.svg, og.jpg (1200×630), robots.txt, sitemap.xml
ferramentas/               scripts para trocar o desenho, a mão e as letras (ver abaixo)
src/
  main.tsx, App.tsx        entrada; App monta as seções na ordem da página
  data/                    TODO O CONTEÚDO do site (troque aqui, não nos componentes)
    estudio.ts             artista, estúdio, contatos, mapa, horário, regras, agenda
    textos.ts              frases, manifesto, sobre, processo, régua de cicatrização, FAQ
    trabalhos.ts           as 16 fotos da galeria (título, estilo, legenda, texto alternativo)
    beija-flor.json        os 407 traços do desenho (vem do pacote Traço)
    letras.json            o contorno das letras de "THALLES"
  motion/                  motor de animação próprio (sem biblioteca)
    engine.ts              um único requestAnimationFrame, progresso de rolagem, suavização
    intro.ts               intro de ~3,5 s (contorno → preenchimento → foto → menu → textos)
    desenho.ts             encaixe do desenho no braço, ponta da agulha, linha do tempo
    reveal.ts              revelação ao entrar na tela (um IntersectionObserver para tudo)
  sections/                uma pasta de responsabilidade por seção (.tsx + .css)
    Hero, Sessao, Manifesto, Trabalhos, Sobre, Estudio, Processo,
    Agenda, Cuidados, Localizacao, Contato, Rodape
  components/              Nav, Lightbox (carregado só quando abre), NomeSvg, Icone, Demo
  hooks/                   useMedia (mobile e movimento reduzido), useSecaoAtiva (menu)
  utils/                   tempo.ts (fuso America/Bahia), nome.ts, css.ts
  styles/                  tokens.css (cores, fontes, escala de tamanhos, espaços), base.css (estilos de texto, seções, botões)
  assets/img/              fotos em WebP (hero, braço, mão, estúdio, trabalhos...)
  assets/fontes/           as 4 famílias em WOFF2, só com os caracteres do português (131 KB)
```

---

## O que é real e o que é demonstrativo

O PRD pede para não inventar informação comercial nem pessoal. Por isso o conteúdo foi dividido assim:

**Real** (do Instagram @thallestattoofc e do que foi passado na conversa):
nome, estúdio, endereço (Av. Beira Rio, Jardim Bahia, Paulo Afonso, BA, 48602-000), WhatsApp (75) 98848-7070, Instagram, as fotos (hero, retrato, estúdio, bancada, estrada e os 16 trabalhos), as frases e legendas tiradas dos posts dele, a bio e os estilos.

**Demonstrativo**: tudo que tem `demo: true` em `src/data/`. No site, esses blocos aparecem com o selo **"Demonstrativo"**:

| O quê | Onde trocar |
|---|---|
| Horário de atendimento | `estudio.ts` → `horario` |
| Regras (sinal, orçamento, retoque, idade) | `estudio.ts` → `regras` |
| Abertura da próxima agenda (contagem regressiva) | `estudio.ts` → `agenda` (`diaAbertura`, `hora`) |
| Régua de cicatrização (dia 0, 3, 15, 30) | `textos.ts` → `regua` |
| Respostas gerais do FAQ | `textos.ts` → `faq` (itens com `demo: true`) |
| Parte dos itens de higiene | `sections/Estudio.tsx` → `HIGIENE_DEMO` (a lista `HIGIENE_REAL` é o que aparece nas fotos) |
| Ficha da peça no HUD da sessão (9 cm, 1:40) | `sections/Sessao.tsx` → `SESSAO_MIN` e os textos das legendas |

Quando o Thalles confirmar uma informação, basta trocar o texto e apagar o `demo: true`: o selo some sozinho.

**E-mail:** fica vazio em `estudio.ts` → `contato.email`. Enquanto estiver vazio, a linha de e-mail não aparece em Contato.

---

## Antes de publicar

1. **Domínio:** troque `SEU-DOMINIO.com.br` em `public/robots.txt` e `public/sitemap.xml`. Se quiser, acrescente `<link rel="canonical">` e `og:url` no `index.html` com o endereço final.
2. **Imagem de compartilhamento:** `public/og.jpg` (1200×630) é um recorte da foto do hero. Troque se preferir outra.
3. **Dados demonstrativos:** revise a tabela acima com o Thalles.

---

## Formulário da lista de espera

O formulário da Agenda **não salva nada**: não existe servidor. Ele valida os campos (nome, WhatsApp ou @ do Instagram, local do corpo e ideia), monta a mensagem e abre o WhatsApp do Thalles com tudo preenchido. Se o navegador bloquear a nova aba, aparece um link para abrir manualmente. O próprio site avisa que "nada fica salvo aqui".

Para guardar os pedidos de verdade, é preciso um serviço (Formspree, Supabase, uma planilha via Apps Script etc.) e trocar o `enviar` em `sections/Agenda.tsx`.

---

## Trocar o desenho, a mão ou o nome

Os scripts de `ferramentas/traco-fonte/` e as receitas de `ferramentas/traco-receitas/` vieram do pacote Traço. Os textos deles citam os caminhos do projeto original. Neste projeto, os equivalentes são:

| No pacote Traço | Neste projeto |
|---|---|
| `arquivos/fonte/*.py` | `ferramentas/traco-fonte/*.py` |
| `public/img/braco.webp`, `mao.webp`, `trabalhos/` | `src/assets/img/` |
| `BEIJA_FLOR` em `src/motion/sessao.js` | `ENCAIXE` em `src/motion/desenho.ts` |
| `AGULHA` (ponta da agulha) | `MAO.pontaX` / `MAO.pontaY` em `src/motion/desenho.ts` |
| `REPOUSO`, `ANCORAS` | `REPOUSO`, `ANCORAS` em `src/motion/desenho.ts` |
| `SESSAO_MIN`, legendas, lista de fases | `src/sections/Sessao.tsx` (as fases vêm dos grupos do JSON) |
| `letras.py` (Mona Sans, "TRAÇO") | `ferramentas/letras.py` (Big Shoulders, "THALLES") |

Resumo do caminho:

1. **Outro desenho:** prepare a arte em traço preto fino, rode `vetoriza.py` (gera `beija-flor.json`), depois `encaixe.py` e copie escala, giro e centro para `ENCAIXE`. Se os grupos mudarem de nome, ajuste `GRUPOS` em `desenho.ts`.
2. **Outra mão:** rode `mao.py` e copie a posição da ponta da agulha para `MAO`.
3. **Outro nome:** `python3 ferramentas/letras.py "NOVO NOME" caminho/BigShoulders-Bold.ttf 0.012` (precisa de `pip install fonttools`). O nome gigante da intro, da sessão e do rodapé usa esse arquivo. Se trocar a fonte dos títulos, rode com a fonte nova para o nome continuar igual aos títulos.

---

## Tipografia

Quatro famílias, cada uma com um papel:

| Família | Onde aparece |
|---|---|
| **Big Shoulders** (condensada, de cartaz) | Nome gigante, títulos de seção, números da contagem |
| **Instrument Serif** (itálico) | Frase do hero, manifesto, depoimento, frases da sessão |
| **Instrument Sans** | Texto corrido, títulos de cartão, perguntas, formulário |
| **Geist Mono** | Etiquetas, menu, botões, painel da sessão |

Os tamanhos ficam em `src/styles/tokens.css`, numa escala única que cresce com a tela (`--t-label`, `--t-small`, `--t-body`, `--t-lead`, `--t-h3`, `--t-quote`, `--t-h2`). As classes `.titulo`, `.citacao`, `.h3`, `.lead`, `.corpo` e `.mono` (em `base.css`) aplicam esses estilos. Para mudar o tamanho de todos os títulos de uma vez, basta mudar `--t-h2`.

## Responsividade

O site foi organizado em grade de 12 colunas, com três composições:

- **Celular (até 639 px):** uma coluna; galeria em 2 colunas.
- **Tablet (640 a 1023 px, ou tela em pé):** hero com frase e foto lado a lado; Sobre em duas colunas; galeria em 3 colunas.
- **Desktop (a partir de 1024 px):** layout completo; galeria em 4 colunas com dois destaques.

Todas as seções usam o mesmo espaçamento vertical (`--sec-y`) e a mesma margem lateral (`--m`). Em telas muito largas, o conteúdo para em 1680 px e fica centralizado.

---

## Decisões técnicas

- **Motor de animação próprio em vez de GSAP/ScrollTrigger e Lenis.** O PRD sugere essas bibliotecas. Este projeto foi montado num ambiente sem acesso à internet para instalar pacotes, então a rolagem animada foi escrita em TypeScript (`src/motion/engine.ts`, com cerca de 120 linhas). Ela faz o que o site precisa: fixar a seção da sessão (`pinProgress`), medir quanto de um bloco já passou (`viewProgress`), suavizar o movimento (`scrub`) e voltar quando a pessoa rola para cima. Tudo roda num único `requestAnimationFrame`. A rolagem continua sendo a nativa do navegador (sem Lenis), o que mantém o comportamento esperado de teclado, leitores de tela e trackpad. Se quiser trocar por GSAP depois, as animações já estão separadas por seção.
- **Fontes no próprio projeto:** nada vem do Google Fonts. Os arquivos ficam em `src/assets/fontes/`, recortados só com os caracteres usados em português (131 KB no total), o que deixa o site mais rápido e sem depender de servidor externo. As licenças (OFL, uso comercial livre) estão em `ferramentas/fontes-licencas/`.
- **React Strict Mode:** todos os efeitos limpam o que criam (listeners, observers, timers). A intro, em especial, só cancela na limpeza e recomeça na segunda montagem.
- **Carregamento:** o Lightbox é carregado só quando a pessoa abre uma foto (`React.lazy`). As fotos usam `loading="lazy"`, menos a do hero, que tem prioridade alta porque é a maior imagem da primeira tela. O mapa do Google só carrega quando a pessoa clica.
- **Movimento reduzido:** com `prefers-reduced-motion`, não tem intro, a sessão aparece pronta (desenho completo, sem a mão), o manifesto já vem aceso e as revelações viram aparições simples.

---

## Testes feitos

- **Tipos:** `tsc --noEmit` sem erros (modo `strict`).
- **Tamanho:** JavaScript principal com cerca de 92 KB comprimido (gzip), Lightbox em arquivo separado, fotos somando cerca de 1,3 MB, carregadas sob demanda, e fontes com 131 KB.
- **Telas:** 390×844 e 1456×840 (as do PRD), além de 320×640, 360×740, 820×1180, 1024×768, 844×390 deitado, 1280×720, 1920×1080 e 2560×1440. Nenhuma rolagem horizontal, nenhum elemento saindo da tela e nenhum erro no console.
- **Interações:** links internos e externos, menu ativo por seção, filtros da galeria, lightbox (setas, Esc, foco, toque), formulário (erros, foco no primeiro erro, link do WhatsApp), acordeão do FAQ, mapa ao clicar, rodapé, voltar ao topo, link para pular ao conteúdo e menu do celular (foco, Esc).
- **Movimento reduzido:** conferido.

Como o ambiente não tinha internet, o build de teste foi feito com esbuild, espelhando a configuração do Vite. Rode `npm install && npm run build` uma vez na sua máquina para confirmar.

---

## Revisão crítica (o que ainda pode melhorar)

- Confirmar com o Thalles todos os itens demonstrativos.
- Fotos de tatuagens **cicatrizadas**: só uma está marcada assim. Mais fotos cicatrizadas dão mais confiança ao cliente.
- Não existe seção "Antes e depois", porque não há esse material nos posts.
- O mapa incorporado precisa de internet. Ele não pôde ser testado aqui, mas o botão "Abrir no Google Maps" funciona sempre.
- Se o site ganhar outros tatuadores, a seção "Tatuadoras" do pacote Traço pode voltar a partir de `Sobre.tsx`.
