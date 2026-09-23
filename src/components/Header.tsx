import { useEffect, useState } from 'react'
import { LANGUES } from '../i18n'
import { useLangue } from '../hooks/useLangue'
import { Logo } from './Emblemes'

export function ChoixLangue({ className }: { className?: string }) {
  const { langue, t, changer } = useLangue()
  return (
    <div className={`langues ${className ?? ''}`} role="group" aria-label={t.nav.langue}>
      {LANGUES.map((l) => (
        <button
          key={l.code}
          type="button"
          className="langues__choix"
          lang={l.code}
          aria-label={l.nom}
          aria-pressed={l.code === langue}
          onClick={() => changer(l.code)}
        >
          {l.court}
        </button>
      ))}
    </div>
  )
}

export default function Header() {
  const { t } = useLangue()
  const [scrolle, setScrolle] = useState(false)
  const [ouvert, setOuvert] = useState(false)

  const liens = [
    { href: '#amore', label: t.nav.amore },
    { href: '#carte', label: t.nav.carte },
    { href: '#lieu', label: t.nav.lieu },
    { href: '#infos', label: t.nav.infos },
  ]

  useEffect(() => {
    const surDefilement = () => setScrolle(window.scrollY > 24)
    surDefilement()
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => window.removeEventListener('scroll', surDefilement)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-ouvert', ouvert)
    const surTouche = (e: KeyboardEvent) => e.key === 'Escape' && setOuvert(false)
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [ouvert])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const surChangement = () => mq.matches && setOuvert(false)
    mq.addEventListener('change', surChangement)
    return () => mq.removeEventListener('change', surChangement)
  }, [])

  const fermer = () => setOuvert(false)

  return (
    <header className={`header ${scrolle || ouvert ? 'header--plein' : ''}`}>
      <div className="container header__inner">
        <a href="#accueil" className="header__logo" onClick={fermer} aria-label={t.nav.accueil}>
          <Logo />
        </a>

        <nav id="navigation" className={`nav ${ouvert ? 'nav--ouvert' : ''}`} aria-label="Navigation">
          <ul className="nav__liste">
            {liens.map((lien) => (
              <li key={lien.href}>
                <a href={lien.href} className="nav__lien" onClick={fermer}>
                  {lien.label}
                </a>
              </li>
            ))}
          </ul>
          <ChoixLangue className="nav__langues" />
          <a href="#reserver" className="btn btn--plein nav__cta" onClick={fermer}>
            {t.nav.reserver}
          </a>
        </nav>

        <button
          type="button"
          className={`burger ${ouvert ? 'burger--ouvert' : ''}`}
          aria-expanded={ouvert}
          aria-controls="navigation"
          aria-label={ouvert ? t.nav.fermer : t.nav.ouvrir}
          onClick={() => setOuvert((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
