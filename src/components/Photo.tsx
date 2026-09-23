import type { Photo as InfosPhoto } from '../data/photos'
import { useLangue } from '../hooks/useLangue'

type Props = {
  photo: InfosPhoto
  /** Attribut sizes : largeur affichée selon l'écran. */
  sizes: string
  className?: string
  prioritaire?: boolean
}

export default function Photo({ photo, sizes, className, prioritaire }: Props) {
  const { langue } = useLangue()
  const srcSet = [
    ...photo.reduites.map((l) => `/images/${photo.fichier}-${l}.webp ${l}w`),
    `/images/${photo.fichier}.webp ${photo.largeur}w`,
  ].join(', ')
  return (
    <img
      className={className}
      src={`/images/${photo.fichier}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={photo.largeur}
      height={photo.hauteur}
      alt={photo.alt[langue]}
      loading={prioritaire ? 'eager' : 'lazy'}
      fetchPriority={prioritaire ? 'high' : undefined}
      decoding="async"
    />
  )
}
