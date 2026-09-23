// Teste la page de démo : chargement des deux versions, écran de chargement, bascule par la pastille,
// retour en haut, console. Usage : npm run build && npm run preview -- --port 5192, puis
// node scripts/tests-demo.mjs <dossier-captures> [largeur] [hauteur]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const SC = process.argv[2] ?? 'captures-demo'
const L = Number(process.argv[3] ?? 1440)
const H = Number(process.argv[4] ?? 900)
const mobile = L < 800
mkdirSync(SC, { recursive: true })
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: L, height: H }, isMobile: mobile, hasTouch: mobile })
const erreurs = []
p.on('console', (m) => ['error', 'warning'].includes(m.type()) && erreurs.push(`${m.location().url.split('/').slice(-2).join('/')} ${m.text().slice(0, 160)}`))
p.on('pageerror', (e) => erreurs.push(e.message))
const t0 = Date.now()
await p.goto('http://localhost:5192/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(700)
await p.screenshot({ path: `${SC}/chargement.jpg`, type: 'jpeg', quality: 80 })
await p.waitForSelector('#demo:not(.demo--chargement)', { state: 'attached', timeout: 90000 })
const pret = Date.now() - t0
await p.waitForTimeout(1600)
await p.screenshot({ path: `${SC}/v1.jpg`, type: 'jpeg', quality: 80 })
const cadre = (n) => p.frames().find((f) => f.url().includes(`/v${n}/`))
// Descend dans la version 1, puis passe à la 2 : elle doit s'afficher en haut de page
await cadre(1).evaluate(() => scrollTo(0, 2400))
await p.click('.selecteur-version__pastille')
await p.waitForTimeout(300)
await p.screenshot({ path: `${SC}/panneau.jpg`, type: 'jpeg', quality: 80 })
await p.click('.selecteur-version__choix[data-version="2"]')
await p.waitForTimeout(900)
const etat2 = await p.evaluate(() => ({
  actif: document.querySelector('.demo__cadre--actif')?.getAttribute('title'),
  adresse: location.hash,
}))
const haut2 = await cadre(2).evaluate(() => ({ y: scrollY, masque: document.documentElement.classList.contains('cadre-masque') }))
const masque1 = await cadre(1).evaluate(() => document.documentElement.classList.contains('cadre-masque'))
await p.screenshot({ path: `${SC}/v2.jpg`, type: 'jpeg', quality: 80 })
// Retour à la 1 : en haut de page aussi
await cadre(2).evaluate(() => scrollTo(0, 3000))
await p.click('.selecteur-version__pastille')
await p.click('.selecteur-version__choix[data-version="1"]')
await p.waitForTimeout(700)
const haut1 = await cadre(1).evaluate(() => scrollY)
const noindex = await Promise.all([p.mainFrame(), cadre(1), cadre(2)].map((f) => f.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content'))))
console.log(JSON.stringify({ pret_ms: pret, etat2, haut2, masque1, haut1, noindex, erreurs }, null, 1))
await b.close()
