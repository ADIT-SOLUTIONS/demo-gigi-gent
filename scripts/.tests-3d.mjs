import { chromium } from 'playwright-core'
const URL = 'http://localhost:5192/'
const SC = process.argv[2]
const attendre = (page) => page.waitForFunction(() => document.readyState === 'complete', null, { timeout: 60000 })
const erreursDe = (page) => { const e = []; page.on('console', (m) => ['error', 'warning'].includes(m.type()) && e.push(m.text().slice(0, 160))); page.on('pageerror', (x) => e.push(x.message)); return e }

// 1. Réduire les animations
{
  const b = await chromium.launch({ channel: 'chrome' })
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const e = erreursDe(p)
  await p.goto(URL, { waitUntil: 'networkidle' }); await attendre(p)
  const r = await p.evaluate(() => { const m = document.querySelector('.section-maison'); const img = m.querySelector('.maison__affiche img'); return { classes: m.className, canvas: getComputedStyle(m.querySelector('.maison__canvas')).display, affiche: img.currentSrc.split('/').pop(), visible: img.getBoundingClientRect().height > 0, pieces: getComputedStyle(m.querySelector('.piece')).visibility, titres: document.querySelector('.titre .mot__interieur') && getComputedStyle(document.querySelector('.titre .mot__interieur')).transform } })
  await p.evaluate(async () => { document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')); await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {}))); document.querySelectorAll('.titre').forEach((t) => t.classList.add('titre--visible')) }); await p.locator('.section-maison').screenshot({ path: `${SC}/reduit.jpg`, type: 'jpeg', quality: 70 })
  console.log('réduire les animations', JSON.stringify(r), e.length ? e : 'console propre')
  await b.close()
}
// 2. Sans WebGL
{
  const b = await chromium.launch({ channel: 'chrome', args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] })
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const e = erreursDe(p)
  await p.goto(URL, { waitUntil: 'networkidle' }); await attendre(p)
  const r = await p.evaluate(() => { const m = document.querySelector('.section-maison'); const img = m.querySelector('.maison__affiche img'); return { webgl: !!document.createElement('canvas').getContext('webgl2'), classes: m.className, affiche: img.currentSrc.split('/').pop(), hauteur: Math.round(img.getBoundingClientRect().height) } })
  await p.evaluate(async () => { document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')); await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {}))); document.querySelectorAll('.titre').forEach((t) => t.classList.add('titre--visible')) }); await p.locator('.section-maison').screenshot({ path: `${SC}/sans-webgl.jpg`, type: 'jpeg', quality: 70 })
  console.log('sans WebGL', JSON.stringify(r), e.length ? e : 'console propre')
  await b.close()
}
// 3. Perte puis restauration du contexte WebGL
{
  const b = await chromium.launch({ channel: 'chrome' })
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } })
  const e = erreursDe(p)
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForFunction(() => /maison--prete/.test(document.querySelector('.section-maison').className), null, { timeout: 60000 })
  await p.evaluate(() => { const plateau = document.querySelector('.maison__plateau'); scrollTo(0, plateau.getBoundingClientRect().top + scrollY + innerHeight * 2.5) })
  await p.waitForTimeout(1200)
  const perte = await p.evaluate(() => { const c = document.querySelector('.maison__canvas'); const gl = c.getContext('webgl2'); window.__ext = gl.getExtension('WEBGL_lose_context'); window.__ext.loseContext(); return true })
  await p.waitForTimeout(600)
  const apresPerte = await p.evaluate(() => document.querySelector('.section-maison').className)
  await p.screenshot({ path: `${SC}/contexte-perdu.jpg`, type: 'jpeg', quality: 70 })
  await p.evaluate(() => window.__ext.restoreContext())
  await p.waitForFunction(() => /maison--prete/.test(document.querySelector('.section-maison').className), null, { timeout: 60000 }).catch(() => {})
  await p.waitForTimeout(1200)
  const apresRestauration = await p.evaluate(() => document.querySelector('.section-maison').className)
  await p.screenshot({ path: `${SC}/contexte-restaure.jpg`, type: 'jpeg', quality: 70 })
  console.log('perte de contexte', JSON.stringify({ perte, apresPerte, apresRestauration }), e.length ? e : 'console propre')
  await b.close()
}
