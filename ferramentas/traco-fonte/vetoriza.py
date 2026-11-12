"""Vetoriza o beija-flor da folha (arquivos/fonte/folha-desenho.png) em traços ordenados.

Esqueleto da linha -> grafo (pontas e cruzamentos) -> traços contínuos (junta
os trechos que seguem reto num cruzamento) -> ordem de tatuadora (região por
região, contorno antes da textura, sempre o traço mais perto da agulha).

Saída: src/data/beija-flor.json  (coordenadas da folha, 1x)
Rodar da raiz do projeto: python3 arquivos/fonte/vetoriza.py [debug.png]
"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage.morphology import skeletonize

ESC = 2  # trabalha em 2x para o esqueleto sair liso
LIMIAR = 0.24  # tinta mínima que conta como linha (pega a textura fina das penas)
TEM_MAO = True  # a folha da receita traz a mão de luva ao lado; com só o desenho, ponha False

# ---------- 1. tinta do beija-flor ----------
im = np.array(Image.open('arquivos/fonte/folha-desenho.png')).astype(np.float32)
alfa = im[:, :, 3]
lum = im[:, :, :3].mean(axis=2) / 255
tinta = (alfa / 255) * (1 - lum)
lab, n = ndi.label(alfa > 8)
tam = ndi.sum(alfa > 8, lab, range(1, n + 1))
if TEM_MAO:
    tinta[lab == 1 + int(np.argmax(tam))] = 0  # tira a mão (maior componente)
X0, Y0, X1, Y1 = 0, 30, 832, 992  # a área do desenho na folha (px); meça na sua folha
tinta = tinta[Y0:Y1, X0:X1]

big = np.array(Image.fromarray((tinta * 255).astype(np.uint8)).resize(
    (tinta.shape[1] * ESC, tinta.shape[0] * ESC), Image.BICUBIC)) / 255.0
binar = big > LIMIAR
binar = ndi.binary_opening(binar, structure=np.ones((2, 2))) | (big > 0.6)
dist = ndi.distance_transform_edt(binar)

# ---------- 2. pupila (área cheia) vira espiral à parte ----------
cheio = dist > 3.6 * ESC
lc, nc = ndi.label(ndi.binary_dilation(cheio, iterations=2))
pupilas = []
for i in range(1, nc + 1):
    ys, xs = np.where(lc == i)
    if len(ys) < 20 or math.sqrt(len(ys) / math.pi) < 4.5 * ESC:
        continue
    cy, cx = ys.mean(), xs.mean()
    r = math.sqrt(len(ys) / math.pi)
    pupilas.append((cx, cy, r))
pup_mask = np.zeros_like(binar)
yy, xx = np.mgrid[0:binar.shape[0], 0:binar.shape[1]]
for (cx, cy, r) in pupilas:
    pup_mask |= (xx - cx) ** 2 + (yy - cy) ** 2 < (r + 3 * ESC) ** 2
print('pupilas', [(round(c[0] / ESC + X0), round(c[1] / ESC + Y0), round(c[2] / ESC, 1)) for c in pupilas])

esq = skeletonize(binar & ~pup_mask)

# ---------- 3. grafo do esqueleto ----------
H, W = esq.shape
viz = ndi.convolve(esq.astype(np.uint8), np.ones((3, 3), np.uint8), mode='constant') - 1
grau = np.where(esq, viz, 0)
no_px = esq & (grau != 2)
cruz = esq & (grau >= 3)
lab_cruz, ncruz = ndi.label(cruz, structure=np.ones((3, 3)))
no_id = -np.ones((H, W), np.int64)
no_id[cruz] = lab_cruz[cruz] - 1
pontas = np.argwhere(esq & (grau == 1))
for k, (y, x) in enumerate(pontas):
    no_id[y, x] = ncruz + k
n_nos = ncruz + len(pontas)
OFF = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

def vizinhos(y, x):
    for dy, dx in OFF:
        yy_, xx_ = y + dy, x + dx
        if 0 <= yy_ < H and 0 <= xx_ < W and esq[yy_, xx_]:
            yield yy_, xx_

visto = np.zeros((H, W), bool)
arestas = []  # (no_a, no_b, [(y,x)...])
for y, x in np.argwhere(no_id >= 0):
    a = no_id[y, x]
    for q in vizinhos(y, x):
        if no_id[q] >= 0 or visto[q]:
            continue
        cam = [(y, x), q]
        visto[q] = True
        prev, cur = (y, x), q
        fim = None
        while True:
            prox = None
            for r in vizinhos(*cur):
                if r == prev or r in cam[-3:]:
                    continue
                if no_id[r] >= 0 and no_id[r] != a or (no_id[r] >= 0 and len(cam) > 3):
                    fim = r
                    break
                if not visto[r] and no_id[r] < 0:
                    prox = r
            if fim is not None:
                cam.append(fim)
                break
            if prox is None:
                break
            visto[prox] = True
            cam.append(prox)
            prev, cur = cur, prox
        b = no_id[fim] if fim is not None else -1
        arestas.append([a, b, cam])
# laços sem nó (anéis)
for y, x in np.argwhere(esq & ~visto & (no_id < 0)):
    if visto[y, x]:
        continue
    cam = [(y, x)]
    visto[y, x] = True
    prev, cur = None, (y, x)
    while True:
        prox = None
        for r in vizinhos(*cur):
            if r != prev and not visto[r] and no_id[r] < 0:
                prox = r
                break
        if prox is None:
            break
        visto[prox] = True
        cam.append(prox)
        prev, cur = cur, prox
    cam.append(cam[0])
    arestas.append([-1, -1, cam])

def comp(c):
    p = np.array(c, float)
    return float(np.sqrt((np.diff(p, axis=0) ** 2).sum(axis=1)).sum()) if len(p) > 1 else 0.0

# poda de espinhos: ponta curta presa num cruzamento
grau_no = np.zeros(n_nos + 1, int)
for a, b, c in arestas:
    if a >= 0: grau_no[a] += 1
    if b >= 0: grau_no[b] += 1
def eh_ponta(nid):
    return nid >= ncruz
arestas = [e for e in arestas if not (
    comp(e[2]) < 5 * ESC and (
        (eh_ponta(e[0]) and e[1] >= 0 and not eh_ponta(e[1])) or
        (eh_ponta(e[1]) and e[0] >= 0 and not eh_ponta(e[0]))))]
print('arestas', len(arestas))

# ---------- 4. junta trechos que seguem reto no cruzamento ----------
def direcao(c, do_inicio):
    p = np.array(c[:12] if do_inicio else c[::-1][:12], float)
    if len(p) < 3:
        return None
    v = p[-1] - p[0]
    nv = np.linalg.norm(v)
    return v / nv if nv else None

por_no = {}
for i, (a, b, c) in enumerate(arestas):
    if a >= 0: por_no.setdefault(a, []).append((i, 0))
    if b >= 0: por_no.setdefault(b, []).append((i, 1))
cont = {}  # (aresta, lado) -> (aresta, lado)
for nid, inc in por_no.items():
    pares = []
    for u in range(len(inc)):
        for v in range(u + 1, len(inc)):
            (i, li), (j, lj) = inc[u], inc[v]
            if i == j:
                continue
            di = direcao(arestas[i][2], li == 0)
            dj = direcao(arestas[j][2], lj == 0)
            if di is None or dj is None:
                continue
            ang = math.degrees(math.acos(max(-1, min(1, float(-(di @ dj))))))
            pares.append((ang, inc[u], inc[v]))
    pares.sort()
    usado = set()
    for ang, x, y in pares:
        if ang > 50 or x in usado or y in usado:
            continue
        usado |= {x, y}
        cont[x] = y
        cont[y] = x

feito = [False] * len(arestas)
tracos = []
def anda(i, lado_entrada):
    pts = []
    while True:
        feito[i] = True
        c = arestas[i][2]
        seq = c if lado_entrada == 0 else c[::-1]
        pts.extend(seq if not pts else seq[1:])
        saida = (i, 1 - lado_entrada)
        if saida not in cont:
            return pts
        j, lj = cont[saida]
        if feito[j]:
            return pts
        i, lado_entrada = j, lj
for i in range(len(arestas)):
    if feito[i]:
        continue
    # sobe até o começo da corrente
    lado, k = 0, i
    vistos = {i}
    while (k, lado) in cont:
        j, lj = cont[(k, lado)]
        if j in vistos:
            break
        vistos.add(j)
        k, lado = j, 1 - lj
    tracos.append(anda(k, lado))

# ---------- 5. alisa, simplifica, mede ----------
def rdp(p, eps):
    if len(p) < 3:
        return p
    a, b = p[0], p[-1]
    ab = b - a
    n_ = np.linalg.norm(ab)
    ap = p - a
    d = np.abs(ab[0] * ap[:, 1] - ab[1] * ap[:, 0]) / n_ if n_ else np.linalg.norm(ap, axis=1)
    k = int(np.argmax(d))
    if d[k] > eps:
        return np.vstack([rdp(p[:k + 1], eps)[:-1], rdp(p[k:], eps)])
    return np.vstack([a, b])

saida = []
for t in tracos:
    p = np.array([(x, y) for y, x in t], float)
    if len(p) < 3:
        continue
    larg = float(np.median([dist[y, x] for y, x in t])) * 2 / ESC
    fechado = np.linalg.norm(p[0] - p[-1]) < 1.5
    if len(p) > 6:
        q = ndi.gaussian_filter1d(p, 2.0, axis=0, mode='wrap' if fechado else 'nearest')
        if not fechado:
            q[0], q[-1] = p[0], p[-1]
        p = q
    p = p / ESC + np.array([X0, Y0])
    L = float(np.sqrt((np.diff(p, axis=0) ** 2).sum(axis=1)).sum())
    if L < 3:
        continue
    p = rdp(p, 0.28)
    saida.append({'p': p, 'w': larg, 'L': L})

# pupilas como espiral (empacotar o preto)
for (cx, cy, r) in pupilas:
    cx, cy, r = cx / ESC + X0, cy / ESC + Y0, r / ESC
    pts = []
    voltas = max(2.5, r / 1.4)
    for k in range(0, int(voltas * 36) + 1):
        th = k / 36 * 2 * math.pi
        rr = 1.2 + (r - 0.6) * k / (voltas * 36)
        pts.append((cx - 1.5 * (1 - rr / r) + rr * math.cos(th), cy - 1.5 * (1 - rr / r) + rr * math.sin(th)))
    p = np.array(pts)
    L = float(np.sqrt((np.diff(p, axis=0) ** 2).sum(axis=1)).sum())
    saida.append({'p': p, 'w': 2.2, 'L': L, 'pupila': True})

# ---------- 6. regiões e ordem ----------
# As regiões são polígonos na folha (já sem X0, Y0) que dividem o desenho em fases.
# Para outro desenho: troque os nomes e os polígonos; o que não cai em nenhum vira 'corpo'.
from matplotlib.path import Path as MPath  # noqa: E402
REG = [
    ('cabeca', [(196, 150), (440, 150), (440, 300), (380, 330), (300, 330), (240, 290), (196, 250)]),
    ('bico', [(0, 120), (200, 120), (214, 260), (0, 260)]),
    ('asa', [(415, 0), (840, 0), (840, 600), (520, 600), (470, 585), (385, 460), (395, 380), (405, 330)]),
    ('cauda', [(440, 590), (840, 590), (840, 1000), (440, 1000)]),
]
polys = [(nome, MPath(np.array(pts))) for nome, pts in REG]
ORDEM = ['cabeca', 'bico', 'asa', 'corpo', 'cauda']
def regiao(p):
    votos = {}
    for pt in p[:: max(1, len(p) // 20)]:
        nome = 'corpo'
        for nm, poly in polys:
            if poly.contains_point(pt):
                nome = nm
                break
        votos[nome] = votos.get(nome, 0) + 1
    return max(votos, key=votos.get)
def regiao_pt(pt):
    for nm, poly in polys:
        if poly.contains_point(pt):
            return nm
    return 'corpo'

def comp_p(p):
    return float(np.sqrt((np.diff(p, axis=0) ** 2).sum(axis=1)).sum()) if len(p) > 1 else 0.0

# traço que atravessa a fronteira de duas regiões vira dois (a agulha levanta ali)
partidos = []
for s in saida:
    if s.get('pupila'):
        s['g'] = 'cabeca'
        partidos.append(s)
        continue
    regs = [regiao_pt(pt) for pt in s['p']]
    cortes = [0]
    for k in range(1, len(regs)):
        if regs[k] != regs[k - 1]:
            cortes.append(k)
    cortes.append(len(regs))
    pedacos = []
    for a_, b_ in zip(cortes[:-1], cortes[1:]):
        p = s['p'][max(0, a_ - 1):b_]
        if pedacos and comp_p(p) < 14:
            pedacos[-1][0] = np.vstack([pedacos[-1][0], p[1:]])
        else:
            pedacos.append([p, regs[a_]])
    if len(pedacos) > 1 and comp_p(pedacos[0][0]) < 14:
        pedacos[1][0] = np.vstack([pedacos[0][0], pedacos[1][0][1:]])
        pedacos = pedacos[1:]
    for p, g in pedacos:
        partidos.append({'p': p, 'w': s['w'], 'L': comp_p(p), 'g': g, 'longo': s['L']})
saida = partidos
for s in saida:
    s['contorno'] = s.get('longo', s['L']) > 34 or s['w'] > 2.6 or s.get('pupila', False)

pena = np.array([212.0, 214.0])  # a agulha começa na testa, junto do bico
ordem = []
for g in ORDEM:
    for fase in (True, False):
        resto = [s for s in saida if s['g'] == g and s['contorno'] == fase]
        while resto:
            melhor, inv, dmin = None, False, 1e9
            for s in resto:
                d0 = np.linalg.norm(s['p'][0] - pena)
                d1 = np.linalg.norm(s['p'][-1] - pena)
                # contorno longo tem prioridade sobre o vizinho mais perto
                peso = 0.0 if not fase else -min(s['L'], 120) * 0.15
                if d0 + peso < dmin: melhor, inv, dmin = s, False, d0 + peso
                if d1 + peso < dmin: melhor, inv, dmin = s, True, d1 + peso
            if inv:
                melhor['p'] = melhor['p'][::-1]
            ordem.append(melhor)
            resto = [s for s in resto if s is not melhor]
            pena = melhor['p'][-1]

print('traços', len(ordem), {g: sum(1 for s in ordem if s['g'] == g) for g in ORDEM})
print('pontos', sum(len(s['p']) for s in ordem), 'comprimento', round(sum(s['L'] for s in ordem)))
ws = np.array([s['w'] for s in ordem]); print('larguras', np.percentile(ws, [5, 25, 50, 75, 95]).round(2))

todos = np.vstack([s['p'] for s in ordem])
mn, mx = todos.min(axis=0), todos.max(axis=0)
out = {
    'fonte': 'arquivos/fonte/folha-desenho.png',
    'caixa': [round(float(v), 1) for v in (*mn, *(mx - mn))],
    'grupos': ORDEM,
    'tracos': [{
        'g': ORDEM.index(s['g']),
        'c': 1 if s['contorno'] else 0,
        'w': round(s['w'], 2),
        'd': [round(float(v), 1) for v in (s['p'] - mn).ravel()],
    } for s in ordem],
}
json.dump(out, open('src/data/beija-flor.json', 'w'), separators=(',', ':'))

if len(sys.argv) > 1:
    S = 2
    img = Image.new('RGB', (int((mx - mn)[0] * S) + 40, int((mx - mn)[1] * S) + 40), 'white')
    dr = ImageDraw.Draw(img)
    cores = {'cabeca': (200, 0, 0), 'bico': (230, 120, 0), 'asa': (0, 90, 220), 'corpo': (0, 150, 60), 'cauda': (140, 0, 170)}
    for k, s in enumerate(ordem):
        pts = [tuple(((pt - mn) * S + 20).tolist()) for pt in s['p']]
        cor = cores[s['g']] if s['contorno'] else tuple(int(c * 0.4 + 150) for c in cores[s['g']])
        dr.line(pts, fill=cor, width=max(1, int(s['w'] * S * 0.8)))
    for gx in range(0, 850, 50):
        X = (gx - mn[0]) * S + 20
        dr.line([(X, 0), (X, img.size[1])], fill=(225, 225, 225) if gx % 100 else (190, 190, 190), width=1)
        dr.text((X + 2, 2), str(gx), fill=(120, 120, 120))
    for gy in range(0, 1000, 50):
        Y = (gy - mn[1]) * S + 20
        dr.line([(0, Y), (img.size[0], Y)], fill=(225, 225, 225) if gy % 100 else (190, 190, 190), width=1)
        dr.text((2, Y + 2), str(gy), fill=(120, 120, 120))
    for k, s in enumerate(ordem):
        pts = [tuple(((pt - mn) * S + 20).tolist()) for pt in s['p']]
        cor = cores[s['g']] if s['contorno'] else tuple(int(c * 0.4 + 150) for c in cores[s['g']])
        dr.line(pts, fill=cor, width=max(1, int(s['w'] * S * 0.8)))
    img.save(sys.argv[1])
