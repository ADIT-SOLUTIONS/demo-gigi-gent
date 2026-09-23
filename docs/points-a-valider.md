# Points à valider avec les gérants

Tous les repères entre crochets `[...]` se retrouvent avec une recherche de `[` dans `src/`.

## Informations pratiques

- **Téléphone** : deux numéros circulent. Le site affiche +32 479 32 72 71 (site officiel, icône « Call me ») ;
  Google indique +32 486 23 27 90. Lequel garder ? (`src/data/infos.ts`, `index.html`)
- **Horaires** : relevés sur Google Maps le 2026-09-23 (Tripadvisor diffère). Heure de fermeture de la cuisine ?
  Horaires des jours fériés et des vacances ? (`src/data/infos.ts`, `index.html`)
- **Brunch du dimanche** mentionné sur Instagram : jours, horaires, formule, prix ? Non repris sur le site.
- **Carte cadeau** : le lien Resengo du site actuel est-il toujours valable (les réservations sont passées chez Zenchef) ?
- **Mentions légales** : raison sociale et numéro BCE/TVA (`[RAISON SOCIALE]`, `[N° BCE / TVA]`), pages
  « Mentions légales » et « Confidentialité » à rédiger (skill `pages-legales`).
- **Domaine** : `[DOMAINE]` dans `index.html` (adresse canonique, image de partage).
- **Formulaire** « Un groupe, une question ? » : il ouvre la messagerie du visiteur (mailto vers info@gigi6161.be).
  Brancher Formspree ou un autre service ? (`src/utils/envoi.ts`). Acceptent-ils les groupes et privatisations ?

## Carte

- Reprise de la carte de **décembre 2024** : plats et prix de la saison actuelle ?
- Vins : non repris (la seule carte trouvée date de 2022). Fournir la carte des vins actuelle.
- Noms corrigés par rapport au PDF : « Il nostre foccacia » → « La nostra focaccia », « Spinacchi » → « spinaci »,
  « Fussilone agli pesto » → « Fusillone al pesto », « Fettucine » → « Fettuccine », « Medditeranea » → « mediterranea »,
  « Mousse au ciocolatta » → « Mousse al cioccolato », « Bouvardier » → « Boulevardier », « Insalate » → « Insalata ».
  Garder ces corrections ou revenir aux noms de la carte ?
- Descriptions traduites en néerlandais et en français depuis l'anglais de la carte : relecture par l'équipe.
- Plats sans description sur la carte (secondi, sides, dolci) : en ajouter ?

## Textes et photos

- Manifeste « 6161 Reasons » repris de leur carte et de leur site, traduit en NL et FR : valider les traductions.
- Faits cités : ouverture à l'automne 2021, intérieur de Jean-Philippe Demeyer, nom tiré de la chanson de Dalida
  (sources presse, voir `docs/recherche.md`). Citer les fondateurs ? (Willem Deketelaere et William Verhaeghe
  selon la presse de 2021.)
- « À 3 minutes à pied du parking Vrijdagmarkt » : distance calculée (environ 200 m).
- Photos : issues de leur site (2021) et des portfolios de Studio Sissi et Zware Jongens. Accord pour les réutiliser,
  et photos plus récentes (plats de saison, équipe actuelle) si possible. Les photos des pièces viennent d'une
  animation GIF : des originaux en haute définition seraient plus nets.
- Polices : Roslindale et Saa Series (identité Zware Jongens) sont payantes. Le site utilise des équivalents libres ;
  si Gigi possède les licences web, on peut les brancher.

## Version immersive

- La maison de poupée en 3D est une **évocation** d'après les photos : la répartition des pièces (grande salle et bar
  au rez-de-chaussée, salle aux citrons et escalier vert à l'étage) et la façade en deux battants ne reprennent pas
  le plan réel. À valider (ou à corriger avec un plan ou quelques photos de plus) avant de la montrer comme « le lieu ».
- Les textes de chaque pièce décrivent ce qu'on voit sur leurs photos : à relire par l'équipe.
- La légende « Évocation en 3D, d'après les photos du restaurant » est affichée sous le titre de la section.
