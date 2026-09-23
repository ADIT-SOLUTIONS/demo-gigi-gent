// Vérification visuelle : captures pleine page (ordinateur, tablette, mobile), débordement horizontal
// et erreurs console. Usage : node scripts/verifier.mjs [url] [dossier-captures] [langue]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5191/'
const DOSSIER = process.argv[3] ?? 'captures'
const LANGUE = process.argv[4] ?? 'fr'
mkdirSync(DOSSIER, { recursive: true })

const APPAREILS = [
  { nom: 'ordinateur', viewport: { width: 1440, height: 900 } },
  { nom: 'tablette', viewport: { width: 820, height: 1180 }, hasTouch: true },
  { nom: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
]

const navigateur = await chromium.launch({ channel: 'chrome' })
for (const appareil of APPAREILS) {
  const { nom, ...options } = appareil
  const contexte = await navigateur.newContext({ ...options, locale: LANGUE })
  const page = await contexte.newPage()
  const erreurs = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && erreurs.push(m.text().slice(0, 200)))
  page.on('pageerror', (e) => erreurs.push(e.message))
  await page.goto(URL + (URL.includes('?') ? '&' : '?') + 'lang=' + LANGUE, { waitUntil: 'networkidle' })
  // Affiche tout (apparitions au défilement, images différées) pour la capture pleine page
  await page.evaluate(async () => {
    document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible'))
    document.querySelectorAll('.titre').forEach((e) => e.classList.add('titre--visible'))
    document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'))
    await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {})))
    document.documentElement.style.scrollBehavior = 'auto'
  })
  await page.waitForTimeout(1200)
  const debord = await page.evaluate(() => {
    const largeur = document.documentElement.clientWidth
    const fautifs = []
    document.querySelectorAll('body *').forEach((e) => {
      const r = e.getBoundingClientRect()
      if (r.width && (r.right > largeur + 1 || r.left < -1)) {
        const style = getComputedStyle(e)
        if (style.position !== 'fixed') fautifs.push(`${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)} ${Math.round(r.left)}→${Math.round(r.right)}`)
      }
    })
    return { scrollWidth: document.documentElement.scrollWidth, largeur, fautifs: fautifs.slice(0, 8) }
  })
  await page.screenshot({ path: `${DOSSIER}/${nom}.png`, fullPage: true })
  console.log(nom, JSON.stringify(debord), erreurs.length ? 'ERREURS ' + JSON.stringify(erreurs) : 'console propre')
  await contexte.close()
}
await navigateur.close()
