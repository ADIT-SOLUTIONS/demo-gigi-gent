import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PHOTOS } from '../../src/data/photos'
import { useLangue } from '../../src/hooks/useLangue'
import { Filet, Rose } from '../../src/components/Emblemes'
import Photo from '../../src/components/Photo'
import Titre from '../../src/components/Titre'
import { sansCoupure } from '../../src/utils/texte'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
  L'amore, version immersive : le manifeste s'allume phrase après phrase au fil du défilement,
  la photo du banquet se resserre dans son cadre.
*/
export default function Amore() {
  const { t, langue } = useLangue()
  const racine = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(racine)
        gsap.fromTo(
          q('.eclat'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.5,
            scrollTrigger: { trigger: q('.manifeste')[0], start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          q('.amore__image'),
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.amore__photo')[0], start: 'top bottom', end: 'bottom 40%', scrub: true },
          },
        )
      })
    },
    { scope: racine, dependencies: [langue], revertOnUpdate: true },
  )

  return (
    <section id="amore" className="section section--nuit amore" ref={racine}>
      <div className="container">
        <header className="section__entete section__entete--centre" data-reveal>
          <p className="surtitre">{t.amore.surtitre}</p>
          <Titre texte={t.amore.titre} />
          <Filet />
        </header>

        <figure className="manifeste">
          <blockquote className="manifeste__texte">
            {t.amore.manifeste.map((ligne) => (
              <p key={ligne} className="eclat">
                {ligne}
              </p>
            ))}
            <p className="manifeste__devise" lang="it">
              {t.amore.devise}
            </p>
          </blockquote>
          <figcaption className="manifeste__source">{t.amore.source}</figcaption>
        </figure>

        <div className="cadre-double amore__photo" data-reveal>
          <div className="amore__masque">
            <Photo photo={PHOTOS.banquet} sizes="(max-width: 1240px) 92vw, 1160px" className="amore__image" />
          </div>
        </div>

        <ul className="faits">
          {t.amore.faits.map((fait) => (
            <li key={fait.titre} className="fait" data-reveal>
              <Rose className="fait__rose" />
              <h3 className="fait__titre">{fait.titre}</h3>
              <p>{sansCoupure(fait.texte)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
