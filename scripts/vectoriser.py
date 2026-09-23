"""Vectorise les emblèmes officiels de Gigi et les écrit dans src/data/emblemes.ts.

- Logo GIGI : tracé (potrace) depuis le PNG officiel du site (le « I » est dessiné sur mesure, ce n'est pas
  une police disponible).
- Rose : dessin vectoriel repris tel quel de la carte de décembre 2024 (PDF).

Dépendances : pip install potracer pymupdf numpy pillow
Usage : python scripts/vectoriser.py
"""
import numpy as np
import potrace
import pymupdf
from PIL import Image

f1 = lambda v: ('%.1f' % v).rstrip('0').rstrip('.')


def tracer_logo(chemin, echelle=3):
    alpha = Image.open(chemin).convert('RGBA').getchannel('A')
    alpha = alpha.resize((alpha.width * echelle, alpha.height * echelle), Image.LANCZOS)
    # potracer trace les pixels « faux » : on lui donne le fond
    bitmap = potrace.Bitmap(np.array(alpha) <= 127)
    trace = bitmap.trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.2)
    p = lambda v: f1(v / echelle)
    morceaux = []
    for courbe in trace:
        s = courbe.start_point
        d = [f'M{p(s.x)} {p(s.y)}']
        for seg in courbe.segments:
            if seg.is_corner:
                d.append(f'L{p(seg.c.x)} {p(seg.c.y)}L{p(seg.end_point.x)} {p(seg.end_point.y)}')
            else:
                d.append(f'C{p(seg.c1.x)} {p(seg.c1.y)} {p(seg.c2.x)} {p(seg.c2.y)} {p(seg.end_point.x)} {p(seg.end_point.y)}')
        morceaux.append(''.join(d) + 'Z')
    return ''.join(morceaux), alpha.width / echelle, alpha.height / echelle


def rose_de_la_carte(chemin, echelle=10):
    page = pymupdf.open(chemin)[0]
    rose = next(x for x in page.get_drawings() if len(x['items']) == 276)
    r = rose['rect']
    P = lambda pt: f'{f1((pt.x - r.x0) * echelle)} {f1((pt.y - r.y0) * echelle)}'
    d, courant = [], None
    for item in rose['items']:
        depart = item[1]
        if courant is None or abs(courant.x - depart.x) > 1e-3 or abs(courant.y - depart.y) > 1e-3:
            d.append('M' + P(depart))
        if item[0] == 'l':
            d.append('L' + P(item[2]))
            courant = item[2]
        elif item[0] == 'c':
            d.append(f'C{P(item[2])} {P(item[3])} {P(item[4])}')
            courant = item[4]
    return ''.join(d), r.width * echelle, r.height * echelle


logo, lw, lh = tracer_logo('sources/site-officiel/GIGI_logo.png')
rose, rw, rh = rose_de_la_carte('sources/cartes/carte-2024-12.pdf')

with open('src/data/emblemes.ts', 'w', encoding='utf-8') as f:
    f.write('// Généré par scripts/vectoriser.py : ne pas modifier à la main.\n\n')
    f.write('/** Logo GIGI officiel (vectorisé depuis le PNG du site gigi6161.be). */\n')
    f.write(f"export const LOGO = {{ largeur: {f1(lw)}, hauteur: {f1(lh)}, d: '{logo}' }}\n\n")
    f.write('/** Rose en trait de la carte (décembre 2024). */\n')
    f.write(f"export const ROSE = {{ largeur: {f1(rw)}, hauteur: {f1(rh)}, d: '{rose}' }}\n")

# Favicon : la rose framboise sur fond crème arrondi
vb = max(rw, rh) * 1.3
ox, oy = (vb - rw) / 2, (vb - rh) / 2
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f1(vb)} {f1(vb)}">'
        f'<rect width="{f1(vb)}" height="{f1(vb)}" rx="{f1(vb * 0.22)}" fill="#EEE2CA"/>'
        f'<path transform="translate({f1(ox)} {f1(oy)})" fill="#C90050" d="{rose}"/></svg>'
    )
print('src/data/emblemes.ts et public/favicon.svg écrits', len(logo), len(rose))
