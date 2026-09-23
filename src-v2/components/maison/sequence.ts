/*
  Séquence « La maison de poupée » : tout est fonction du temps t de la timeline GSAP (0 à DUREE).
  La timeline pilote les textes ; la scène 3D lit le même temps pour rester synchronisée.

  0      intro, les roses en néon de la façade s'allument
  1.2    la façade s'ouvre en deux, comme une maison de poupée
  2.6    chaque pièce s'allume à son tour : grande salle, bar, escalier vert, salle aux citrons
  9.0    la caméra plonge vers une table dressée de la salle aux citrons
  10.2   fin : « Une table vous attend »
*/

export const DUREE = 11

/** Pièces dans l'ordre de la visite. L'indice sert aussi d'identifiant de pièce dans les shaders (1 à 4). */
export const PIECES = ['grandeSalle', 'bar', 'escalier', 'citrons'] as const
export type Piece = (typeof PIECES)[number]

export const T_NEON = [0.15, 0.95] as const
export const T_OUVERTURE = [1.2, 2.6] as const
export const T_PIECE = 2.6
export const PAS_PIECE = 1.6
export const T_PLONGEE = [9.0, 10.2] as const
export const T_FIN = 10.2

export const debutPiece = (i: number) => T_PIECE + i * PAS_PIECE

const borne = (x: number) => Math.min(1, Math.max(0, x))
const lisse = (x: number) => {
  const t = borne(x)
  return t * t * t * (t * (t * 6 - 15) + 10)
}
const entre = (t: number, a: number, b: number) => lisse((t - a) / (b - a))

/** Pièce en cours de visite (-1 avant, 4 pendant la plongée). */
export function pieceActive(t: number) {
  if (t < T_PIECE) return -1
  return Math.min(PIECES.length, Math.floor((t - T_PIECE) / PAS_PIECE))
}

/** Allumage des néons (0 à 1) avec grésillement à l'allumage. */
export function neon(t: number, secondes: number) {
  const a = entre(t, T_NEON[0], T_NEON[1])
  if (a <= 0) return 0
  if (a >= 1) return 0.94 + 0.06 * Math.sin(secondes * 23) * Math.sin(secondes * 7.3)
  // Grésillement : quelques extinctions brèves pendant l'allumage
  const hache = Math.sin(t * 173.1) * Math.sin(t * 61.7)
  return a * (hache > 0.35 ? 0.25 : 1)
}

/** Angle d'ouverture des deux moitiés de la façade (radians). */
export const ANGLE_OUVERT = (160 * Math.PI) / 180
export const ouverture = (t: number) => entre(t, T_OUVERTURE[0], T_OUVERTURE[1]) * ANGLE_OUVERT

/**
 * Lumière de chaque pièce (indices 0 à 5 : 0 rue et façade, 1 à 4 pièces, 5 structure).
 * Avant l'ouverture, les fenêtres luisent doucement ; ensuite la pièce visitée s'allume pleinement et les
 * autres restent en veilleuse ; à la fin, toute la maison est allumée.
 */
export function allumages(t: number, sortie: number[]) {
  const ouvert = entre(t, T_OUVERTURE[0], T_OUVERTURE[1])
  const fin = entre(t, T_PLONGEE[0] + 0.3, T_FIN)
  sortie[0] = 1
  sortie[5] = 0.55 + 0.35 * ouvert
  for (let i = 0; i < PIECES.length; i++) {
    const debut = debutPiece(i)
    const allumee = entre(t, debut - 0.2, debut + 0.35)
    const passee = entre(t, debut + PAS_PIECE - 0.25, debut + PAS_PIECE + 0.25)
    // Veilleuse : 0.5 fenêtres vues de la rue, 0.34 une fois ouverte (la pièce visitée ressort)
    const veille = 0.5 - 0.16 * ouvert
    const visite = allumee * (1 - passee * 0.45)
    sortie[i + 1] = Math.max(veille + (1 - veille) * visite, fin, i === 3 ? entre(t, debut - 0.2, debut + 0.35) : 0)
  }
  return sortie
}

/** Cadrages de la caméra : point visé, angles (degrés) et zone à faire tenir à l'écran (mètres). */
export type Cadrage = { cible: [number, number, number]; lacet: number; tangage: number; largeur: number; hauteur: number }

const FACADE: Cadrage = { cible: [0, 3.9, 3], lacet: 0, tangage: 5, largeur: 14.5, hauteur: 10.4 }
const OUVERTE: Cadrage = { cible: [0, 3.8, 0.2], lacet: -16, tangage: 13, largeur: 15.5, hauteur: 10.6 }
const GRANDE_SALLE: Cadrage = { cible: [-3, 1.55, -0.4], lacet: 16, tangage: 11, largeur: 7.4, hauteur: 4.3 }
const BAR: Cadrage = { cible: [3, 1.6, -0.6], lacet: -17, tangage: 10, largeur: 7.4, hauteur: 4.3 }
const ESCALIER: Cadrage = { cible: [3, 5.35, -0.7], lacet: -13, tangage: 6, largeur: 7.2, hauteur: 4.2 }
const CITRONS: Cadrage = { cible: [-3, 5.3, -0.6], lacet: 13, tangage: 8, largeur: 7.2, hauteur: 4.2 }
const TABLE: Cadrage = { cible: [-2.2, 4.55, 1.25], lacet: 24, tangage: 30, largeur: 2.3, hauteur: 1.45 }

/** Clés de caméra (temps, cadrage) : deux clés identiques de suite font une pause. */
export const CLES_CAMERA: Array<[number, Cadrage]> = [
  [0, FACADE],
  [1.25, FACADE],
  [2.55, OUVERTE],
  [debutPiece(0) + 0.55, GRANDE_SALLE],
  [debutPiece(1) - 0.05, GRANDE_SALLE],
  [debutPiece(1) + 0.55, BAR],
  [debutPiece(2) - 0.05, BAR],
  [debutPiece(2) + 0.55, ESCALIER],
  [debutPiece(3) - 0.05, ESCALIER],
  [debutPiece(3) + 0.55, CITRONS],
  [T_PLONGEE[0], CITRONS],
  [T_PLONGEE[1], TABLE],
  [DUREE, TABLE],
]

/** Cadrage interpolé au temps t (transitions adoucies entre deux clés). */
export function cadrage(t: number, sortie: Cadrage): Cadrage {
  let i = 0
  while (i < CLES_CAMERA.length - 2 && t > CLES_CAMERA[i + 1][0]) i++
  const [ta, a] = CLES_CAMERA[i]
  const [tb, b] = CLES_CAMERA[i + 1]
  const k = tb > ta ? lisse((t - ta) / (tb - ta)) : 1
  const m = (x: number, y: number) => x + (y - x) * k
  sortie.cible[0] = m(a.cible[0], b.cible[0])
  sortie.cible[1] = m(a.cible[1], b.cible[1])
  sortie.cible[2] = m(a.cible[2], b.cible[2])
  sortie.lacet = m(a.lacet, b.lacet)
  sortie.tangage = m(a.tangage, b.tangage)
  // La taille du cadre varie en logarithme : zoom régulier, sans accélération en fin de plongée
  sortie.largeur = Math.exp(m(Math.log(a.largeur), Math.log(b.largeur)))
  sortie.hauteur = Math.exp(m(Math.log(a.hauteur), Math.log(b.hauteur)))
  return sortie
}

export const nouveauCadrage = (): Cadrage => ({ cible: [0, 0, 0], lacet: 0, tangage: 0, largeur: 1, hauteur: 1 })
