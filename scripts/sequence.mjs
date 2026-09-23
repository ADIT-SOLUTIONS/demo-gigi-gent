// Captures de la séquence 3D « maison de poupée » à plusieurs moments du défilement.
// Usage : node scripts/sequence.mjs [url] [dossier] [largeur] [hauteur]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5191/'
const DOSSIER = process.argv[3] ?? 'captures-sequence'
const L = Number(process.argv[4] ?? 1440)
const H = Number(process.argv[5] ?? 900)
mkdirSync(DOSSIER, { recursive: true })

const navigateur = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--enable-gpu'] })
const contexte = await navigateur.newContext({ viewport: { width: L, height: H }, locale: 'fr', hasTouch: L < 800, isMobile: L < 800 })
const page = await contexte.newPage()
const erreurs = []
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && erreurs.push(m.text().slice(0, 300)))
page.on('pageerror', (e) => erreurs.push(e.message))
await page.goto(URL + '?lang=fr', { waitUntil: 'networkidle' })
const etat = await page.waitForFunction(() => {
  const m = document.querySelector('.section-maison')
  return m && /maison--(prete|sans-3d)/.test(m.className) ? m.className : null
}, null, { timeout: 60000 }).then((h) => h.jsonValue()).catch(() => 'délai dépassé')
console.log('état', etat)
const { debut, fin } = await page.evaluate(() => {
  const st = window.ScrollTrigger?.getAll?.()
  const plateau = document.querySelector('.maison__plateau')
  const haut = plateau.getBoundingClientRect().top + scrollY
  return { debut: haut, fin: haut + innerHeight * (innerWidth < 768 ? 5.2 : 6.2) }
})
const moments = [0, 0.08, 0.18, 0.3, 0.44, 0.58, 0.72, 0.86, 1]
for (const m of moments) {
  await page.evaluate((y) => window.scrollTo(0, y), debut + (fin - debut) * m)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${DOSSIER}/t-${String(Math.round(m * 100)).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 })
}
console.log(erreurs.length ? 'ERREURS ' + JSON.stringify(erreurs, null, 1) : 'console propre')
await navigateur.close()
