"""Acha onde o beija-flor cabe no antebraço: maior escala com folga até a borda da pele.

Rodar da raiz do projeto depois do vetoriza.py: python3 arquivos/fonte/encaixe.py
O resultado (escala, giro, centro) vai em BEIJA_FLOR, em src/motion/sessao.js.
"""
import json, math
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
a = np.array(Image.open('public/img/braco.webp'))[:, :, 3] > 128
for y in range(250, 1024, 50):
    xs = np.where(a[y])[0]
    print(y, xs.min(), xs.max(), 'centro', (xs.min()+xs.max())//2, 'larg', xs.max()-xs.min())
d = json.load(open('src/data/beija-flor.json'))
mn = np.array(d['caixa'][:2]); wh = np.array(d['caixa'][2:])
pts = np.vstack([np.array(t['d']).reshape(-1, 2) for t in d['tracos']])
print('caixa', d['caixa'])
dentro = ndi.distance_transform_edt(a)
best = None
for rot in range(-36, 16, 3):
    th = math.radians(rot)
    R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    c = wh / 2
    q0 = (pts - c) @ R.T
    for s in np.arange(0.30, 0.62, 0.01):
        for cy in range(560, 700, 10):
            row = np.where(a[cy])[0]
            for cx in range(row.min(), row.max(), 8):
                q = q0 * s + np.array([cx, cy])
                qi = np.round(q).astype(int)
                if (qi < 0).any() or (qi[:, 0] >= 1536).any() or (qi[:, 1] >= 1024).any():
                    continue
                m = dentro[qi[:, 1], qi[:, 0]].min()
                if m >= 16:
                    if best is None or s > best[0] + 1e-9 or (abs(s - best[0]) < 1e-9 and m > best[4]):
                        best = (s, rot, cx, cy, m)
print('melhor (escala, rot, cx, cy, folga)', best)
