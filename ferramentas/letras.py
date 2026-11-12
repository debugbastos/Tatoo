"""Contorno das letras do nome gigante (intro, sessão e rodapé) -> src/data/letras.json.

O Safari não desenha stroke-dasharray em <text> de SVG, então o nome é feito de <path>.
Adaptado do letras.py do pacote Traço. Use a MESMA fonte dos títulos do site
(hoje a Big Shoulders Bold, licença OFL), para o nome e os títulos conversarem.

Uso (da raiz do projeto):
  python3 ferramentas/letras.py "THALLES" caminho/BigShoulders-Bold.ttf [tracking]
tracking: espaço extra entre letras, em fração do em (ex.: 0.01). Padrão: 0.
Precisa de: pip install fonttools
"""
import json, sys
from pathlib import Path
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

TEXTO = sys.argv[1] if len(sys.argv) > 1 else "THALLES"
FONTE = sys.argv[2] if len(sys.argv) > 2 else "BigShoulders-Bold.ttf"
TRACKING = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
SAIDA = Path(__file__).resolve().parents[1] / "src/data/letras.json"

fonte = TTFont(FONTE)
cmap = fonte.getBestCmap()
glifos = fonte.getGlyphSet()
letras = {}
for ch in dict.fromkeys(TEXTO):
    nome = cmap[ord(ch)]
    pen = SVGPathPen(glifos)
    glifos[nome].draw(pen)
    letras[ch] = {"d": pen.getCommands(), "avanco": glifos[nome].width}
os2 = fonte["OS/2"]
dados = {"texto": TEXTO, "upm": fonte["head"].unitsPerEm, "altura": os2.sCapHeight, "tracking": TRACKING, "letras": letras}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")))
print(SAIDA, "ok:", ", ".join(f"{k} {v['avanco']}" for k, v in letras.items()), "| capHeight", os2.sCapHeight)
