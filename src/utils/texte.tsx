import { Fragment, type ReactNode } from 'react'

// Noms propres à ne jamais couper en fin de ligne (le trait d'union de « Jean-Philippe » est une coupure possible)
const INSECABLES = /(Jean-Philippe Demeyer)/

/** Rend un texte en gardant les noms propres sur une seule ligne. */
export function sansCoupure(texte: string): ReactNode {
  return texte.split(INSECABLES).map((morceau, i) =>
    i % 2 ? (
      <span key={i} className="insecable">
        {morceau}
      </span>
    ) : (
      <Fragment key={i}>{morceau}</Fragment>
    ),
  )
}
