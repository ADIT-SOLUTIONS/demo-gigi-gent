import { ADRESSE } from '../../src/data/infos'
import { PHOTOS } from '../../src/data/photos'
import { useLangue } from '../../src/hooks/useLangue'
import { Logo, Rose } from '../../src/components/Emblemes'
import Photo from '../../src/components/Photo'
import Statut from '../../src/components/Statut'
import { sansCoupure } from '../../src/utils/texte'
import Citron from './Citron'

/*
  Accueil de la version immersive : même contenu que la version classique, en couches de profondeur.
  Store rayé qui se replie, citrons du papier peint qui flottent, logo qui se dévoile, arche en relief,
  rose en néon qui s'allume. Les vitesses de parallaxe (data-vitesse) sont lues par hooks/useEffets.ts.
*/
export default function Hero() {
  const { t } = useLangue()
  return (
    <section id="accueil" className="hero hero--immersif">
      <div className="store store--haut" data-vitesse="-0.22" aria-hidden="true" />

      <div className="decor" aria-hidden="true">
        <Citron className="decor__citron decor__citron--1" data-vitesse="0.5" />
        <Citron className="decor__citron decor__citron--2" data-vitesse="-0.3" />
        <Citron className="decor__citron decor__citron--3" data-vitesse="0.8" />
      </div>

      <div className="container hero__grille">
        <div className="hero__texte" data-vitesse="-0.05">
          <h1 className="hero__titre">
            <span className="sr-only">{t.hero.titreCache}</span>
            <Logo className="hero__logo" />
          </h1>
          <p className="surtitre hero__surtitre">{t.hero.surtitre}</p>
          <p className="hero__accroche">{t.hero.accroche}</p>
          <p className="hero__intro">{sansCoupure(t.hero.texte)}</p>
          <div className="hero__actions">
            <a href="#reserver" className="btn btn--plein">
              {t.hero.reserver}
            </a>
            <a href="#carte" className="btn btn--contour">
              {t.hero.carte}
            </a>
          </div>
          <div className="hero__infos">
            <Statut />
            <p className="hero__adresse">
              {ADRESSE.rue}, {ADRESSE.ville}
            </p>
          </div>
        </div>

        <div className="hero__visuel" data-vitesse="0.12">
          <div className="arche hero__arche" data-relief>
            <div className="hero__zoom">
              <Photo
                photo={PHOTOS.salleCitrons}
                sizes="(max-width: 767px) 86vw, (max-width: 1023px) 60vw, 440px"
                className="arche__image"
                prioritaire
              />
            </div>
          </div>
          <Rose className="hero__rose hero__rose--neon" />
        </div>
      </div>
    </section>
  )
}
