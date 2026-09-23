# Démo des maquettes (branche `demo-versions`)

Un seul déploiement pour présenter les deux versions du site aux gérants de Gigi.

| Adresse | Rôle | Code |
|---|---|---|
| `/` | Page de démo : écran de chargement, les deux versions, pastille de choix | `index.html`, `selecteur/` |
| `/v1/` | Version 1, Classique « Cucina Amorosa » : identique à `main` | `src/` |
| `/v2/` | Version 2, Immersive : identique à `version-immersive` | `src-v2/` (+ composants et données de `src/`) |

## Branches

- `main` : version classique seule, servie à `/`.
- `version-immersive` : version immersive seule, servie à `/`. Elle réutilise les sections et les données de `src/`
  (mêmes textes en NL, EN et FR, même carte) avec ses propres effets, et remplace la galerie « Il posto » par la
  maison de poupée en 3D suivie d'une galerie en colonnes.
- `demo-versions` : les deux, plus la page de démo.

## Version immersive

- Accueil en couches : store rayé festonné qui se replie, citrons du papier peint qui flottent, logo qui se dévoile,
  arche en relief, rose en néon qui s'allume.
- Titres dont les mots basculent à l'apparition, manifeste qui s'allume phrase après phrase, photo du banquet qui se
  resserre, carte qui se déplie (glissement simple sur écran tactile), photos qui s'inclinent vers la souris.
- « Il posto » : section épinglée, maison de poupée en Three.js (`src-v2/components/maison/`). Les roses en néon de
  la façade s'allument, la façade s'ouvre en deux battants, la grande salle, le bar, l'escalier vert et la salle aux
  citrons s'allument tour à tour avec leur vraie photo, puis la caméra plonge vers une table dressée
  (boîte à pizza Gigi) : « Une table vous attend ». Évocation d'après les photos, pas le plan exact.

### Fluidité (leçons reprises de Maï-Taï et FADA)

- Aucun calcul d'environnement au chargement (pas de PMREM) : éclairage fixe et « lumière de pièce » dans un shader maison.
- Scène construite par étapes (la main est rendue au navigateur entre chacune), textures dessinées au canevas,
  shaders compilés en parallèle (`compileAsync`, extension `KHR_parallel_shader_compile`), textures envoyées au GPU
  et premier rendu à blanc avant l'affichage.
- Géométries fusionnées par matière (une quinzaine d'appels de dessin), toutes les lumières en un seul appel, pas
  d'ombres ni de post-traitement.
- Définition adaptative : la résolution baisse par paliers si les images s'espacent.
- Rendu seulement quand la section est à l'écran, et jamais quand la version est cachée derrière l'autre dans la démo.
- Perte du contexte WebGL : image fixe de la maison, puis reconstruction à la restauration.
- Sans WebGL, avec « réduire les animations » ou sur un écran trop bas : image fixe de la maison et textes à la suite.
  Les images fixes (`public/images/maison-3d*.webp`) sont rendues par la scène elle-même : `npm run dev`, puis
  `node scripts/affiche-3d.mjs`.
- Sur téléphone, les parallaxes secondaires (décor flottant, colonnes de la galerie, images de la cuisine) sont
  désactivées : elles coûtaient des images au défilement.

## Fonctionnement de la démo

- `index.html` + `selecteur/selecteur.ts` : ouvre `/v1/` et `/v2/` dans deux cadres plein écran superposés.
  Pendant le chargement, la rose de la carte s'allume en néon de bas en haut, puis grésille ; la version 1 s'affiche
  (ou la 2 avec l'adresse `/#2`).
- `selecteur/cadre.ts`, chargé par chaque version : force le chargement immédiat des images, attend les polices et la
  scène 3D, envoie sa progression à la démo, et obéit à ses commandes (retour en haut, version cachée ou visible).
  Ouverte seule, une version fonctionne normalement.
- Changer de version remonte la version choisie en haut de page puis l'affiche : rien n'est rechargé.
  La version cachée met ses animations en pause.
- La pastille (bas à gauche, 30 % d'opacité) ouvre le panneau « 1 Classique, 2 Immersive ». Elle se masque pendant le
  chargement et quand le menu mobile est ouvert.
- La langue choisie (NL, EN, FR) est partagée entre les deux versions.

## Mise en ligne sur Render

- Site statique : `render.yaml` à la racine (Blueprint). Sinon, à la main : commande de build `npm ci && npm run build`,
  dossier publié `dist`.
- Ne pas ajouter de règle de réécriture de toutes les adresses vers `/index.html` : `/v1/` et `/v2/` sont de vraies pages.
- Les pages ont une balise `noindex` (et l'en-tête `X-Robots-Tag` sur Render) pour que la démo n'apparaisse pas dans
  Google : elles ne doivent pas être reprises sur le site définitif.

## Scripts de vérification

- `node scripts/verifier.mjs <url> <dossier> <langue>` : captures pleine page (ordinateur, tablette, mobile),
  débordement horizontal, console.
- `node scripts/sequence.mjs <url> <dossier> <largeur> <hauteur>` : captures de la séquence 3D.
- `node scripts/tests-replis-3d.mjs <dossier>` : « réduire les animations », sans WebGL, perte de contexte.
- `node scripts/tests-demo.mjs <dossier> [largeur] [hauteur]` : chargement, bascule, retour en haut, noindex.
- `npm run mesure` : fluidité à froid (voir `docs/mesures-fluidite.md`).
