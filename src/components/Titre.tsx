import type { CSSProperties, ElementType } from 'react'

type Props = { texte: string; className?: string; as?: ElementType }

/**
 * Titre découpé en mots (chaque mot dans son masque) : sans effet dans la version classique,
 * la version immersive s'en sert pour faire basculer les mots à l'apparition.
 */
export default function Titre({ texte, className = 'titre', as: Balise = 'h2' }: Props) {
  const mots = texte.split(' ')
  return (
    <Balise className={className} aria-label={texte}>
      {mots.map((mot, i) => (
        <span key={i} className="mot" aria-hidden="true">
          <span className="mot__interieur" style={{ '--i': i } as CSSProperties}>
            {mot}
          </span>
          {i < mots.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Balise>
  )
}
