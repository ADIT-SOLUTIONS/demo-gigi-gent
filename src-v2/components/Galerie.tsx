import { useEffect, useState } from 'react'
import { PHOTOS, type Photo as InfosPhoto } from '../../src/data/photos'
import { useLangue } from '../../src/hooks/useLangue'
import type { Textes } from '../../src/i18n'
import Photo from '../../src/components/Photo'

type Piece = keyof Textes['lieu']['pieces']
type Element = { photo: InfosPhoto; piece: Piece }

// Colonnes composées à la main (deux portraits et un paysage chacune) : même hauteur, parallaxe différente
const COLONNES: Element[][] = [
  [
    { photo: PHOTOS.facadeRoses, piece: 'facade' },
    { photo: PHOTOS.madoneStore, piece: 'stores' },
    { photo: PHOTOS.grandeSalle, piece: 'grandeSalle' },
  ],
  [
    { photo: PHOTOS.cuisinePasse, piece: 'cuisine' },
    { photo: PHOTOS.barVert, piece: 'bar' },
    { photo: PHOTOS.lampesBras, piece: 'lampes' },
  ],
  [
    { photo: PHOTOS.escalierVert, piece: 'escalier' },
    { photo: PHOTOS.plafondMiroir, piece: 'plafond' },
    { photo: PHOTOS.boiteVert, piece: 'boite' },
  ],
]
const VITESSES = [0.05, -0.07, 0.09]

/** Galerie des pièces en colonnes qui glissent à des vitesses différentes (trois colonnes, deux sur mobile). */
export default function Galerie() {
  const { t } = useLangue()
  const [trois, setTrois] = useState(() => matchMedia('(min-width: 900px)').matches)

  useEffect(() => {
    const mq = matchMedia('(min-width: 900px)')
    const surChangement = () => setTrois(mq.matches)
    mq.addEventListener('change', surChangement)
    return () => mq.removeEventListener('change', surChangement)
  }, [])

  const colonnes = trois ? COLONNES : [[...COLONNES[0], ...COLONNES[2].slice(0, 1)], [...COLONNES[1], ...COLONNES[2].slice(1)]]

  return (
    <div className={`galerie galerie--${colonnes.length}`}>
      {colonnes.map((colonne, c) => (
        <ul key={c} className="galerie__colonne" data-vitesse={VITESSES[c]}>
          {colonne.map(({ photo, piece }) => (
            <li key={photo.fichier}>
              <figure className="galerie__photo">
                <div className="galerie__cadre" data-relief>
                  <Photo photo={photo} sizes="(max-width: 899px) 46vw, 370px" />
                </div>
                <figcaption>{t.lieu.pieces[piece]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
