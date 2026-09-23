import { LOGO, ROSE } from '../data/emblemes'

type Props = { className?: string; titre?: string }

/** Logo GIGI officiel, couleur héritée (currentColor). */
export function Logo({ className, titre }: Props) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${LOGO.largeur} ${LOGO.hauteur}`}
      role={titre ? 'img' : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={LOGO.d} />
    </svg>
  )
}

/** Rose en trait de la carte de Gigi, couleur héritée. */
export function Rose({ className }: Props) {
  return (
    <svg className={className} viewBox={`0 0 ${ROSE.largeur} ${ROSE.hauteur}`} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={ROSE.d} />
    </svg>
  )
}

/** Double filet ondulé, comme les séparateurs de la carte. */
export function Filet({ className }: { className?: string }) {
  return <span className={`filet ${className ?? ''}`} aria-hidden="true" />
}
