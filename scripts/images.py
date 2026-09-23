"""Prépare les images du site dans public/images/ : photos en WebP (plusieurs largeurs), image de partage,
plan d'accès (tuiles OpenStreetMap passées en bichromie crème et bordeaux).

Usage : python scripts/images.py            (photos + image de partage)
        python scripts/images.py --plan     (retélécharge aussi les tuiles du plan)
"""
from PIL import Image, ImageOps
import io, math, os, sys, urllib.request

A = 'sources/site-officiel/animation'
P = 'sources/presse'
SORTIE = 'public/images'
QUALITE = 78

# nom : (fichier source, largeurs). La première largeur donne le fichier sans suffixe.
PHOTOS = {
    # Animation d'accueil de gigi6161.be (décembre 2021)
    'salle-citrons': (f'{A}/image-00.jpg', [692, 460]),
    'madone-store': (f'{A}/image-01.jpg', [1040, 640]),
    'entree-toast': (f'{A}/image-02.jpg', [692, 460]),
    'rose-neon': (f'{A}/image-03.jpg', [692, 460]),
    'table-partage': (f'{A}/image-04.jpg', [1038, 640]),
    'lampes-bras': (f'{A}/image-05.jpg', [692, 460]),
    'escalier-vert': (f'{A}/image-09.jpg', [692, 460]),
    'vitrine-statues': (f'{A}/image-10.jpg', [692, 460]),
    'facade-nuit': (f'{A}/image-11.jpg', [692, 460]),
    'verres-vin': (f'{A}/image-12.jpg', [896, 520]),
    'bar-vert': (f'{A}/image-13.jpg', [682, 460]),
    'cuisine-passe': (f'{A}/image-14.jpg', [1044, 640]),
    'plafond-miroir': (f'{A}/image-16.jpg', [682, 460]),
    'equipe': (f'{A}/image-17.jpg', [692, 460]),
    'boite-citrons': (f'{A}/image-18.jpg', [700, 460]),
    'bouteilles': (f'{A}/image-19.jpg', [692, 460]),
    'facade-roses': (f'{A}/image-20.jpg', [692, 460]),
    'grande-salle': (f'{A}/image-21.jpg', [692, 460]),
    'table-pates': (f'{A}/image-22.jpg', [1034, 640]),
    'boite-vert': (f'{A}/image-23.jpg', [1039, 640]),
    # Site officiel
    'roses-neon': ('sources/site-officiel/GIGI-CONTACTPIC.jpg', [789, 480]),
    # Studio Sissi et Zware Jongens (haute définition)
    'plat-citrons': (f'{P}/Food-2-Gigi-Studio_Sissi-Branding_Agency-1.webp', [1100, 700]),
    'spaghetti': (f'{P}/Food-3-Gigi-Studio_Sissi-Branding_Agency.webp', [1100, 700]),
    'pizza-partage': (f'{P}/Food-4-Gigi-Studio_Sissi-Branding_Agency.webp', [1600, 900]),
    'carte-cadeau': (f'{P}/GF-Gigi-Studio_Sissi-Branding_Agency.webp', [1400, 800]),
    'banquet': (f'{P}/Shoot-Gigi-Studio_Sissi-Branding_Agency.webp', [1920, 1200, 760]),
    'pizzaiolo': (f'{P}/zware-jongens-pizzaiolo.jpg', [1100, 700]),
    'boite-pizza': (f'{P}/zware-jongens-boite-pizza.jpg', [1100, 700]),
}


def photos():
    os.makedirs(SORTIE, exist_ok=True)
    for nom, (chemin, largeurs) in PHOTOS.items():
        image = ImageOps.exif_transpose(Image.open(chemin)).convert('RGB')
        for i, largeur in enumerate(largeurs):
            hauteur = round(image.height * largeur / image.width)
            reduite = image.resize((largeur, hauteur), Image.LANCZOS) if largeur < image.width else image
            suffixe = '' if i == 0 else f'-{largeur}'
            fichier = f'{SORTIE}/{nom}{suffixe}.webp'
            reduite.save(fichier, 'WEBP', quality=QUALITE, method=6)
            print(f'{fichier:44} {reduite.width}x{reduite.height} {os.path.getsize(fichier) // 1024} Ko')

    # Image de partage (réseaux sociaux), 1200 x 630
    image = Image.open(PHOTOS['banquet'][0]).convert('RGB')
    hauteur = 630
    largeur = round(image.width * hauteur / image.height)
    image = image.resize((largeur, hauteur), Image.LANCZOS)
    gauche = (largeur - 1200) // 2
    image.crop((gauche, 0, gauche + 1200, 630)).save(f'{SORTIE}/og-image.jpg', 'JPEG', quality=84, optimize=True)
    print('og-image.jpg')


# Plan : tuiles OpenStreetMap (© contributeurs OpenStreetMap, licence ODbL), zoom 17, centré sur le restaurant
LAT, LON = 51.0555152, 3.7273852
ZOOM = 17
LARGEUR_PLAN, HAUTEUR_PLAN = 1200, 900
CREME = (238, 226, 202)
BORDEAUX = (58, 12, 26)


def pixel_monde(lat, lon, zoom):
    n = 256 * 2**zoom
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def plan():
    cx, cy = pixel_monde(LAT, LON, ZOOM)
    x0, y0 = cx - LARGEUR_PLAN / 2, cy - HAUTEUR_PLAN / 2
    toile = Image.new('RGB', (LARGEUR_PLAN, HAUTEUR_PLAN))
    for tx in range(int(x0 // 256), int((x0 + LARGEUR_PLAN) // 256) + 1):
        for ty in range(int(y0 // 256), int((y0 + HAUTEUR_PLAN) // 256) + 1):
            requete = urllib.request.Request(
                f'https://tile.openstreetmap.org/{ZOOM}/{tx}/{ty}.png',
                headers={'User-Agent': 'ADIT-Solutions-maquette-gigi/1.0 (info@aditsolutions.be)'},
            )
            tuile = Image.open(io.BytesIO(urllib.request.urlopen(requete).read())).convert('RGB')
            toile.paste(tuile, (round(tx * 256 - x0), round(ty * 256 - y0)))
    gris = ImageOps.autocontrast(toile.convert('L'), cutoff=4)
    bichromie = ImageOps.colorize(gris, black=BORDEAUX, white=CREME, mid=(214, 186, 170), blackpoint=0, whitepoint=255, midpoint=150)
    bichromie.save(f'{SORTIE}/plan.webp', 'WEBP', quality=80, method=6)
    moitie = bichromie.resize((LARGEUR_PLAN // 2, HAUTEUR_PLAN // 2), Image.LANCZOS)
    moitie.save(f'{SORTIE}/plan-600.webp', 'WEBP', quality=80, method=6)
    print('plan.webp', os.path.getsize(f'{SORTIE}/plan.webp') // 1024, 'Ko')


if __name__ == '__main__':
    photos()
    if '--plan' in sys.argv:
        plan()
