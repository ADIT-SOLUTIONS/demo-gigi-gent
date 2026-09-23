import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
  Effets communs de la version immersive, posés sur le contenu de la version classique :
  - parallaxe : [data-vitesse] (part de la hauteur d'écran parcourue pendant la traversée de l'élément) ;
  - titres : les mots basculent à l'apparition (classe titre--visible) ;
  - relief : [data-relief] et les photos des sections communes s'inclinent vers le pointeur (souris seulement) ;
  - la carte se déplie en entrant à l'écran.
  Tout passe par transform et opacity ; rien avec « réduire les animations ».
*/

const RELIEF = '[data-relief], .pilier__photo, .carte-cadeau__photo, .plan__carte'

export function useEffets() {
  // Titres : bascule des mots à l'apparition
  useEffect(() => {
    const titres = document.querySelectorAll<HTMLElement>('.titre')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      titres.forEach((t) => t.classList.add('titre--visible'))
      return
    }
    const observateur = new IntersectionObserver(
      (entrees) =>
        entrees.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('titre--visible')
          observateur.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -12% 0px' },
    )
    titres.forEach((t) => observateur.observe(t))
    return () => observateur.disconnect()
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(
      { anime: '(prefers-reduced-motion: no-preference)', souris: '(hover: hover) and (pointer: fine)' },
      (contexte) => {
        const { anime, souris } = contexte.conditions as { anime: boolean; souris: boolean }
        if (!anime) return

        // Parallaxe
        gsap.utils.toArray<HTMLElement>('[data-vitesse]').forEach((el) => {
          const vitesse = Number(el.dataset.vitesse) || 0
          // Accueil : tout est en place au chargement, le décalage naît avec le défilement
          const accueil = el.closest<HTMLElement>('.hero')
          if (accueil) {
            gsap.fromTo(
              el,
              { y: 0 },
              {
                y: () => vitesse * window.innerHeight * 0.6,
                ease: 'none',
                scrollTrigger: { trigger: accueil, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
              },
            )
            return
          }
          gsap.fromTo(
            el,
            { y: () => -vitesse * window.innerHeight * 0.5 },
            {
              y: () => vitesse * window.innerHeight * 0.5,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
            },
          )
        })

        // Photos de la cuisine : l'image glisse dans son arche (le cadre ne bouge pas, les textes restent à leur place)
        gsap.utils.toArray<HTMLElement>('.pilier__photo img, .carte-cadeau__photo img').forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.16, yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })

        // La carte se déplie comme une carte papier posée sur la table
        const menu = document.querySelector<HTMLElement>('.menu')
        if (menu) {
          gsap.set(menu, { transformPerspective: 1600, transformOrigin: '50% 0%' })
          gsap.fromTo(
            menu,
            { rotationX: () => (window.innerWidth < 768 ? 9 : 22), y: 50 },
            { rotationX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: menu, start: 'top 98%', end: 'top 40%', scrub: 0.5, invalidateOnRefresh: true } },
          )
        }

        // Relief au pointeur (souris uniquement : sur écran tactile, la parallaxe suffit)
        if (!souris) return
        const nettoyages: Array<() => void> = []
        gsap.utils.toArray<HTMLElement>(RELIEF).forEach((el) => {
          gsap.set(el, { transformPerspective: 900 })
          const versX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
          const versY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
          const bouger = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            versX(((e.clientY - r.top) / r.height - 0.5) * -8)
            versY(((e.clientX - r.left) / r.width - 0.5) * 10)
          }
          const sortir = () => {
            versX(0)
            versY(0)
          }
          el.addEventListener('pointermove', bouger)
          el.addEventListener('pointerleave', sortir)
          nettoyages.push(() => {
            el.removeEventListener('pointermove', bouger)
            el.removeEventListener('pointerleave', sortir)
          })
        })
        return () => nettoyages.forEach((n) => n())
      },
    )
  })
}
