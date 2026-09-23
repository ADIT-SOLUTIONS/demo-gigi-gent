// Produit l'image fixe de la maison de poupée (repli sans WebGL ou avec « réduire les animations ») à partir
// de la vraie scène 3D. Usage : npm run dev, puis node scripts/affiche-3d.mjs [url]
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5191/'
const navigateur = await chromium.launch({ channel: 'chrome' })
const page = await navigateur.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForFunction(() => window.__maison3d, null, { timeout: 60000 })
for (const [nom, l, h, portrait] of [
  ['maison-3d', 1600, 1000, false],
  ['maison-3d-portrait', 780, 1688, true],
]) {
  const donnees = await page.evaluate(([l, h, p]) => window.__maison3d.affiche(l, h, p), [l, h, portrait])
  writeFileSync(`scripts/.${nom}.png`, Buffer.from(donnees.split(',')[1], 'base64'))
  console.log(nom, l, h)
}
await navigateur.close()
