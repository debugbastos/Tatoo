"""Recorta a mão de luva da folha e faz o pulso sumir em degradê.

A luva sai pela borda direita da folha (recorte reto). No site a mão anda
junto com a ponta da agulha, então essa borda não pode aparecer nunca: o
pulso, o fim da máquina e o cabo se dissolvem numa máscara macia que segue o
eixo do antebraço e arredonda nas laterais (afina como braço, não corta como
faixa). Nenhum pixel encostado nas bordas da imagem fica com alfa.
Saída: public/img/mao.webp + a posição da ponta da agulha (impressa).
"""
import math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

im = np.array(Image.open('arquivos/fonte/folha-desenho.png')).astype(np.float32)
a = im[:, :, 3]
lab, n = ndi.label(a > 8)
tam = ndi.sum(a > 8, lab, range(1, n + 1))
mao = lab == 1 + int(np.argmax(tam))
mao = ndi.binary_dilation(mao, iterations=2)
im[~mao] = 0
ys, xs = np.where(a * mao > 128)
k = np.argmin(xs)
ponta = (int(xs[k]), int(ys[k]))

# máscara do pulso, em coordenadas da folha:
# eixo do antebraço saindo das costas da mão para a direita e um pouco para baixo
CENTRO = (1200.0, 560.0)
GIRO = math.radians(20)
INICIO, FIM = 110.0, 300.0  # o degradê começa e termina ao longo do eixo
CURVA = 0.0006  # arredonda: as laterais somem antes do meio
yy, xx = np.mgrid[0:im.shape[0], 0:im.shape[1]].astype(np.float32)
dx, dy = xx - CENTRO[0], yy - CENTRO[1]
ao_longo = dx * math.cos(GIRO) + dy * math.sin(GIRO)
lado = -dx * math.sin(GIRO) + dy * math.cos(GIRO)
d = ao_longo + CURVA * lado * lado
t = np.clip((d - INICIO) / (FIM - INICIO), 0, 1)
fica = 1 - t * t * (3 - 2 * t)
im[:, :, 3] *= fica

X0, Y0, Y1 = ponta[0] - 6, 150, 1024
rec = im[Y0:Y1, X0:1536]
bordas = max(rec[0, :, 3].max(), rec[-1, :, 3].max(), rec[:, 0, 3].max(), rec[:, -1, 3].max())
print('alfa máximo nas bordas do recorte:', round(float(bordas), 2))
Image.fromarray(np.clip(rec, 0, 255).astype(np.uint8)).save('public/img/mao.webp', quality=88, method=6)
print('ponta na folha', ponta, '-> no recorte', (ponta[0] - X0, ponta[1] - Y0), 'tamanho', rec.shape[1], rec.shape[0])
