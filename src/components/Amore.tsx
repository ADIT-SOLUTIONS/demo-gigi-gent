import { PHOTOS } from '../data/photos'
import { useLangue } from '../hooks/useLangue'
import { Filet, Rose } from './Emblemes'
import Photo from './Photo'
import { sansCoupure } from '../utils/texte'

export default function Amore() {
  const { t } = useLangue()
  return (
    <section id="amore" className="section section--nuit amore">
      <div className="container">
        <header className="section__entete section__entete--centre" data-reveal>
          <p className="surtitre">{t.amore.surtitre}</p>
          <h2 className="titre">{t.amore.titre}</h2>
          <Filet />
        </header>

        <figure className="manifeste" data-reveal>
          <blockquote className="manifeste__texte">
            {t.amore.manifeste.map((ligne) => (
              <p key={ligne}>{ligne}</p>
            ))}
            <p className="manifeste__devise" lang="it">
              {t.amore.devise}
            </p>
          </blockquote>
          <figcaption className="manifeste__source">{t.amore.source}</figcaption>
        </figure>

        <div className="cadre-double amore__photo" data-reveal>
          <Photo photo={PHOTOS.banquet} sizes="(max-width: 1240px) 92vw, 1160px" className="amore__image" />
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
