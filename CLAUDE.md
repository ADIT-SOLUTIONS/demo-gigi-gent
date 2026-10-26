# Gigi Gand, démo de site (`demo-gigi-gent`)

Démo proactive en deux versions pour Gigi (GIGI6161), restaurant italien « Cucina amorosa » au Belfortstraat 24 à Gand (prospect). Site trilingue NL, EN, FR. Démo terminée le 2026-09-23, pas encore en ligne.

## Contexte AD IT Solutions
- Prospect : Gigi (slug `gigi-gent`). Fiche : Drive ADIT Operations, `02-prospects/gigi-gent/CLAUDE.md` (aucun autre fichier dans le dossier au 2026-10-26). Recherche et questions pour les gérants : `docs/recherche.md` et `docs/points-a-valider.md` du dépôt.
- Drive ADIT Operations : `G:\Shared drives\ADIT Operations` chez Jules (Windows), `~/Library/CloudStorage/GoogleDrive-<adresse>/Shared drives/ADIT Operations` chez Achille (Mac).
- Clone local : `C:\dev\demo-gigi-gent` chez Jules, `~/dev/demo-gigi-gent` chez Achille.
- Méthode : skill `adit:demo-prospect` (démo en deux versions) et `adit:site-vitrine` ; pages légales : `adit:pages-legales`.

## Stack et commandes
- Vite 8, React 19, TypeScript 5.9, GSAP 3 (`@gsap/react`), Three.js 0.186, polices Fontsource (EB Garamond, Barlow Condensed, Instrument Serif), `playwright-core` pour les scripts de test.
- `npm ci`, `npm run dev` (port 5191), `npm run build` (tsc puis vite, sortie `dist/` : `/`, `/v1/`, `/v2/`), `npm run preview -- --port 5192`, `npm run mesure` (fluidité à froid).
- Scripts : `scripts/verifier.mjs` (captures et débordements), `sequence.mjs` (captures de la séquence 3D), `tests-replis-3d.mjs`, `tests-demo.mjs`, `affiche-3d.mjs` (images fixes de la maison, serveur de dev lancé), `images.py` et `vectoriser.py` (Python). Usage dans `docs/demo-versions.md`.

## Branches et déploiement
- `demo-versions` (par défaut) : seule branche sur GitHub. `docs/demo-versions.md` cite aussi `main` (classique seule) et `version-immersive` (immersive seule), absentes du dépôt distant [À CONFIRMER : jamais poussées ou perdues].
- Render : aucun service au 2026-10-26. `render.yaml` prêt (service `gigi-gent-demo`, site statique, `npm ci && npm run build`, publié `dist`, `noindex`).
- ATTENTION : une fois le service créé, chaque commit poussé sur la branche suivie sera mis en ligne automatiquement.

## Structure du code
- `index.html` et `selecteur/` : page de démo. Rose de la carte qui s'allume en néon pendant le chargement, pastille en bas à gauche, `/#2` ouvre la v2. La langue choisie est partagée entre les deux versions.
- `src/` : version 1 classique et socle commun. Textes NL (par défaut), EN et FR dans `src/i18n.ts` ; carte dans `src/data/carte.ts` ; coordonnées, horaires, mentions dans `src/data/infos.ts` ; photos et emblèmes dans `src/data/photos.ts` et `emblemes.ts` ; envoi du formulaire dans `src/utils/envoi.ts`.
- `src-v2/` : version 2 immersive, qui réutilise sections et données de `src/`. Accueil en couches (`Hero.tsx`, `Decor.tsx`, `Citron.tsx`), galerie en colonnes, maison de poupée en Three.js dans `src-v2/components/Maison.tsx` et `src-v2/components/maison/`.
- Images WebP : `public/images/`, dont les images fixes `maison-3d*.webp`. Sources : `sources/cartes`, `sources/presse`, `sources/site-officiel`.
- Documentation : `docs/demo-versions.md`, `docs/recherche.md`, `docs/points-a-valider.md`, `docs/pistes-creatives.md`, `docs/mesures-fluidite.md` (et `.json`).

## Décisions et points d'attention
- Direction retenue : « Cucina Amorosa ». Non retenues : « Notte al neon », « Limoni e tovaglie » (`docs/pistes-creatives.md`).
- Séquence 3D retenue : la maison de poupée (façade qui s'ouvre, pièces qui s'allument avec leurs vraies photos). C'est une évocation d'après les photos, pas le plan réel : la présenter comme telle.
- Identité graphique de l'agence Zware Jongens, photos de Studio Sissi : visuels propriété de Gigi et de ces agences. Polices officielles payantes remplacées par des polices libres, logo original vectorisé.
- Fluidité mesurée le 2026-09-23 : environ 60 images/s partout, mobile simulé compris. Parallaxes secondaires coupées sur téléphone.
- Carte de décembre 2024 reprise avec ses prix, à faire valider. Aucun avis client repris.
- Placeholders entre crochets (recherche de `[` dans `src/`) : `[DOMAINE]`, `[RAISON SOCIALE]`, `[N° BCE / TVA]`, `[URL_FORMSPREE]`. Deux numéros de téléphone circulent, horaires à confirmer.
- Pages en `noindex` (et `X-Robots-Tag` sur Render) : à retirer pour le site définitif. Pas de réécriture de toutes les adresses vers `/index.html`.
- Dépôt public : droits sur les photos et le logo à régulariser avant tout envoi.

## Règles AD IT Solutions
- Diagnostic avant action : répondre aux questions sans modifier le code, attendre le feu vert avant d'implémenter.
- Textes : jamais de tiret cadratin « — », pas de tournures « trop IA », aucune donnée inventée (placeholder `[À COMPLÉTER : …]`).
- Aucun secret dans le dépôt.
- Fin de travail : résumé court (fait, placeholders restants, à vérifier) et mise à jour de ce fichier si une décision change.
