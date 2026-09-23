import { PHOTOS } from '../data/photos'
import { useLangue } from '../hooks/useLangue'
import { Filet } from './Emblemes'
import Photo from './Photo'
import Titre from './Titre'

const VISUELS = [PHOTOS.pizzaiolo, PHOTOS.spaghetti, PHOTOS.platCitrons]

export default function Cucina() {
  const { t } = useLangue()
  return (
    <section id="cucina" className="section cucina">
      <div className="container">
        <header className="section__entete cucina__entete" data-reveal>
          <div>
            <p className="surtitre">{t.cucina.surtitre}</p>
            <Titre texte={t.cucina.titre} />
            <Filet />
          </div>
          <p className="section__intro">{t.cucina.texte}</p>
        </header>

        <ul className="piliers">
          {t.cucina.piliers.map((pilier, i) => (
            <li key={pilier.titre} className="pilier" data-reveal>
              <div className="pilier__photo">
                <Photo photo={VISUELS[i]} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 380px" />
              </div>
              <h3 className="pilier__titre">{pilier.titre}</h3>
              <p>{pilier.texte}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
