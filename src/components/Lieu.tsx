import { PHOTOS, type Photo as InfosPhoto } from '../data/photos'
import { useLangue } from '../hooks/useLangue'
import type { Textes } from '../i18n'
import { Filet } from './Emblemes'
import Photo from './Photo'
import { sansCoupure } from '../utils/texte'
import Titre from './Titre'

type Piece = keyof Textes['lieu']['pieces']

// Mosaïque à ratios variés (colonnes) : chaque photo garde son format. Six portraits et trois paysages,
// dans cet ordre, donnent trois colonnes de même hauteur.
const GALERIE: { photo: InfosPhoto; piece: Piece }[] = [
  { photo: PHOTOS.facadeRoses, piece: 'facade' },
  { photo: PHOTOS.barVert, piece: 'bar' },
  { photo: PHOTOS.madoneStore, piece: 'stores' },
  { photo: PHOTOS.grandeSalle, piece: 'grandeSalle' },
  { photo: PHOTOS.boiteVert, piece: 'boite' },
  { photo: PHOTOS.escalierVert, piece: 'escalier' },
  { photo: PHOTOS.cuisinePasse, piece: 'cuisine' },
  { photo: PHOTOS.lampesBras, piece: 'lampes' },
  { photo: PHOTOS.plafondMiroir, piece: 'plafond' },
]

export default function Lieu() {
  const { t } = useLangue()
  return (
    <section id="lieu" className="section section--nuit lieu">
      <div className="container">
        <header className="section__entete lieu__entete" data-reveal>
          <div>
            <p className="surtitre">{t.lieu.surtitre}</p>
            <Titre texte={t.lieu.titre} />
            <Filet />
          </div>
          <p className="section__intro">{sansCoupure(t.lieu.texte)}</p>
        </header>

        <ul className="mosaique">
          {GALERIE.map(({ photo, piece }) => (
            <li key={photo.fichier} className="mosaique__element" data-reveal>
              <figure>
                <Photo photo={photo} sizes="(max-width: 599px) 92vw, (max-width: 1023px) 45vw, 370px" />
                <figcaption>{t.lieu.pieces[piece]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
