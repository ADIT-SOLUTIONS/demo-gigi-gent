import { ADRESSE } from '../data/infos'
import { PHOTOS } from '../data/photos'
import { useLangue } from '../hooks/useLangue'
import { Logo, Rose } from './Emblemes'
import Photo from './Photo'
import Statut from './Statut'
import { sansCoupure } from '../utils/texte'

export default function Hero() {
  const { t } = useLangue()
  return (
    <section id="accueil" className="hero">
      <div className="container hero__grille">
        <div className="hero__texte">
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

        <div className="hero__visuel">
          <div className="arche hero__arche">
            <Photo
              photo={PHOTOS.salleCitrons}
              sizes="(max-width: 767px) 86vw, (max-width: 1023px) 60vw, 440px"
              className="arche__image"
              prioritaire
            />
          </div>
          <Rose className="hero__rose" />
        </div>
      </div>
    </section>
  )
}
