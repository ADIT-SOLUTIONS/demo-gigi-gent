# Mesures de fluidité à froid

Mesures du 2026-09-23 sur le build de production de la branche `demo-versions` (`npm run build` puis
`npm run preview -- --port 5192`), avec `npm run mesure` (`scripts/mesure-fluidite.mjs`). Détail brut :
`docs/mesures-fluidite.json`.

## Méthode

- Chaque scénario lance un Chrome neuf avec un profil vierge : ni cache HTTP, ni cache de shaders.
- Puce graphique : ANGLE (Intel, Intel(R) Arc(TM) Pro Graphics (0x00007D55) Direct3D11 vs_5_0 ps_5_0, D3D11) (puce intégrée au processeur).
- La page est chargée, on attend qu'elle soit prête (scène 3D comprise), puis on la fait défiler de haut en bas
  à vitesse constante (1 500 px/s sur ordinateur, 1 100 px/s sur mobile), en relevant la durée de chaque image.
- « Mobile » : écran 390 × 844, densité 3, tactile, processeur ralenti 4 fois (téléphone de milieu de gamme simulé).
  La puce graphique reste celle de l'ordinateur : c'est une approximation, à confirmer sur de vrais téléphones.
- Un « gel » est une image de plus de 50 ms. À 60 Hz, une image normale dure 16,7 ms.

## Défilement

| Scénario | Page | Images/s | Médiane | 95 % | 99 % | Pire image | Gels > 50 ms | Tâches longues |
|---|---|---|---|---|---|---|---|---|
| Démo (/), version 1 puis 2 | `/v1/` | 59,9 | 16,7 ms | 16,8 ms | 16,8 ms | 16,9 ms | 0 | 0 |
| Démo (/), version 1 puis 2 | `/v2/` | 60 | 16,7 ms | 16,8 ms | 16,9 ms | 17 ms | 0 | 0 |
| Version 2 immersive, ordinateur | `/v2/` | 59,9 | 16,7 ms | 16,8 ms | 16,9 ms | 17 ms | 0 | 0 |
| Version 2 immersive, mobile (processeur ralenti ×4) | `/v2/` | 59,9 | 16,7 ms | 16,8 ms | 16,9 ms | 17,2 ms | 0 | 0 |
| Version 1 classique, ordinateur | `/v1/` | 59,7 | 16,7 ms | 16,8 ms | 16,9 ms | 33,4 ms | 0 | 0 |
| Version 1 classique, mobile (processeur ralenti ×4) | `/v1/` | 60 | 16,7 ms | 16,8 ms | 16,9 ms | 17,2 ms | 0 | 0 |

## Chargement

| Scénario | Prête après | Tâches longues | Plus longue |
|---|---|---|---|
| Démo (/), version 1 puis 2 | 4,0 s | 1 | 130 ms |
| Version 2 immersive, ordinateur | 1,8 s | 3 | 152 ms |
| Version 2 immersive, mobile (processeur ralenti ×4) | 3,2 s | 6 | 686 ms |
| Version 1 classique, ordinateur | 1,6 s | 1 | 78 ms |
| Version 1 classique, mobile (processeur ralenti ×4) | 2,4 s | 4 | 360 ms |

## Lecture

- **Défilement** : environ 60 images/s dans tous les scénarios, ordinateur comme mobile simulé, sans aucun gel ni
  tâche longue. La scène 3D tourne pendant la mesure (définition finale : 1 sur ordinateur,
  1,5 sur mobile, jamais abaissée par la qualité adaptative).
- **Console** : aucune erreur ni aucun avertissement, dans aucun scénario.
- **Chargement** : les tâches longues relevées ont lieu pendant le premier affichage (lecture du JavaScript,
  préparation de la scène 3D), avant toute interaction. Dans la démo, elles sont cachées derrière l'écran de chargement.
- **Ce qui a été corrigé en route** (mesures intermédiaires sur mobile simulé : 47 à 57 images/s, jusqu'à 18 gels) :
  pouls de la pastille « ouvert » animé par une ombre (repeinture à chaque image), manifeste allumé mot à mot
  (une soixantaine d'éléments), carte dépliée en perspective (tout le bloc redessiné), et parallaxes secondaires
  sur téléphone. Tous remplacés ou réservés aux grands écrans.

## Pistes si besoin

- Vérifier sur un vrai téléphone Android de milieu de gamme et sur un iPhone (Safari).
- Les images des pièces viennent d'une animation GIF (environ 700 px) : des originaux en haute définition seraient
  plus nets sur les grands écrans, pour un poids à surveiller.
