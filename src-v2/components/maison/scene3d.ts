import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { ROSE } from '../../../src/data/emblemes'
import { allumages, cadrage, neon, nouveauCadrage, ouverture, T_OUVERTURE, type Cadrage } from './sequence'
import * as S from './shaders'
import * as TX from './textures'

/*
  « La maison de poupée » : le restaurant en coupe, façade en deux battants qui s'ouvrent, quatre pièces
  inspirées des photos (grande salle, bar, escalier vert, salle aux citrons). Évocation, pas plan exact.

  Fluidité : géométries fusionnées par matière (une quinzaine d'appels de dessin), halos en un seul appel,
  aucune ombre ni environnement calculé, textures dessinées au canevas pendant la préparation, shaders
  compilés en parallèle (compileAsync) et premier rendu à blanc avant l'affichage.
*/

export type Scene3D = {
  rendre: (temps: number) => void
  redimensionner: (largeur: number, hauteur: number) => void
  /** Image fixe de la maison ouverte et allumée (sert à produire public/images/maison-3d*.webp). */
  affiche: (largeur: number, hauteur: number, portrait?: boolean) => string
  detruire: () => void
}

type OptionsScene = {
  mobile: boolean
  largeur: number
  hauteur: number
  /** Vrai quand la scène n'est plus attendue (démontage, perte du contexte) : la préparation s'arrête. */
  abandon: () => boolean
}

const pause = (ms = 0) => new Promise<void>((resoudre) => setTimeout(resoudre, ms))

/** Couleur d'écran telle quelle (aucune conversion : les shaders travaillent en valeurs d'écran). */
const rgb = (hex: string): [number, number, number] => {
  const c = new THREE.Color().setHex(parseInt(hex.slice(1), 16), THREE.LinearSRGBColorSpace)
  return [c.r, c.g, c.b]
}

/* Pièces (indices des shaders) */
const RUE = 0
const SALLE = 1
const BAR = 2
const ESCALIER = 3
const CITRONS = 4
const STRUCTURE = 5
const LUEUR = 6

/* Dimensions (mètres) : deux travées de 6 m, deux niveaux de 3,4 m, 6 m de profondeur */
const X0 = -6
const X1 = 6
const FOND = -2.9
const AVANT = 3
const H = 3.4
const ETAGE = 3.7
const HAUT = ETAGE + H

type Finition = {
  couleur: string
  piece: number
  emission?: number
  couleur2?: string
  /** Répétition du motif (multiplie les coordonnées de texture). */
  repetition?: [number, number]
}

/** Lot de géométries d'une même matière, fusionnées en une seule à la fin (un seul appel de dessin). */
class Lot {
  private morceaux: THREE.BufferGeometry[] = []
  constructor(private readonly masque = false) {}

  ajouter(geometrie: THREE.BufferGeometry, f: Finition) {
    const g = geometrie.index ? geometrie.toNonIndexed() : geometrie
    if (g !== geometrie) geometrie.dispose()
    const n = g.getAttribute('position').count
    const remplir = (valeurs: number[]) => {
      const tableau = new Float32Array(n * valeurs.length)
      for (let i = 0; i < n; i++) tableau.set(valeurs, i * valeurs.length)
      return tableau
    }
    g.setAttribute('aCouleur', new THREE.BufferAttribute(remplir(rgb(f.couleur)), 3))
    g.setAttribute('aPiece', new THREE.BufferAttribute(remplir([f.piece]), 1))
    g.setAttribute('aEmission', new THREE.BufferAttribute(remplir([f.emission ?? 0]), 1))
    if (this.masque) g.setAttribute('aCouleur2', new THREE.BufferAttribute(remplir(rgb(f.couleur2 ?? f.couleur)), 3))
    if (f.repetition) {
      const uv = g.getAttribute('uv') as THREE.BufferAttribute
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * f.repetition[0], uv.getY(i) * f.repetition[1])
    }
    this.morceaux.push(g)
    return this
  }

  get vide() {
    return this.morceaux.length === 0
  }

  fusionner() {
    const g = mergeGeometries(this.morceaux)
    this.morceaux.forEach((m) => m.dispose())
    this.morceaux = []
    if (!g) throw new Error('Fusion des géométries impossible')
    g.computeBoundingSphere()
    return g
  }
}

/* Petites formes utilitaires */

const boite = (l: number, h: number, p: number, x: number, y: number, z: number) =>
  new THREE.BoxGeometry(l, h, p).translate(x, y, z)

const cylindre = (rh: number, rb: number, h: number, x: number, y: number, z: number, segments = 14) =>
  new THREE.CylinderGeometry(rh, rb, h, segments).translate(x, y, z)

/** Nappe de guéridon qui tombe jusqu'au sol en plis (rayon qui ondule, plus ample vers le bas). */
function nappePlissee() {
  const g = new THREE.CylinderGeometry(0.36, 0.44, 0.74, 48, 3, true).translate(0, 0.37, 0)
  const p = g.getAttribute('position') as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    const angle = Math.atan2(z, x)
    const bas = 1 - y / 0.74
    const r = Math.hypot(x, z) * (1 + Math.sin(angle * 9) * 0.07 * bas * bas)
    p.setXYZ(i, Math.cos(angle) * r, y, Math.sin(angle) * r)
  }
  g.computeVertexNormals()
  return g
}

/** Plan tourné vers l'intérieur d'une pièce : 'sol', 'plafond', 'fond', 'gauche', 'droite'. */
function paroi(type: 'sol' | 'plafond' | 'fond' | 'gauche' | 'droite', xa: number, xb: number, ya: number, yb: number) {
  const e = 0.004
  const l = xb - xa
  const h = yb - ya
  const p = AVANT - FOND
  const zc = (AVANT + FOND) / 2
  switch (type) {
    case 'sol':
      return new THREE.PlaneGeometry(l, p).rotateX(-Math.PI / 2).translate((xa + xb) / 2, ya + e, zc)
    case 'plafond':
      return new THREE.PlaneGeometry(l, p).rotateX(Math.PI / 2).translate((xa + xb) / 2, yb - e, zc)
    case 'fond':
      return new THREE.PlaneGeometry(l, h).translate((xa + xb) / 2, (ya + yb) / 2, FOND + e)
    case 'gauche':
      return new THREE.PlaneGeometry(p, h).rotateY(Math.PI / 2).translate(xa + e, (ya + yb) / 2, zc)
    case 'droite':
      return new THREE.PlaneGeometry(p, h).rotateY(-Math.PI / 2).translate(xb - e, (ya + yb) / 2, zc)
  }
}

/** Contour d'une arche (rectangle surmonté d'un demi-cercle), pour percer la façade. */
function arche(cx: number, bas: number, largeur: number, naissance: number) {
  const r = largeur / 2
  const p = new THREE.Path()
  p.moveTo(cx - r, bas)
  p.lineTo(cx + r, bas)
  p.lineTo(cx + r, naissance)
  p.absarc(cx, naissance, r, 0, Math.PI, false)
  p.lineTo(cx - r, bas)
  return p
}

type Ouverture = { cx: number; bas: number; largeur: number; naissance: number; piece: number; porte?: boolean }

/**
 * Un battant de façade (pierre percée d'arches) avec ses vitrages. Coordonnées locales : x de 0 à 6,05
 * depuis la charnière ; le battant droit est le même, retourné en miroir.
 */
function battant(ouvertures: Ouverture[], pierre: Lot, uni: Lot) {
  const L = 6.05
  const forme = new THREE.Shape()
  forme.moveTo(0, 0)
  forme.lineTo(L, 0)
  forme.lineTo(L, HAUT)
  forme.lineTo(0, HAUT)
  forme.lineTo(0, 0)
  for (const o of ouvertures) forme.holes.push(arche(o.cx, o.bas, o.largeur, o.naissance))
  const facade = new THREE.ExtrudeGeometry(forme, { depth: 0.3, bevelEnabled: false, curveSegments: 18 })
  // Bandeaux de pierre plus claire : soubassement et corniche entre les étages
  const pierreClaire = { couleur: '#e3d2b1', couleur2: '#b89c77', piece: RUE, repetition: [0.62, 0.62] as [number, number] }
  pierre.ajouter(facade, { couleur: '#d6c29e', couleur2: '#a98d68', piece: RUE, repetition: [0.62, 0.62] })
  pierre.ajouter(boite(L, 0.28, 0.14, L / 2, H + 0.12, 0.36), pierreClaire)
  pierre.ajouter(boite(L, 0.36, 0.1, L / 2, 0.18, 0.34), { ...pierreClaire, couleur: '#c9b28c' })

  for (const o of ouvertures) {
    const r = o.largeur / 2
    const hauteur = o.naissance - o.bas + r
    // Vitrage chaud, en retrait dans l'épaisseur : la pierre masque les coins au-dessus de l'arc
    uni.ajouter(new THREE.PlaneGeometry(o.largeur, hauteur).translate(o.cx, o.bas + hauteur / 2, 0.12), {
      couleur: o.porte ? '#f0b86a' : '#f2c27a',
      piece: o.piece,
      emission: 0.85,
    })
    // Petits bois (croisillons) en vert sombre
    const bois = { couleur: '#23392f', piece: RUE }
    uni.ajouter(boite(0.06, hauteur, 0.06, o.cx, o.bas + hauteur / 2, 0.16), bois)
    uni.ajouter(boite(o.largeur, 0.06, 0.06, o.cx, o.naissance, 0.16), bois)
    if (o.porte) {
      uni.ajouter(boite(o.largeur, 0.08, 0.3, o.cx, o.bas - 0.04, 0.15), { couleur: '#2e6a4f', piece: RUE })
    }
  }
}

/**
 * Construit la scène par étapes, en rendant la main au navigateur entre chacune, puis compile tous les
 * shaders en parallèle (KHR_parallel_shader_compile) avant de la livrer : aucun blocage pendant le défilement.
 */
export async function creerScene(canvas: HTMLCanvasElement, options: OptionsScene): Promise<Scene3D> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  // Au-delà de 1,5 le gain visuel est faible et le coût GPU double ; la définition baisse encore si l'appareil peine
  const ratioMax = Math.min(window.devicePixelRatio, options.mobile ? 1.5 : 1.75)
  const ratioMin = Math.min(1, ratioMax) * 0.6
  let ratio = ratioMax
  renderer.setPixelRatio(ratio)
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping

  const aJeter: Array<{ dispose: () => void }> = []
  const garder = <T extends { dispose: () => void }>(o: T) => {
    aJeter.push(o)
    return o
  }
  const detruire = () => {
    aJeter.forEach((o) => o.dispose())
    renderer.dispose()
  }
  const etape = async (ms = 0) => {
    await pause(ms)
    if (options.abandon()) {
      detruire()
      throw new Error('Préparation de la scène 3D abandonnée')
    }
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(options.mobile ? 34 : 30, 1, 0.3, 200)

  /* Textures dessinées au canevas */
  const tx = {
    citrons: garder(TX.textureCitrons()),
    rayures: garder(TX.masqueRayures()),
    lignes: garder(TX.masqueLignes()),
    pierre: garder(TX.masquePierre()),
    briques: garder(TX.masqueBriques()),
    grille: garder(TX.masqueGrille()),
    bouteilles: garder(TX.textureBouteilles()),
    boite: garder(TX.textureBoite()),
    socle: garder(TX.textureSocle()),
    haloRose: garder(TX.textureHaloRose()),
    fond: garder(TX.textureFond()),
  }
  scene.background = tx.fond
  await etape()

  /* Matières (uniforms partagés : une mise à jour suffit pour toutes) */
  const commun = {
    uAllumage: { value: new Array<number>(S.NB_PIECES).fill(0.5) },
    uDirection: { value: new THREE.Vector3(-0.45, 0.75, 0.5).normalize() },
    uLueurFacade: { value: 0 },
    uRepetition: { value: new THREE.Vector2(1, 1) },
    uTemps: { value: 0 },
  }
  const matiere = (defines: Record<string, string>, carte?: THREE.Texture, reglages: Partial<THREE.ShaderMaterialParameters> = {}) =>
    garder(
      new THREE.ShaderMaterial({
        uniforms: { ...commun, ...(carte ? { uCarte: { value: carte } } : {}) },
        vertexShader: S.surfaceVertex,
        fragmentShader: S.surfaceFragment,
        defines,
        ...reglages,
      }),
    )
  const matUni = matiere({})
  const matCitrons = matiere({ IMAGE: '' }, tx.citrons)
  const matBouteilles = matiere({ IMAGE: '' }, tx.bouteilles)
  const matBoite = matiere({ IMAGE: '' }, tx.boite)
  const matSocle = matiere({ IMAGE: '' }, tx.socle)
  const matRayures = matiere({ MASQUE: '' }, tx.rayures)
  const matLignes = matiere({ MASQUE: '' }, tx.lignes)
  const matBriques = matiere({ MASQUE: '' }, tx.briques)
  const matGrille = matiere({ MASQUE: '' }, tx.grille)
  const matPierre = matiere({ MASQUE: '', FACADE: '' }, tx.pierre)

  const uni = new Lot()
  const citrons = new Lot()
  const rayures = new Lot(true)
  const lignes = new Lot(true)
  const briques = new Lot(true)
  const grille = new Lot(true)
  const pierre = new Lot(true)
  const bouteilles = new Lot()
  const boiteLot = new Lot()
  const socleLot = new Lot()

  type Halo = { position: [number, number, number]; taille: number; teinte: string; force?: number; piece: number }
  const halos: Halo[] = []

  /* Gros œuvre : murs, dalles, toit, socle (structure crème, pierre à l'extérieur) */
  const platre = { couleur: '#eadfc9', piece: STRUCTURE }
  uni.ajouter(boite(0.2, HAUT + 0.3, 6.2, X0, (HAUT + 0.3) / 2, 0.05), platre)
  uni.ajouter(boite(0.2, HAUT + 0.3, 6.2, X1, (HAUT + 0.3) / 2, 0.05), platre)
  uni.ajouter(boite(0.2, HAUT, 5.9, 0, HAUT / 2, 0.05), platre)
  uni.ajouter(boite(12.2, HAUT + 0.3, 0.2, 0, (HAUT + 0.3) / 2, -3.0), platre)
  uni.ajouter(boite(12.2, 0.3, 6.2, 0, H + 0.15, 0.05), platre)
  for (const x of [X0 - 0.101, X1 + 0.101]) {
    pierre.ajouter(
      new THREE.PlaneGeometry(6.2, HAUT + 0.3).rotateY(x < 0 ? -Math.PI / 2 : Math.PI / 2).translate(x, (HAUT + 0.3) / 2, 0.05),
      { couleur: '#cdb892', couleur2: '#a58965', piece: RUE, repetition: [3.8, 4.6] },
    )
  }
  // Corniche, toit à la Mansart en ardoise, lucarnes éclairées, cheminée
  uni.ajouter(boite(12.7, 0.34, 6.9, 0, HAUT + 0.17, 0.1), { couleur: '#e6d7bb', piece: STRUCTURE })
  const profilToit = new THREE.Shape()
  profilToit.moveTo(-3.25, 0)
  profilToit.lineTo(3.35, 0)
  profilToit.lineTo(2.1, 1.25)
  profilToit.lineTo(-2.4, 1.25)
  profilToit.lineTo(-3.25, 0)
  uni.ajouter(
    new THREE.ExtrudeGeometry(profilToit, { depth: 12.3, bevelEnabled: false })
      .rotateY(-Math.PI / 2)
      .translate(6.15, HAUT + 0.34, 0),
    { couleur: '#3d4150', piece: STRUCTURE },
  )
  for (const x of [-3.6, 0, 3.6]) {
    uni.ajouter(boite(1.05, 1.0, 0.8, x, HAUT + 0.95, 2.55), { couleur: '#e6d7bb', piece: STRUCTURE })
    uni.ajouter(boite(1.25, 0.12, 0.95, x, HAUT + 1.5, 2.6), { couleur: '#3d4150', piece: STRUCTURE })
    uni.ajouter(new THREE.PlaneGeometry(0.6, 0.62).translate(x, HAUT + 0.93, 2.96), { couleur: '#f2c27a', piece: STRUCTURE, emission: 0.8 })
    halos.push({ position: [x, HAUT + 0.95, 3.1], taille: 1.1, teinte: '#ffb866', force: 0.45, piece: STRUCTURE })
  }
  uni.ajouter(boite(0.7, 1.4, 0.7, 4.2, HAUT + 1.3, -1.6), { couleur: '#8a3a2c', piece: STRUCTURE })

  // Socle bordeaux, filet framboise, devanture au logo, ombre
  uni.ajouter(boite(13.2, 0.5, 7.8, 0, -0.25, 0.5), { couleur: '#3a0c1a', piece: STRUCTURE })
  uni.ajouter(boite(13.24, 0.05, 7.84, 0, -0.03, 0.5), { couleur: '#c90050', piece: STRUCTURE })
  socleLot.ajouter(new THREE.PlaneGeometry(13.2, 0.48).translate(0, -0.27, 4.402), { couleur: '#ffffff', piece: STRUCTURE, emission: 0.25 })
  // Marches vertes devant la porte (fixes, sur le socle)
  for (let i = 0; i < 2; i++) {
    uni.ajouter(boite(1.9, 0.18 * (2 - i), 0.34, 1.8, 0.09 * (2 - i), 3.5 + i * 0.34), { couleur: i ? '#2a6149' : '#2f6b50', piece: RUE })
  }
  await etape()

  /* Grande salle (rez-de-chaussée, à gauche) : longue table, banquette rayée, statues rose saumon, plafond en miroirs */
  {
    const xa = X0 + 0.1
    const xb = -0.1
    uni.ajouter(paroi('sol', xa, xb, 0, H), { couleur: '#6e2a22', piece: SALLE })
    uni.ajouter(paroi('fond', xa, xb, 0, H), { couleur: '#4b1524', piece: SALLE })
    uni.ajouter(paroi('gauche', xa, xb, 0, H), { couleur: '#4b1524', piece: SALLE })
    uni.ajouter(paroi('droite', xa, xb, 0, H), { couleur: '#4b1524', piece: SALLE })
    grille.ajouter(paroi('plafond', xa, xb, 0, H), { couleur: '#6d7688', couleur2: '#2a2f3a', piece: SALLE, emission: 0.25, repetition: [9, 9] })
    // Banquette rayée rouge et vert le long du mur du fond
    const rayure = { couleur: '#b3262e', couleur2: '#1f5a44', piece: SALLE }
    rayures.ajouter(boite(5.6, 0.42, 0.55, -3, 0.21, -2.6), { ...rayure, repetition: [16, 1] })
    rayures.ajouter(boite(5.6, 0.62, 0.14, -3, 0.73, -2.82), { ...rayure, repetition: [16, 1] })
    // Étagères de statues
    for (const y of [1.55, 2.45]) uni.ajouter(boite(5.6, 0.05, 0.36, -3, y, -2.72), { couleur: '#efe3cc', piece: SALLE })
    const saumon = { couleur: '#e7a08a', piece: SALLE }
    const buste = (x: number, y: number) => {
      uni.ajouter(boite(0.2, 0.12, 0.2, x, y + 0.06, -2.72), { couleur: '#f1e6d2', piece: SALLE })
      uni.ajouter(cylindre(0.09, 0.14, 0.3, x, y + 0.27, -2.72), saumon)
      uni.ajouter(new THREE.SphereGeometry(0.085, 12, 10).translate(x, y + 0.5, -2.72), saumon)
    }
    ;[-5.3, -4.1, -2.9, -1.7, -0.6].forEach((x) => buste(x, 1.575))
    ;[-4.7, -3.5, -2.3, -1.1].forEach((x) => buste(x, 2.475))
    // Fenêtres cintrées sur le mur de gauche (nuit bleutée)
    for (const z of [-1.2, 1.3]) {
      uni.ajouter(new THREE.PlaneGeometry(1.1, 1.5).rotateY(Math.PI / 2).translate(xa + 0.01, 1.55, z), { couleur: '#2c3d63', piece: SALLE, emission: 0.35 })
      uni.ajouter(
        new THREE.CircleGeometry(0.55, 16, 0, Math.PI).rotateY(Math.PI / 2).translate(xa + 0.01, 2.3, z),
        { couleur: '#2c3d63', piece: SALLE, emission: 0.35 },
      )
    }
    // Abat-jour rouges au mur de gauche
    for (const z of [-2.1, 0.05, 2.2]) {
      uni.ajouter(cylindre(0.09, 0.17, 0.24, xa + 0.2, 2.2, z), { couleur: '#d8404b', piece: SALLE, emission: 0.7 })
      halos.push({ position: [xa + 0.3, 2.15, z], taille: 1.2, teinte: '#ff4a55', force: 0.55, piece: SALLE })
    }
    // Longue table nappée de blanc, assiettes, chaises blanches
    uni.ajouter(boite(4.6, 0.06, 1.1, -3, 0.77, 0.1), { couleur: '#f4efe6', piece: SALLE })
    uni.ajouter(boite(4.68, 0.46, 1.16, -3, 0.52, 0.1), { couleur: '#e6ddcf', piece: SALLE })
    const blanc = { couleur: '#f2eee6', piece: SALLE }
    for (const x of [-4.8, -3.9, -3.0, -2.1, -1.2]) {
      for (const [z, sens] of [[-0.72, 1]] as const) {
        uni.ajouter(cylindre(0.2, 0.2, 0.06, x, 0.47, z, 12), blanc)
        uni.ajouter(cylindre(0.025, 0.025, 0.45, x, 0.22, z, 6), blanc)
        uni.ajouter(
          new THREE.TorusGeometry(0.18, 0.025, 6, 14, Math.PI).translate(x, 0.5, z - sens * 0.17),
          blanc,
        )
        uni.ajouter(cylindre(0.13, 0.13, 0.015, x, 0.81, z * 0.45 + 0.1 * (1 - Math.abs(sens)), 16), { couleur: '#ffffff', piece: SALLE })
      }
    }
    // Suspensions blanches et leur reflet dans le plafond en miroirs
    for (const x of [-4.4, -3.0, -1.6]) {
      uni.ajouter(cylindre(0.012, 0.012, 0.8, x, H - 0.4, 0.1, 5), { couleur: '#2a1a16', piece: SALLE })
      uni.ajouter(new THREE.SphereGeometry(0.16, 16, 12).translate(x, H - 0.85, 0.1), { couleur: '#fff4de', piece: SALLE, emission: 1 })
      halos.push({ position: [x, H - 0.85, 0.2], taille: 1.5, teinte: '#ffd08a', force: 0.7, piece: SALLE })
      halos.push({ position: [x, H - 0.03, 0.1], taille: 1.0, teinte: '#ffcf8a', force: 0.25, piece: SALLE })
    }
    for (const x of [-4.2, -2.6, -1.8]) halos.push({ position: [x, 0.88, 0.1], taille: 0.4, teinte: '#ffc46b', force: 0.7, piece: SALLE })
  }
  await etape()

  /* Bar (rez-de-chaussée, à droite) : sol vert à lignes blanches, comptoir, tabourets saumon, store rayé, bouteilles */
  {
    const xa = 0.1
    const xb = X1 - 0.1
    lignes.ajouter(paroi('sol', xa, xb, 0, H), { couleur: '#1f5a44', couleur2: '#efe6d4', piece: BAR, repetition: [4.8, 5] })
    uni.ajouter(paroi('fond', xa, xb, 0, H), { couleur: '#1d4a3a', piece: BAR })
    uni.ajouter(paroi('gauche', xa, xb, 0, H), { couleur: '#1d4a3a', piece: BAR })
    uni.ajouter(paroi('droite', xa, xb, 0, H), { couleur: '#1d4a3a', piece: BAR })
    uni.ajouter(paroi('plafond', xa, xb, 0, H), { couleur: '#2a1d18', piece: BAR })
    // Médaillon blanc sur le mur de droite (tête sculptée des colonnes vertes)
    uni.ajouter(new THREE.CircleGeometry(0.34, 24).rotateY(-Math.PI / 2).translate(xb - 0.01, 2.2, 0.3), { couleur: '#efe6d6', piece: BAR })
    // Étagères de bouteilles rétroéclairées
    bouteilles.ajouter(new THREE.PlaneGeometry(4.2, 1.6).translate(3, 2.05, FOND + 0.02), { couleur: '#ffffff', piece: BAR, emission: 0.95 })
    halos.push({ position: [3, 2.05, FOND + 0.4], taille: 4.2, teinte: '#ffb35c', force: 0.3, piece: BAR })
    uni.ajouter(boite(4.4, 0.9, 0.45, 3, 0.45, -2.65), { couleur: '#173f31', piece: BAR })
    // Comptoir : caisson brique, plateau de marbre, filet lumineux
    uni.ajouter(boite(4.8, 1.05, 0.7, 3, 0.525, -1.55), { couleur: '#7a2b25', piece: BAR })
    uni.ajouter(boite(5.0, 0.07, 0.86, 3, 1.085, -1.55), { couleur: '#efe8dc', piece: BAR })
    uni.ajouter(boite(4.8, 0.03, 0.02, 3, 1.02, -1.19), { couleur: '#ffd89a', piece: BAR, emission: 1 })
    for (const x of [1.2, 2.4, 3.6, 4.8]) halos.push({ position: [x, 1.0, -1.1], taille: 1.1, teinte: '#ffb866', force: 0.5, piece: BAR })
    // Tabourets rose saumon sur pied chromé
    for (const x of [1.1, 1.85, 2.6, 3.35, 4.1, 4.85]) {
      uni.ajouter(cylindre(0.2, 0.2, 0.04, x, 0.02, -0.72, 16), { couleur: '#b9b6b0', piece: BAR })
      uni.ajouter(cylindre(0.045, 0.045, 0.74, x, 0.39, -0.72, 8), { couleur: '#e39a78', piece: BAR })
      uni.ajouter(new THREE.TorusGeometry(0.19, 0.018, 6, 20).rotateX(Math.PI / 2).translate(x, 0.32, -0.72), { couleur: '#cfcfcf', piece: BAR })
      uni.ajouter(cylindre(0.23, 0.21, 0.12, x, 0.8, -0.72, 18), { couleur: '#eba27f', piece: BAR })
    }
    // Store rayé rouge et blanc au-dessus du comptoir, lambrequin festonné
    const pente = Math.atan2(0.7, 1.4)
    rayures.ajouter(
      new THREE.PlaneGeometry(5.6, Math.hypot(0.7, 1.4))
        .rotateX(-(Math.PI / 2 - pente))
        .translate(3, 2.9, -2.2),
      { couleur: '#f3ede2', couleur2: '#c9262f', piece: BAR, repetition: [20, 1] },
    )
    for (let i = 0; i < 20; i++) {
      const x = 0.2 + 0.14 + i * 0.28
      uni.ajouter(new THREE.CircleGeometry(0.14, 12, Math.PI, Math.PI).translate(x, 2.55, -1.49), {
        couleur: i % 2 ? '#c9262f' : '#f3ede2',
        piece: BAR,
      })
    }
    // Suspensions
    for (const x of [1.8, 4.2]) {
      uni.ajouter(cylindre(0.012, 0.012, 0.9, x, H - 0.45, -0.1, 5), { couleur: '#2a1a16', piece: BAR })
      uni.ajouter(cylindre(0.08, 0.2, 0.18, x, H - 0.98, -0.1, 16), { couleur: '#c9262f', piece: BAR, emission: 0.5 })
      halos.push({ position: [x, H - 1.1, 0], taille: 1.3, teinte: '#ffc27a', force: 0.6, piece: BAR })
    }
  }
  await etape()

  /* Escalier vert (étage, à droite) : briques vertes, papier peint aux citrons, marches vertes, globes */
  {
    const xa = 0.1
    const xb = X1 - 0.1
    uni.ajouter(paroi('sol', xa, xb, ETAGE, HAUT), { couleur: '#23533f', piece: ESCALIER })
    briques.ajouter(paroi('fond', xa, xb, ETAGE, HAUT), { couleur: '#2a654c', couleur2: '#163a2c', piece: ESCALIER, repetition: [5, 3] })
    briques.ajouter(paroi('droite', xa, xb, ETAGE, HAUT), { couleur: '#2a654c', couleur2: '#163a2c', piece: ESCALIER, repetition: [5, 3] })
    citrons.ajouter(paroi('gauche', xa, xb, ETAGE, HAUT), { couleur: '#ffffff', piece: ESCALIER, repetition: [3, 2] })
    uni.ajouter(paroi('plafond', xa, xb, ETAGE, HAUT), { couleur: '#163a2d', piece: ESCALIER })
    for (let i = 0; i < 11; i++) {
      const h = (i + 1) * 0.28
      uni.ajouter(boite(0.4, h, 1.5, 1.1 + i * 0.4, ETAGE + h / 2, -2.1), { couleur: '#2e6f53', piece: ESCALIER })
      uni.ajouter(boite(0.42, 0.03, 1.52, 1.1 + i * 0.4, ETAGE + h + 0.015, -2.1), { couleur: '#3f8565', piece: ESCALIER })
    }
    // Main courante en laiton
    const debut = new THREE.Vector3(0.9, ETAGE + 1.1, -1.3)
    const fin = new THREE.Vector3(5.3, ETAGE + 4.2, -1.3)
    const longueur = debut.distanceTo(fin)
    uni.ajouter(
      new THREE.CylinderGeometry(0.025, 0.025, longueur, 6)
        .rotateZ(-Math.atan2(fin.x - debut.x, fin.y - debut.y))
        .translate((debut.x + fin.x) / 2, (debut.y + fin.y) / 2, -1.3),
      { couleur: '#c9a15a', piece: ESCALIER },
    )
    // Globes muraux
    for (const [x, y] of [
      [1.5, ETAGE + 1.9],
      [4.4, ETAGE + 2.7],
    ]) {
      uni.ajouter(new THREE.SphereGeometry(0.14, 16, 12).translate(x, y, FOND + 0.2), { couleur: '#fff1d8', piece: ESCALIER, emission: 1 })
      halos.push({ position: [x, y, FOND + 0.35], taille: 1.5, teinte: '#ffcf8a', force: 0.65, piece: ESCALIER })
    }
    // Plante verte en bas de l'escalier
    uni.ajouter(cylindre(0.2, 0.16, 0.4, 0.7, ETAGE + 0.2, 1.8), { couleur: '#b5563f', piece: ESCALIER })
    uni.ajouter(new THREE.IcosahedronGeometry(0.45, 1).scale(1, 1.3, 1).translate(0.7, ETAGE + 0.85, 1.8), { couleur: '#3e7d4f', piece: ESCALIER })
  }
  await etape()

  /* Salle aux citrons (étage, à gauche) : citrons du sol au plafond, guéridons nappés, bras qui tiennent les lampes */
  const TABLE = new THREE.Vector3(-2.2, ETAGE, 1.25)
  {
    const xa = X0 + 0.1
    const xb = -0.1
    citrons.ajouter(paroi('sol', xa, xb, ETAGE, HAUT), { couleur: '#a9a39a', piece: CITRONS, repetition: [4, 4] })
    citrons.ajouter(paroi('fond', xa, xb, ETAGE, HAUT), { couleur: '#ffffff', piece: CITRONS, repetition: [4, 2.4] })
    citrons.ajouter(paroi('gauche', xa, xb, ETAGE, HAUT), { couleur: '#ffffff', piece: CITRONS, repetition: [4, 2.4] })
    citrons.ajouter(paroi('droite', xa, xb, ETAGE, HAUT), { couleur: '#ffffff', piece: CITRONS, repetition: [4, 2.4] })
    uni.ajouter(paroi('plafond', xa, xb, ETAGE, HAUT), { couleur: '#18261f', piece: CITRONS })
    // Banquettes en L au même motif
    const banquette = { couleur: '#d8d2c6', piece: CITRONS, repetition: [3, 0.5] as [number, number] }
    citrons.ajouter(boite(5.6, 0.42, 0.55, -3, ETAGE + 0.21, -2.6), banquette)
    citrons.ajouter(boite(5.6, 0.56, 0.12, -3, ETAGE + 0.7, -2.83), banquette)
    citrons.ajouter(boite(0.55, 0.42, 4.4, X0 + 0.38, ETAGE + 0.21, -0.1), { ...banquette, repetition: [0.5, 3] })
    citrons.ajouter(boite(0.12, 0.56, 4.4, X0 + 0.16, ETAGE + 0.7, -0.1), { ...banquette, repetition: [0.5, 3] })
    // Guéridons nappés de blanc et bougies
    const nappe = { couleur: '#f4efe6', piece: CITRONS }
    const gueridon = (x: number, z: number) => {
      uni.ajouter(nappePlissee().translate(x, ETAGE, z), nappe)
      uni.ajouter(cylindre(0.36, 0.36, 0.03, x, ETAGE + 0.745, z, 28), { couleur: '#fbf8f2', piece: CITRONS })
    }
    const places: Array<[number, number]> = [
      [-4.7, -1.85],
      [-3.4, -1.85],
      [-2.1, -1.85],
      [-0.85, -1.85],
      [-4.95, -0.3],
      [-4.95, 1.2],
      [TABLE.x, TABLE.z],
    ]
    places.forEach(([x, z]) => {
      gueridon(x, z)
      halos.push({ position: [x + 0.1, ETAGE + 0.86, z], taille: 0.42, teinte: '#ffc46b', force: 0.75, piece: CITRONS })
    })
    // Petits tabourets ambrés autour des tables de devant
    for (const [x, z] of [
      [-2.85, 1.6],
      [-1.55, 1.55],
      [-4.3, 1.55],
      [-4.3, -0.05],
    ]) {
      uni.ajouter(cylindre(0.17, 0.15, 0.44, x, ETAGE + 0.22, z, 14), { couleur: '#b7663a', piece: CITRONS })
    }
    // La table dressée de la fin : la boîte à pizza de Gigi et deux verres
    boiteLot.ajouter(boite(0.46, 0.05, 0.46, 0, 0, 0).rotateY(0.35).translate(TABLE.x - 0.05, ETAGE + 0.795, TABLE.z), { couleur: '#ffffff', piece: CITRONS })
    for (const dx of [0.2, -0.24]) {
      uni.ajouter(cylindre(0.035, 0.03, 0.12, TABLE.x + dx, ETAGE + 0.83, TABLE.z + 0.22, 10), { couleur: '#e8eef0', piece: CITRONS, emission: 0.3 })
    }
    // Bras sculptés qui tiennent des lampes aux abat-jour rouges
    for (const x of [-4.6, -2.8, -1.0]) {
      const bras = new THREE.CylinderGeometry(0.045, 0.06, 0.62, 8).rotateX(0.95).translate(x, ETAGE + 2.15, FOND + 0.3)
      uni.ajouter(bras, { couleur: '#efe0d2', piece: CITRONS })
      uni.ajouter(new THREE.SphereGeometry(0.07, 10, 8).translate(x, ETAGE + 2.35, FOND + 0.52), { couleur: '#efe0d2', piece: CITRONS })
      uni.ajouter(cylindre(0.09, 0.16, 0.24, x, ETAGE + 2.52, FOND + 0.56), { couleur: '#d8404b', piece: CITRONS, emission: 0.75 })
      halos.push({ position: [x, ETAGE + 2.5, FOND + 0.75], taille: 1.35, teinte: '#ff505a', force: 0.6, piece: CITRONS })
    }
  }
  await etape()

  /* Façade en deux battants : pierre, arches, vitrages, roses en néon */
  const battantGauche = new THREE.Group()
  const battantDroit = new THREE.Group()
  battantGauche.position.set(X0 - 0.05, 0, AVANT)
  battantDroit.position.set(X1 + 0.05, 0, AVANT)
  const lotsBattants = [0, 1].map(() => ({ pierre: new Lot(true), uni: new Lot() }))
  // Battant gauche (du côté de la grande salle et de la salle aux citrons), coordonnées depuis la charnière
  battant(
    [
      { cx: 1.75, bas: 0.4, largeur: 1.7, naissance: 2.2, piece: SALLE },
      { cx: 4.25, bas: 0.4, largeur: 1.7, naissance: 2.2, piece: SALLE },
      { cx: 1.75, bas: 4.15, largeur: 1.3, naissance: 5.85, piece: CITRONS },
      { cx: 4.25, bas: 4.15, largeur: 1.3, naissance: 5.85, piece: CITRONS },
    ],
    lotsBattants[0].pierre,
    lotsBattants[0].uni,
  )
  // Battant droit, construit comme le gauche puis retourné : la porte d'entrée est du côté du centre
  battant(
    [
      { cx: 1.75, bas: 0.4, largeur: 1.7, naissance: 2.2, piece: BAR },
      { cx: 4.25, bas: 0.36, largeur: 1.8, naissance: 2.3, piece: BAR, porte: true },
      { cx: 1.75, bas: 4.15, largeur: 1.3, naissance: 5.85, piece: ESCALIER },
      { cx: 4.25, bas: 4.15, largeur: 1.3, naissance: 5.85, piece: ESCALIER },
    ],
    lotsBattants[1].pierre,
    lotsBattants[1].uni,
  )
  // Roses en néon : le tracé vectoriel de la rose de la carte en tube lumineux, et son halo
  const matNeon = garder(
    new THREE.ShaderMaterial({
      uniforms: { uCarte: { value: tx.haloRose }, uNeon: { value: 0 } },
      vertexShader: S.neonVertex,
      fragmentShader: S.neonFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const matTube = garder(
    new THREE.ShaderMaterial({
      uniforms: { uNeon: matNeon.uniforms.uNeon },
      vertexShader: S.neonVertex,
      fragmentShader: S.tubeFragment,
      side: THREE.DoubleSide,
    }),
  )
  const TAILLE_ROSE = 1.32
  const tubeRose = (() => {
    const svg = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${ROSE.d}"/></svg>`)
    const formes = svg.paths.flatMap((p) => p.toShapes())
    const k = TAILLE_ROSE / ROSE.largeur
    return garder(new THREE.ShapeGeometry(formes, 6).translate(-ROSE.largeur / 2, -ROSE.hauteur / 2, 0).scale(k, -k, 1))
  })()
  const planHalo = garder(new THREE.PlaneGeometry(TAILLE_ROSE * 1.62, TAILLE_ROSE * 1.62))
  ;[battantGauche, battantDroit].forEach((groupe, i) => {
    const { pierre: lp, uni: lu } = lotsBattants[i]
    const mPierre = new THREE.Mesh(garder(lp.fusionner()), matPierre)
    const mUni = new THREE.Mesh(garder(lu.fusionner()), matUni)
    const contenu = new THREE.Group()
    contenu.add(mPierre, mUni)
    // Enseigne sur potence entre les arches du rez-de-chaussée, légèrement tournée comme sur la façade
    const potence = new THREE.Mesh(garder(new THREE.BoxGeometry(0.05, 0.05, 0.5).translate(3.0, 3.18, 0.52)), matTube)
    const enseigne = new THREE.Group()
    enseigne.position.set(3.0, 2.68, 0.74)
    enseigne.rotation.y = -0.32
    const tube = new THREE.Mesh(tubeRose, matTube)
    const halo = new THREE.Mesh(planHalo, matNeon)
    halo.position.z = -0.02
    halo.renderOrder = 10
    enseigne.add(tube, halo)
    contenu.add(potence, enseigne)
    if (i === 1) {
      // Miroir : le battant droit s'étend à gauche de sa charnière ; la rose garde son sens de lecture
      contenu.scale.x = -1
      enseigne.scale.x = -1
    }
    groupe.add(contenu)
    scene.add(groupe)
  })
  // Lueur rouge des néons sur le trottoir et le bas de la façade (s'éteint quand la façade s'ouvre)
  halos.push({ position: [-3.05, 1.6, AVANT + 1.4], taille: 6.5, teinte: '#b0123e', force: 0.55, piece: LUEUR })
  halos.push({ position: [3.05, 1.6, AVANT + 1.4], taille: 6.5, teinte: '#b0123e', force: 0.55, piece: LUEUR })
  halos.push({ position: [-3.05, 2.62, AVANT + 0.85], taille: 2.2, teinte: '#ff2f74', force: 0.35, piece: LUEUR })
  halos.push({ position: [3.05, 2.62, AVANT + 0.85], taille: 2.2, teinte: '#ff2f74', force: 0.35, piece: LUEUR })
  await etape()

  /* Fusion des lots statiques : un maillage par matière */
  const lots: Array<[Lot, THREE.ShaderMaterial]> = [
    [uni, matUni],
    [citrons, matCitrons],
    [rayures, matRayures],
    [lignes, matLignes],
    [briques, matBriques],
    [grille, matGrille],
    [pierre, matPierre],
    [bouteilles, matBouteilles],
    [boiteLot, matBoite],
    [socleLot, matSocle],
  ]
  for (const [lot, mat] of lots) if (!lot.vide) scene.add(new THREE.Mesh(garder(lot.fusionner()), mat))

  // Ombre douce sous le socle
  const ombre = new THREE.Mesh(
    garder(new THREE.PlaneGeometry(22, 14).rotateX(-Math.PI / 2).translate(0, -0.52, 0.8)),
    garder(
      new THREE.ShaderMaterial({
        vertexShader: S.neonVertex,
        fragmentShader: S.ombreFragment,
        transparent: true,
        depthWrite: false,
      }),
    ),
  )
  scene.add(ombre)

  /* Halos : un seul appel de dessin pour toutes les lumières */
  const quad = new THREE.PlaneGeometry(1, 1)
  const geoHalos = garder(new THREE.InstancedBufferGeometry())
  geoHalos.index = quad.index
  geoHalos.setAttribute('position', quad.getAttribute('position'))
  geoHalos.setAttribute('uv', quad.getAttribute('uv'))
  geoHalos.instanceCount = halos.length
  geoHalos.setAttribute('aCentre', new THREE.InstancedBufferAttribute(new Float32Array(halos.flatMap((h) => h.position)), 3))
  geoHalos.setAttribute('aTaille', new THREE.InstancedBufferAttribute(new Float32Array(halos.map((h) => h.taille)), 1))
  geoHalos.setAttribute(
    'aTeinte',
    new THREE.InstancedBufferAttribute(new Float32Array(halos.flatMap((h) => rgb(h.teinte).map((v) => v * (h.force ?? 0.6)))), 3),
  )
  geoHalos.setAttribute('aPiece', new THREE.InstancedBufferAttribute(new Float32Array(halos.map((h) => h.piece)), 1))
  geoHalos.setAttribute('aPhase', new THREE.InstancedBufferAttribute(new Float32Array(halos.map((_, i) => (i * 0.618) % 1)), 1))
  const matHalos = garder(
    new THREE.ShaderMaterial({
      uniforms: { uAllumage: commun.uAllumage, uTemps: commun.uTemps },
      vertexShader: S.haloVertex,
      fragmentShader: S.haloFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const meshHalos = new THREE.Mesh(geoHalos, matHalos)
  meshHalos.frustumCulled = false
  meshHalos.renderOrder = 20
  scene.add(meshHalos)
  await etape()

  /* Cadrage : la zone utile laisse la place aux textes (à gauche sur ordinateur, en bas en portrait) */
  let largeur = 1
  let hauteur = 1
  let zone = { x0: 0.36, x1: 1, y0: 0.06, y1: 0.96 }
  const redimensionner = (l: number, h: number) => {
    largeur = Math.max(1, Math.round(l))
    hauteur = Math.max(1, Math.round(h))
    renderer.setSize(largeur, hauteur, false)
    camera.aspect = largeur / hauteur
    zone = camera.aspect < 0.95 ? { x0: 0, x1: 1, y0: 0.07, y1: 0.6 } : { x0: 0.36, x1: 1, y0: 0.06, y1: 0.96 }
    camera.updateProjectionMatrix()
  }

  const cadre: Cadrage = nouveauCadrage()
  const cible = new THREE.Vector3()
  const placerCamera = (c: Cadrage, secondes: number) => {
    const zl = (zone.x1 - zone.x0) * largeur
    const zh = (zone.y1 - zone.y0) * hauteur
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (zh / hauteur)
    const th = tv * (zl / zh)
    const distance = Math.max(c.hauteur / 2 / tv, c.largeur / 2 / th) * 1.04
    const lacet = THREE.MathUtils.degToRad(c.lacet + Math.sin(secondes * 0.35) * 0.6)
    const tangage = THREE.MathUtils.degToRad(c.tangage + Math.sin(secondes * 0.27) * 0.35)
    cible.set(c.cible[0], c.cible[1], c.cible[2])
    camera.position.set(
      cible.x + Math.sin(lacet) * Math.cos(tangage) * distance,
      cible.y + Math.sin(tangage) * distance,
      cible.z + Math.cos(lacet) * Math.cos(tangage) * distance,
    )
    camera.lookAt(cible)
    const cx = (zone.x0 + zone.x1) / 2
    const cy = (zone.y0 + zone.y1) / 2
    camera.setViewOffset(largeur, hauteur, -(cx - 0.5) * largeur, -(cy - 0.5) * hauteur, largeur, hauteur)
  }

  // Définition adaptative : si les images s'espacent trop (GPU saturé), on baisse la résolution par paliers
  const durees: number[] = []
  let derniereImage = 0
  const ajusterQualite = () => {
    const maintenant = performance.now()
    const duree = maintenant - derniereImage
    derniereImage = maintenant
    if (duree > 250) {
      durees.length = 0 // reprise après une pause du rendu
      return
    }
    durees.push(duree)
    if (durees.length < 40) return
    const mediane = durees.sort((a, b) => a - b)[20]
    durees.length = 0
    if (mediane > 22 && ratio > ratioMin) {
      ratio = Math.max(ratioMin, ratio * 0.8)
      renderer.setPixelRatio(ratio)
      renderer.setSize(largeur, hauteur, false)
    }
  }

  const origine = performance.now()
  const lumieres = commun.uAllumage.value
  const appliquer = (t: number, secondes: number) => {
    const n = neon(t, secondes)
    matNeon.uniforms.uNeon.value = n
    allumages(t, lumieres)
    const ouvert = Math.min(1, Math.max(0, (t - T_OUVERTURE[0]) / (T_OUVERTURE[1] - T_OUVERTURE[0])))
    lumieres[LUEUR] = n * (1 - ouvert)
    commun.uLueurFacade.value = n * (1 - ouvert * 0.7)
    commun.uTemps.value = secondes
    const angle = ouverture(t)
    battantGauche.rotation.y = -angle
    battantDroit.rotation.y = angle
    placerCamera(cadrage(t, cadre), secondes)
  }

  const rendre = (t: number) => {
    ajusterQualite()
    appliquer(t, (performance.now() - origine) / 1000)
    renderer.render(scene, camera)
  }

  const affiche = (l: number, h: number, portrait = false) => {
    const avant = { largeur, hauteur, ratio }
    renderer.setPixelRatio(1)
    redimensionner(l, h)
    // Portrait : même zone utile que la séquence (maison en haut, textes en bas)
    zone = portrait ? { x0: 0, x1: 1, y0: 0.07, y1: 0.6 } : { x0: 0, x1: 1, y0: 0, y1: 1 }
    appliquer(T_OUVERTURE[1] + 6, 0)
    lumieres.fill(1)
    lumieres[LUEUR] = 0
    matNeon.uniforms.uNeon.value = 1
    const c: Cadrage = { cible: [0, 4.0, 0.4], lacet: -14, tangage: 12, largeur: 19, hauteur: 12.6 }
    placerCamera(c, 0)
    renderer.render(scene, camera)
    const image = renderer.domElement.toDataURL('image/png')
    renderer.setPixelRatio(avant.ratio)
    redimensionner(avant.largeur, avant.hauteur)
    return image
  }

  redimensionner(options.largeur, options.hauteur)

  // Compilation de tous les shaders avant le premier affichage, sans bloquer la page
  appliquer(0, 0)
  await renderer.compileAsync(scene, camera)
  await etape()
  // Envoi des textures au GPU, puis premier rendu à blanc (canvas encore invisible), maison ouverte et allumée
  Object.values(tx).forEach((t) => renderer.initTexture(t))
  await etape()
  appliquer(T_OUVERTURE[1] + 6, 0)
  renderer.render(scene, camera)
  await etape()
  rendre(0)

  return { rendre, redimensionner, affiche, detruire }
}
