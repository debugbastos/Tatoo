"""Contorno das letras do TRAÇO para a intro (src/data/letras.json).

O Safari não desenha stroke-dasharray nem recorte em <text> de SVG, então a intro
usa as letras como <path>. Este script instancia a Mona Sans variável na mesma
largura e peso do nome do hero (wdth 125, wght 640), junta os contornos
sobrepostos (barras do T, do R e do A) e grava o desenho de cada letra em
unidades da fonte, com o eixo y para cima.

Precisa de: pip install fonttools brotli skia-pathops
Uso (da raiz do projeto): python3 arquivos/fonte/letras.py
"""
import json
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
from fontTools.varLib import instancer

RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / "node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2"
SAIDA = RAIZ / "src/data/letras.json"
TEXTO = "TRAÇO"  # o nome gigante do hero, igual ao <text class="cena__cheio">

fonte = TTFont(FONTE)
fonte = instancer.instantiateVariableFont(fonte, {"wdth": 125, "wght": 640})
removeOverlaps(fonte)
cmap = fonte.getBestCmap()
glifos = fonte.getGlyphSet()

letras = {}
for ch in TEXTO:
    nome = cmap[ord(ch)]
    pen = SVGPathPen(glifos)
    glifos[nome].draw(pen)
    letras[ch] = pen.getCommands()

dados = {"upm": fonte["head"].unitsPerEm, "letras": letras}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")))
print(SAIDA, sum(len(d) for d in letras.values()), "caracteres de desenho")
