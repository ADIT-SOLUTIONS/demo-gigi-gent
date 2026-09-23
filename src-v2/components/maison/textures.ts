import * as THREE from 'three'
import { LOGO, ROSE } from '../../../src/data/emblemes'

/*
  Textures dessinées au canevas (aucun fichier à télécharger), d'après les photos du restaurant.
  Les couleurs sont des valeurs d'écran telles quelles : les shaders maison n'appliquent aucune conversion.
  Les « masques » sont en niveaux de gris : le shader mélange deux couleurs selon leur valeur.
*/

/** Générateur pseudo-aléatoire reproductible (même motif à chaque chargement). */
function hasard(graine: number) {
  let s = graine >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canevas(largeur: number, hauteur: number) {
  const c = document.createElement('canvas')
  c.width = largeur
  c.height = hauteur
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function texture(c: HTMLCanvasElement, repetee = true) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.NoColorSpace
  if (repetee) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}

/** Dessine un motif et ses copies décalées d'une tuile, pour un raccord sans couture. */
function raccord(taille: number, dessin: (dx: number, dy: number) => void) {
  for (const dx of [-taille, 0, taille]) for (const dy of [-taille, 0, taille]) dessin(dx, dy)
}

/** Papier peint aux citrons : fond nuit, feuillage vert, citrons jaunes (salle aux citrons, escalier). */
export function textureCitrons() {
  const T = 512
  const { c, ctx } = canevas(T, T)
  ctx.fillStyle = '#12211d'
  ctx.fillRect(0, 0, T, T)
  const r = hasard(6161)

  // Branches et feuilles
  for (let i = 0; i < 70; i++) {
    const x = r() * T
    const y = r() * T
    const angle = r() * Math.PI * 2
    const long = 20 + r() * 18
    const teinte = ['#2f5b43', '#3d6d4d', '#27493a', '#4b7a57'][Math.floor(r() * 4)]
    raccord(T, (dx, dy) => {
      ctx.save()
      ctx.translate(x + dx, y + dy)
      ctx.rotate(angle)
      ctx.fillStyle = teinte
      ctx.beginPath()
      ctx.ellipse(0, 0, long, long * 0.36, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(12, 30, 22, 0.55)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(-long * 0.85, 0)
      ctx.lineTo(long * 0.85, 0)
      ctx.stroke()
      ctx.restore()
    })
  }
  // Citrons (légèrement pointus aux deux bouts)
  for (let i = 0; i < 34; i++) {
    const x = r() * T
    const y = r() * T
    const angle = r() * Math.PI
    const l = 17 + r() * 7
    const h = l * 0.72
    const clair = r() > 0.4
    raccord(T, (dx, dy) => {
      ctx.save()
      ctx.translate(x + dx, y + dy)
      ctx.rotate(angle)
      const degrade = ctx.createRadialGradient(-l * 0.3, -h * 0.35, 1, 0, 0, l)
      degrade.addColorStop(0, clair ? '#ffe486' : '#f6cf57')
      degrade.addColorStop(0.7, clair ? '#efbd33' : '#e2a826')
      degrade.addColorStop(1, '#b97c16')
      ctx.fillStyle = degrade
      ctx.beginPath()
      ctx.moveTo(-l, 0)
      ctx.bezierCurveTo(-l * 0.7, -h, l * 0.7, -h, l, 0)
      ctx.bezierCurveTo(l * 0.7, h, -l * 0.7, h, -l, 0)
      ctx.fill()
      ctx.restore()
    })
  }
  // Petites fleurs
  for (let i = 0; i < 40; i++) {
    const x = r() * T
    const y = r() * T
    raccord(T, (dx, dy) => {
      ctx.fillStyle = '#f3dc8a'
      ctx.beginPath()
      ctx.arc(x + dx, y + dy, 2.6, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  return texture(c)
}

/** Masque de rayures (stores, banquettes) : bandes verticales. */
export function masqueRayures() {
  const { c, ctx } = canevas(64, 8)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 64, 8)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 32, 8)
  const t = texture(c)
  t.magFilter = THREE.LinearFilter
  return t
}

/** Masque du sol du bar : vert à lignes blanches, comme un terrain de sport. */
export function masqueLignes() {
  const { c, ctx } = canevas(256, 256)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 256, 7)
  ctx.fillRect(0, 128, 256, 3)
  return texture(c)
}

/** Masque de la pierre de façade : assises régulières et joints décalés. */
export function masquePierre() {
  const T = 256
  const { c, ctx } = canevas(T, T)
  const r = hasard(24)
  const rangs = 4
  const h = T / rangs
  for (let rang = 0; rang < rangs; rang++) {
    const blocs = 2
    const decalage = rang % 2 ? T / 4 : 0
    for (let b = -1; b <= blocs; b++) {
      const x = decalage + (b * T) / blocs
      const v = 25 + r() * 45
      ctx.fillStyle = `rgb(${v},${v},${v})`
      ctx.fillRect(x, rang * h, T / blocs, h)
    }
  }
  ctx.fillStyle = '#fff'
  for (let rang = 0; rang < rangs; rang++) {
    ctx.fillRect(0, rang * h, T, 3)
    const decalage = rang % 2 ? T / 4 : 0
    for (let b = 0; b <= 2; b++) ctx.fillRect((decalage + (b * T) / 2) % T, rang * h, 3, h)
  }
  return texture(c)
}

/** Masque de briques (murs de l'escalier vert). */
export function masqueBriques() {
  const { c, ctx } = canevas(128, 128)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#fff'
  const h = 16
  for (let rang = 0; rang < 8; rang++) {
    ctx.fillRect(0, rang * h, 128, 2)
    const decalage = rang % 2 ? 16 : 0
    for (let x = decalage; x < 128 + 32; x += 32) ctx.fillRect(x % 128, rang * h, 2, h)
  }
  return texture(c)
}

/** Masque de grille (dalles du plafond en miroirs). */
export function masqueGrille() {
  const { c, ctx } = canevas(64, 64)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 64, 64)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 64, 2)
  ctx.fillRect(0, 0, 2, 64)
  return texture(c)
}

/** Fond de scène : lueur bordeaux au centre, nuit sur les bords. */
export function textureFond() {
  const { c, ctx } = canevas(512, 512)
  const d = ctx.createRadialGradient(256, 230, 10, 256, 256, 380)
  d.addColorStop(0, '#5a1a2c')
  d.addColorStop(0.5, '#2e0a16')
  d.addColorStop(1, '#14040a')
  ctx.fillStyle = d
  ctx.fillRect(0, 0, 512, 512)
  return texture(c, false)
}

/** Étagères de bouteilles rétroéclairées (fond du bar). */
export function textureBouteilles() {
  const { c, ctx } = canevas(512, 256)
  const fond = ctx.createLinearGradient(0, 0, 0, 256)
  fond.addColorStop(0, '#f7e2b8')
  fond.addColorStop(1, '#e9c58a')
  ctx.fillStyle = fond
  ctx.fillRect(0, 0, 512, 256)
  const r = hasard(3)
  const teintes = ['#2f7d45', '#3f9a57', '#c9e2c0', '#a8612a', '#7a3a1c', '#d99a3a', '#e8f0e6', '#2c5c8a']
  for (let etage = 0; etage < 3; etage++) {
    const base = 80 + etage * 84
    ctx.fillStyle = '#f4efe6'
    ctx.fillRect(0, base, 512, 6)
    let x = 6
    while (x < 500) {
      const l = 14 + r() * 10
      const h = 38 + r() * 26
      ctx.fillStyle = teintes[Math.floor(r() * teintes.length)]
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.roundRect(x, base - h, l, h, [l / 2, l / 2, 2, 2])
      ctx.fill()
      ctx.fillRect(x + l * 0.35, base - h - 10, l * 0.3, 12)
      ctx.globalAlpha = 1
      x += l + 3 + r() * 5
    }
  }
  return texture(c, false)
}

/** Boîte à pizza Gigi : rayures jaunes et blanches, rose framboise (vraie boîte du restaurant). */
export function textureBoite() {
  const T = 256
  const { c, ctx } = canevas(T, T)
  ctx.fillStyle = '#fbf3dd'
  ctx.fillRect(0, 0, T, T)
  ctx.save()
  ctx.translate(T / 2, T / 2)
  ctx.rotate(-Math.PI / 4)
  ctx.fillStyle = '#f1c032'
  for (let x = -T; x < T; x += 32) ctx.fillRect(x, -T, 16, T * 2)
  ctx.restore()
  const echelle = 150 / ROSE.largeur
  ctx.save()
  ctx.translate(58, 50)
  ctx.scale(echelle, echelle)
  ctx.fillStyle = '#d4145a'
  ctx.fill(new Path2D(ROSE.d))
  ctx.restore()
  const echelleLogo = 64 / LOGO.largeur
  ctx.save()
  ctx.translate(96, 206)
  ctx.scale(echelleLogo, echelleLogo)
  ctx.fillStyle = '#c90050'
  ctx.fill(new Path2D(LOGO.d), 'evenodd')
  ctx.restore()
  return texture(c, false)
}

/** Devanture du socle : logo GIGI crème sur bordeaux, entre deux roses. */
export function textureSocle() {
  const { c, ctx } = canevas(1690, 64)
  ctx.fillStyle = '#3a0c1a'
  ctx.fillRect(0, 0, 1690, 64)
  ctx.strokeStyle = '#c90050'
  ctx.lineWidth = 2
  ctx.strokeRect(6, 8, 1678, 48)
  const h = 38
  const echelle = h / LOGO.hauteur
  ctx.save()
  ctx.translate(845 - (LOGO.largeur * echelle) / 2, 13)
  ctx.scale(echelle, echelle)
  ctx.fillStyle = '#f6eedd'
  ctx.fill(new Path2D(LOGO.d), 'evenodd')
  ctx.restore()
  for (const x of [700, 954]) {
    const e = 36 / ROSE.largeur
    ctx.save()
    ctx.translate(x, 14)
    ctx.scale(e, e)
    ctx.fillStyle = '#f58ab0'
    ctx.fill(new Path2D(ROSE.d))
    ctx.restore()
  }
  return texture(c, false)
}

/** Halo d'une rose en néon (le tube lui-même est en géométrie, net à toute taille), pour un plan additif. */
export function textureHaloRose() {
  const T = 256
  const { c, ctx } = canevas(T, T)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, T, T)
  const e = (T * 0.62) / ROSE.largeur
  const chemin = new Path2D(ROSE.d)
  for (const [flou, alpha] of [
    [30, 0.55],
    [12, 0.5],
  ] as const) {
    ctx.save()
    ctx.translate((T - ROSE.largeur * e) / 2, (T - ROSE.hauteur * e) / 2)
    ctx.scale(e, e)
    ctx.globalAlpha = alpha
    ctx.shadowColor = '#ff2f74'
    ctx.shadowBlur = flou
    ctx.fillStyle = '#ff4f8c'
    ctx.fill(chemin)
    ctx.restore()
  }
  return texture(c, false)
}
