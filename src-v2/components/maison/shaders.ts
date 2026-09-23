/*
  Shaders de la maison de poupée. Aucun éclairage calculé en direct ni ombre : une lumière directionnelle
  fixe, et une « lumière de pièce » (uAllumage) qui fait passer chaque pièce de la veilleuse à l'éclat.
  Pièces : 0 rue et façade, 1 grande salle, 2 bar, 3 escalier, 4 salle aux citrons, 5 structure, 6 lueur rouge
  de la façade. Les couleurs sont des valeurs d'écran (aucune conversion de couleurs).
*/

export const NB_PIECES = 7

const communVertex = /* glsl */ `
  attribute vec3 aCouleur;
  attribute float aPiece;
  attribute float aEmission;
  uniform float uAllumage[${NB_PIECES}];
  uniform vec2 uRepetition;
  varying vec3 vCouleur;
  varying vec3 vNormale;
  varying vec2 vUv;
  varying float vLumiere;
  varying float vEmission;
  varying float vHauteur;
`

/** Surfaces : couleur par sommet, et selon la variante une image (IMAGE) ou un masque à deux couleurs (MASQUE). */
export const surfaceVertex = /* glsl */ `
  ${communVertex}
  #ifdef MASQUE
    attribute vec3 aCouleur2;
    varying vec3 vCouleur2;
  #endif
  void main() {
    vCouleur = aCouleur;
    #ifdef MASQUE
      vCouleur2 = aCouleur2;
    #endif
    vNormale = normalize(mat3(modelMatrix) * normal);
    vUv = uv * uRepetition;
    vLumiere = uAllumage[int(aPiece + 0.5)];
    vEmission = aEmission;
    vec4 monde = modelMatrix * vec4(position, 1.0);
    vHauteur = monde.y;
    gl_Position = projectionMatrix * viewMatrix * monde;
  }
`

export const surfaceFragment = /* glsl */ `
  uniform vec3 uDirection;
  uniform float uLueurFacade;
  #if defined(IMAGE) || defined(MASQUE)
    uniform sampler2D uCarte;
  #endif
  #ifdef MASQUE
    varying vec3 vCouleur2;
  #endif
  varying vec3 vCouleur;
  varying vec3 vNormale;
  varying vec2 vUv;
  varying float vLumiere;
  varying float vEmission;
  varying float vHauteur;

  void main() {
    vec3 base = vCouleur;
    #ifdef IMAGE
      base *= texture2D(uCarte, vUv).rgb;
    #endif
    #ifdef MASQUE
      base = mix(vCouleur, vCouleur2, texture2D(uCarte, vUv).r);
    #endif
    vec3 n = normalize(vNormale);
    if (!gl_FrontFacing) n = -n;
    float diffus = 0.62 + 0.38 * max(dot(n, uDirection), 0.0) + 0.06 * n.y;
    // Pièce en veilleuse : lumière froide et sombre ; allumée : lumière chaude
    vec3 teinte = mix(vec3(0.24, 0.2, 0.32), vec3(1.07, 1.0, 0.92), vLumiere);
    vec3 couleur = base * diffus * teinte + base * vEmission * (0.18 + 1.05 * vLumiere);
    #ifdef FACADE
      // Reflet rouge des néons sur le bas de la façade, comme sur les photos de nuit
      couleur += base * vec3(0.95, 0.12, 0.32) * uLueurFacade * smoothstep(5.0, 0.2, vHauteur) * 0.55;
    #endif
    gl_FragColor = vec4(couleur, 1.0);
  }
`

/** Halos (lampes, bougies, bouteilles) : quads toujours face à la caméra, dessinés en un seul appel. */
export const haloVertex = /* glsl */ `
  attribute vec3 aCentre;
  attribute float aTaille;
  attribute vec3 aTeinte;
  attribute float aPiece;
  attribute float aPhase;
  uniform float uAllumage[${NB_PIECES}];
  uniform float uTemps;
  varying vec2 vUv;
  varying vec3 vCouleur;
  void main() {
    vUv = uv;
    float a = uAllumage[int(aPiece + 0.5)];
    float force = aPiece > 5.5 ? a : 0.12 + 0.88 * smoothstep(0.32, 1.0, a);
    float scintille = 0.9 + 0.1 * sin(uTemps * 8.3 + aPhase * 6.3) * sin(uTemps * 3.1 + aPhase * 11.0);
    vCouleur = aTeinte * force * scintille;
    vec4 vue = viewMatrix * vec4(aCentre, 1.0);
    vue.xy += position.xy * aTaille;
    gl_Position = projectionMatrix * vue;
  }
`

export const haloFragment = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vCouleur;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float h = exp(-d * d * 5.5) * (1.0 - smoothstep(0.75, 1.0, d));
    gl_FragColor = vec4(vCouleur * h, 1.0);
  }
`

/** Roses en néon de la façade : image de la rose, en mélange additif. */
export const neonVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const neonFragment = /* glsl */ `
  uniform sampler2D uCarte;
  uniform float uNeon;
  varying vec2 vUv;
  void main() {
    vec3 c = texture2D(uCarte, vUv).rgb;
    gl_FragColor = vec4(c * uNeon * 1.25, 1.0);
  }
`

/** Ombre douce sous le socle. */
export const ombreFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * 2.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.55 * (1.0 - smoothstep(0.35, 1.0, d)));
  }
`
