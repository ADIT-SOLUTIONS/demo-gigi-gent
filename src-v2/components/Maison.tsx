import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PHOTOS } from '../../src/data/photos'
import { LIENS } from '../../src/data/infos'
import { useLangue } from '../../src/hooks/useLangue'
import { Filet } from '../../src/components/Emblemes'
import Photo from '../../src/components/Photo'
import Titre from '../../src/components/Titre'
import { sansCoupure } from '../../src/utils/texte'
import { DUREE, PIECES, T_FIN, T_OUVERTURE, T_PLONGEE, debutPiece, pieceActive } from './maison/sequence'
import type { Scene3D } from './maison/scene3d'
import Galerie from './Galerie'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

/*
  « Il posto » en version immersive : la maison de poupée en 3D temps réel (Three.js), épinglée pendant le
  défilement. La timeline GSAP pilote les textes ; la scène 3D lit le même temps (maison/sequence.ts).
  Sans WebGL, avec « réduire les animations » ou sur un écran trop bas : image fixe et textes à la suite.
*/

const PHOTOS_PIECES = [PHOTOS.grandeSalle, PHOTOS.barVert, PHOTOS.escalierVert, PHOTOS.salleCitrons]
const NOMS_PIECES = ['grandeSalle', 'bar', 'escalier', 'citrons'] as const

function webglDisponible() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    // Libère tout de suite ce contexte de test : le navigateur limite le nombre de contextes actifs
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

export default function Maison() {
  const { t } = useLangue()
  const racine = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          anime: '(prefers-reduced-motion: no-preference) and (min-height: 500px)',
          portrait: '(max-aspect-ratio: 19/20)',
          mobile: '(max-width: 767px)',
        },
        (contexte) => {
          const { anime, portrait, mobile } = contexte.conditions as { anime: boolean; portrait: boolean; mobile: boolean }
          const bloc = racine.current
          if (!anime || !bloc || !webglDisponible()) return

          bloc.classList.add('maison--anime')
          const q = gsap.utils.selector(bloc)
          const plateau = q('.maison__plateau')[0] as HTMLElement
          const canvas = q('.maison__canvas')[0] as HTMLCanvasElement
          const pieces = q('.piece') as HTMLElement[]
          const reperes = q('.maison__repere') as HTMLElement[]

          let scene3d: Scene3D | null = null
          let raf = 0
          let annule = false
          let chargement = false
          let generation = 0
          let active = -2

          // Le lissage (scrub) continue après l'arrêt du défilement : la scène 3D suit le temps de la timeline
          const tl = gsap.timeline({
            defaults: { ease: 'none', immediateRender: false },
            onUpdate: () => {
              const p = pieceActive(tl.time())
              if (p === active) return
              active = p
              reperes.forEach((r, i) => r.classList.toggle('maison__repere--actif', i === p || (p === PIECES.length && i === PIECES.length - 1)))
            },
            scrollTrigger: {
              trigger: plateau,
              start: 'top top',
              end: () => `+=${window.innerHeight * (mobile ? 5.2 : 6.2)}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          tl.to(q('.maison__indice'), { autoAlpha: 0, duration: 0.3 }, 0.1)
          tl.to(q('.maison__intro'), { autoAlpha: 0, y: -24, duration: 0.45 }, T_OUVERTURE[0] + 0.15)
          tl.fromTo(q('.maison__progression'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, T_OUVERTURE[1] - 0.3)
          pieces.forEach((piece, i) => {
            const debut = debutPiece(i)
            const fin = i < PIECES.length - 1 ? debutPiece(i + 1) - 0.1 : T_PLONGEE[0] + 0.2
            const decalage = portrait ? { y: 24 } : { x: -28 }
            tl.fromTo(piece, { autoAlpha: 0, ...decalage }, { autoAlpha: 1, x: 0, y: 0, duration: 0.4, ease: 'power2.out' }, debut + 0.05)
            tl.fromTo(
              piece.querySelector('.piece__photo img'),
              { scale: 1.18 },
              { scale: 1, duration: 1.4 },
              debut,
            )
            tl.to(piece, { autoAlpha: 0, ...(portrait ? { y: -18 } : { x: 20 }), duration: 0.3 }, fin - 0.3)
          })
          tl.to(q('.maison__progression'), { autoAlpha: 0, duration: 0.3 }, T_PLONGEE[0] + 0.2)
          tl.fromTo(q('.maison__fin'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, T_FIN - 0.3)
          tl.to({}, { duration: 0.01 }, DUREE - 0.01)

          // Rendu : uniquement quand le plateau est à l'écran
          const boucle = () => {
            raf = requestAnimationFrame(boucle)
            // Démo : quand cette version est cachée derrière l'autre (classe posée par selecteur/cadre.ts), rien à dessiner
            if (!scene3d || document.documentElement.classList.contains('cadre-masque')) return
            scene3d.rendre(tl.time())
          }
          const demarrer = () => {
            if (!raf) raf = requestAnimationFrame(boucle)
          }
          const arreter = () => {
            cancelAnimationFrame(raf)
            raf = 0
          }

          // La scène n'apparaît qu'une fois entièrement préparée (shaders compilés) ; l'image fixe reste en secours
          const charger = () => {
            chargement = true
            const numero = ++generation
            const abandon = () => annule || numero !== generation
            import('./maison/scene3d')
              .then(({ creerScene }) =>
                creerScene(canvas, { mobile, largeur: plateau.clientWidth, hauteur: plateau.clientHeight, abandon }),
              )
              .then((prete) => {
                if (abandon()) {
                  prete.detruire()
                  return
                }
                scene3d = prete
                scene3d.redimensionner(plateau.clientWidth, plateau.clientHeight)
                // Développement : scripts/affiche-3d.mjs produit l'image fixe de repli à partir de la scène
                if (import.meta.env.DEV) (window as unknown as { __maison3d: Scene3D }).__maison3d = prete
                bloc.classList.remove('maison--sans-3d')
                bloc.classList.add('maison--prete')
              })
              .catch((erreur) => {
                if (abandon()) return
                console.warn('Scène 3D indisponible, image fixe affichée à la place.', erreur)
                bloc.classList.add('maison--sans-3d')
              })
          }

          // Contexte WebGL perdu (pilote graphique réinitialisé, mémoire saturée) : image fixe, puis reconstruction
          const surPerteContexte = (evenement: Event) => {
            evenement.preventDefault() // autorise le navigateur à restaurer le contexte
            generation++
            scene3d?.detruire()
            scene3d = null
            bloc.classList.remove('maison--prete')
            bloc.classList.add('maison--sans-3d')
          }
          const surRestaurationContexte = () => {
            if (!annule && chargement) charger()
          }
          canvas.addEventListener('webglcontextlost', surPerteContexte)
          canvas.addEventListener('webglcontextrestored', surRestaurationContexte)

          const redimension = new ResizeObserver(() => scene3d?.redimensionner(plateau.clientWidth, plateau.clientHeight))
          redimension.observe(plateau)

          // Scène préparée dès l'ouverture du site, pendant que le visiteur lit le haut de page ;
          // rendu seulement quand le plateau est à l'écran
          charger()
          const vue = new IntersectionObserver(([entree]) => (entree.isIntersecting ? demarrer() : arreter()), {
            rootMargin: '10% 0px',
          })
          vue.observe(plateau)

          document.fonts?.ready.then(() => ScrollTrigger.refresh())

          return () => {
            annule = true
            arreter()
            vue.disconnect()
            redimension.disconnect()
            canvas.removeEventListener('webglcontextlost', surPerteContexte)
            canvas.removeEventListener('webglcontextrestored', surRestaurationContexte)
            scene3d?.detruire()
            scene3d = null
            bloc.classList.remove('maison--anime', 'maison--prete', 'maison--sans-3d')
          }
        },
      )
    },
    { scope: racine },
  )

  return (
    <section id="lieu" className="section-maison section--nuit" ref={racine}>
      <div className="maison__plateau">
        <div className="maison__scene">
          <canvas className="maison__canvas" aria-hidden="true" />
          <div className="maison__affiche">
            <img
              className="maison__affiche-paysage"
              src="/images/maison-3d.webp"
              alt={t.maison.afficheAlt}
              width="1600"
              height="1000"
              loading="lazy"
              decoding="async"
            />
            {/* Écran en portrait, pendant la préparation de la 3D ou après une perte de contexte : même cadrage que la scène */}
            <img className="maison__affiche-portrait" src="/images/maison-3d-portrait.webp" alt="" width="900" height="1200" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="maison__textes">
          <header className="maison__intro">
            <p className="surtitre">{t.lieu.surtitre}</p>
            <Titre texte={t.lieu.titre} />
            <Filet />
            <p className="maison__texte">{sansCoupure(t.lieu.texte)}</p>
            <p className="maison__legende">{t.maison.legende}</p>
          </header>

          <ol className="maison__pieces">
            {NOMS_PIECES.map((nom, i) => (
              <li key={nom} className="piece">
                <div className="piece__photo arche">
                  <Photo photo={PHOTOS_PIECES[i]} sizes="(max-width: 767px) 30vw, 220px" />
                </div>
                <div className="piece__texte">
                  <p className="piece__numero">
                    {String(i + 1).padStart(2, '0')} / {String(PIECES.length).padStart(2, '0')}
                  </p>
                  <h3 className="piece__nom">{t.lieu.pieces[nom]}</h3>
                  <p className="piece__description">{t.maison.pieces[i]}</p>
                </div>
              </li>
            ))}
          </ol>

          <ol className="maison__progression" aria-hidden="true">
            {NOMS_PIECES.map((nom) => (
              <li key={nom} className="maison__repere">
                {t.lieu.pieces[nom]}
              </li>
            ))}
          </ol>

          <div className="maison__fin">
            <p className="maison__fin-titre">{t.maison.fin}</p>
            <a href={LIENS.reservation} className="btn btn--plein" target="_blank" rel="noopener noreferrer">
              {t.reserver.enLigne}
            </a>
          </div>

          <p className="maison__indice" aria-hidden="true">
            {t.maison.indice}
          </p>
        </div>
      </div>

      <div className="container maison__galerie">
        <Galerie />
      </div>
    </section>
  )
}
