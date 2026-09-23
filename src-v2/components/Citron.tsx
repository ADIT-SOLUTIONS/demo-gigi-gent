import type { SVGProps } from 'react'

/** Citron et sa feuille, dessinés d'après le papier peint de la salle aux citrons. */
export default function Citron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 100" focusable="false" {...props}>
      <path d="M58 40 C70 18 98 12 112 20 C100 30 84 44 58 40 Z" fill="#3d6d4d" />
      <path d="M60 39 C78 30 96 24 110 21" fill="none" stroke="#27493a" strokeWidth="2" />
      <path
        d="M8 62 C10 42 34 30 56 36 C78 42 92 60 88 76 C84 92 58 98 36 90 C18 84 6 76 8 62 Z"
        fill="#efbd33"
      />
      <path d="M22 54 C30 44 44 42 54 46" fill="none" stroke="#ffe486" strokeWidth="5" strokeLinecap="round" />
      <path d="M8 62 C4 60 2 64 4 67 C6 69 8 66 8 62 Z M88 76 C93 78 95 74 92 71 C90 70 88 72 88 76 Z" fill="#d49a1c" />
    </svg>
  )
}
