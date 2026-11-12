# Receitas: como as imagens da Traço foram feitas

O site da Traço não tem vídeo nem 3D. A peça principal é feita em código: o beija-flor é um desenho vetorizado (`src/data/beija-flor.json`) que se tatua, traço por traço, sobre uma foto de antebraço (`public/img/braco.webp`), com a foto de uma mão de luva (`public/img/mao.webp`) seguindo a ponta da linha. As três imagens de base e as seis fotos dos trabalhos foram geradas por IA, a partir destes prompts. Os prompts estão em inglês porque os geradores entendem melhor.

Nenhuma IA de código "redesenha" o beija-flor por prompt: a tinta só anda pelos traços que estão no JSON. Para outro desenho, é preciso uma arte nova em traço preto e rodar o script que a transforma em traços (passo 3).

## Do que você precisa

- **Um gerador de imagem que aceite foto de referência e fundo transparente**: ChatGPT (imagens), Gemini, Midjourney (com referência de imagem) ou outro. Cada imagem custa centavos ou entra na assinatura que você já tem.
- **Python 3** com `numpy`, `pillow`, `scipy`, `scikit-image` e `matplotlib` (para vetorizar o desenho) e `fonttools`, `brotli` e `skia-pathops` (para as letras da intro). A IA do seu editor instala com `pip`.
- Se você é tatuador(a): **a sua própria arte** em traço fino serve melhor que qualquer imagem gerada.

## Passo a passo

1. **Braço** (`braco.prompt.txt`). Só refaça se quiser outro tom de pele, outro corpo ou outra parte do corpo. Anexe uma foto de referência com a pose (pode ser o `braco.webp` da demo). Saída: PNG 1536×1024 com fundo transparente, o braço na diagonal, punho no alto e antebraço saindo pela base, à direita do centro. Se o gerador não fizer transparência, peça fundo preto puro e recorte com um removedor de fundo (remove.bg, Photoroom ou `rembg`), mantendo 1536×1024. Converta para `public/img/braco.webp`.
2. **Desenho e mão** (`folha-desenho.prompt.txt`). Uma folha 1536×1024 com fundo transparente: à esquerda o desenho em traço preto fino, à direita a mão de luva com a máquina. Para outro desenho, troque o parágrafo ELEMENT 1 (o que é, de que lado olha, que partes tem) e mantenha as regras de traço: só linha preta fina e constante, sem preenchimento, sem sombra, sem pontilhado. Se já tem a arte (escaneada ou vetorial), pule a geração: exporte em PNG com fundo transparente, linhas pretas de uns 3 px, e com no máximo uns 900 px de altura.
   - A mão da demo serve para qualquer desenho. Só gere uma mão nova se quiser outra luva ou outra máquina; aí rode `python3 arquivos/fonte/mao.py`, que recorta a mão da folha, faz o pulso sumir em degradê e grava `public/img/mao.webp`. Ele imprime a posição da ponta da agulha: ela vai em `AGULHA` (`src/motion/sessao.js`).
3. **Vetorizar o desenho** (`arquivos/fonte/vetoriza.py`). Salve a folha como `arquivos/fonte/folha-desenho.png` e rode, da raiz do projeto, `python3 arquivos/fonte/vetoriza.py debug.png`. O script tira o esqueleto das linhas, divide em traços e os ordena como uma tatuadora faria, e grava `src/data/beija-flor.json`. O `debug.png` mostra cada fase numa cor: abra e confira. Antes de rodar com uma arte nova, ajuste no script:
   - `TEM_MAO = False` se a folha só tem o desenho (com `True`, ele apaga a maior peça da folha, que na receita é a mão).
   - `X0, Y0, X1, Y1`: o retângulo do desenho na folha, em pixels.
   - `REG` e `ORDEM` (parte 6): as fases do desenho e os polígonos que as separam. O beija-flor tem cinco (cabeça, bico, asa, corpo, cauda). Um ramo pode ter "caule, folhas, flores"; uma onda, uma fase só.
   - A parte 2 transforma áreas cheias (a pupila) em espiral. Desenho sem área cheia não é afetado.
4. **Encaixar no braço** (`arquivos/fonte/encaixe.py`). Rode `python3 arquivos/fonte/encaixe.py`. Ele procura a maior escala, o giro e o centro em que o desenho cabe na pele com folga, e imprime os números que vão em `BEIJA_FLOR` (`src/motion/sessao.js`). Com braço novo, rode também; e confira `REPOUSO` (onde a mão espera antes do primeiro traço).
5. **Legendas e HUD.** Com outro desenho, mude em `src/motion/sessao.js` as `ANCORAS` (os pontos da folha para onde apontam as legendas "Beija-flor • 9 cm" e "Sessão") e `SESSAO_MIN` (a duração mostrada); em `src/sections/sessao.js`, os textos das legendas e a lista `.cena__fases` (um `<li>` por fase, na mesma ordem de `ORDEM`). A miniatura de Helô na seção Tatuadoras usa as linhas da fase 2 (`t.g === 2` em `src/sections/tatuadoras.js`): ajuste o índice ou troque o desenho dela.
6. **Fotos dos trabalhos** (`trabalhos.prompt.txt`). Uma folha com seis fotos em grade 3×2; troque a lista de 1 a 6 pelas peças que você quer mostrar. Corte as seis fotos (a IA do seu editor faz) e salve como `public/img/trabalhos/01-ramo.webp` … `06-orquidea.webp`, ou mude os nomes em `trabalhos` (`src/data/conteudo.js`). Se você tem fotos reais de tatuagens cicatrizadas, use as suas: é o que o cliente quer ver.

## O que adaptar quando o seu estúdio é diferente

- **Outro desenho**: passos 2 a 5. Prefira traço fino e contínuo, com 3 a 6 partes claras. Desenho com muito preenchimento ou pontilhado não vira traço de agulha.
- **Outra parte do corpo ou outra pele**: passo 1 e depois o passo 4.
- **Outro nome no lugar de "TRAÇO"**: o nome gigante não precisa de imagem. Troque o texto em `src/sections/sessao.js` (`.cena__cheio`), na nav (`src/sections/nav.js`) e no rodapé (`src/sections/rodape.js`), depois ponha o nome novo em `TEXTO` no `arquivos/fonte/letras.py` e rode `python3 arquivos/fonte/letras.py` (com o `npm install` já feito): ele grava `src/data/letras.json`, o desenho das letras que a intro contorna. Sem isso, a intro não acha as letras novas.

## Formatos que o site espera

- `braco.webp`: 1536×1024, fundo transparente (WebP com alfa).
- `mao.webp`: fundo transparente, nenhuma borda reta (o pulso some em degradê); hoje 705×874.
- Trabalhos: WebP, uns 470 px de largura na demo; use 900 px ou mais nas suas fotos. A grade corta cada uma em proporções diferentes (4:5, 3:4, 1:1, 5:4), então deixe a tatuagem no centro da foto com margem em volta.

## Sem imagem nova

Dá para ter o site do seu estúdio sem gerar nada: o braço, a mão e o beija-flor da demo não têm marca e servem para qualquer estúdio de traço fino. Troque nome, textos e as fotos dos trabalhos (que devem ser suas) e mantenha a peça como está.
