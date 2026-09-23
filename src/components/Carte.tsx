import { useRef, useState, type KeyboardEvent } from 'react'
import { CARTE } from '../data/carte'
import { LIENS } from '../data/infos'
import { useLangue } from '../hooks/useLangue'
import { Filet, Logo } from './Emblemes'

const LOCALES = { nl: 'nl-BE', en: 'en-BE', fr: 'fr-BE' } as const

export default function Carte() {
  const { langue, t } = useLangue()
  const [active, setActive] = useState(CARTE[0].id)
  const onglets = useRef<(HTMLButtonElement | null)[]>([])

  const prix = (valeur: number) =>
    new Intl.NumberFormat(LOCALES[langue], {
      minimumFractionDigits: valeur % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(valeur)

  // Flèches, Début et Fin pour passer d'un onglet à l'autre (motif ARIA « tabs »)
  const surTouche = (e: KeyboardEvent, index: number) => {
    const dernier = CARTE.length - 1
    const cible =
      e.key === 'ArrowRight' ? (index === dernier ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? dernier : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? dernier
      : null
    if (cible === null) return
    e.preventDefault()
    setActive(CARTE[cible].id)
    onglets.current[cible]?.focus()
  }

  return (
    <section id="carte" className="section carte">
      <div className="container">
        <header className="section__entete section__entete--centre" data-reveal>
          <p className="surtitre">{t.carte.surtitre}</p>
          <h2 className="titre">{t.carte.titre}</h2>
          <p className="section__intro">{t.carte.intro}</p>
        </header>

        <div className="menu cadre-double" data-reveal>
          <Logo className="menu__logo" />

          <div className="menu__onglets" role="tablist" aria-label={t.carte.rubriques}>
            {CARTE.map((rubrique, i) => (
              <button
                key={rubrique.id}
                ref={(el) => {
                  onglets.current[i] = el
                }}
                type="button"
                role="tab"
                id={`onglet-${rubrique.id}`}
                className="menu__onglet"
                aria-selected={active === rubrique.id}
                aria-controls={`rubrique-${rubrique.id}`}
                tabIndex={active === rubrique.id ? 0 : -1}
                onClick={() => setActive(rubrique.id)}
                onKeyDown={(e) => surTouche(e, i)}
              >
                {rubrique.titre}
              </button>
            ))}
          </div>

          {CARTE.map((rubrique) => (
            <div
              key={rubrique.id}
              id={`rubrique-${rubrique.id}`}
              role="tabpanel"
              aria-labelledby={`onglet-${rubrique.id}`}
              className="menu__rubrique"
              hidden={active !== rubrique.id}
              tabIndex={0}
            >
              {rubrique.groupes.map((groupe) => (
                <div key={groupe.titre} className="menu__groupe">
                  <h3 className="menu__groupe-titre">
                    <Filet />
                    <span>{groupe.titre}</span>
                    <Filet />
                  </h3>
                  {groupe.note && <p className="menu__note">{groupe.note[langue]}</p>}
                  <ul className="plats">
                    {groupe.plats.map((plat) => (
                      <li key={plat.nom} className="plat">
                        <p className="plat__ligne">
                          <span className="plat__nom">{plat.nom}</span>
                          <span className="plat__pointilles" aria-hidden="true" />
                          <span className="plat__prix">
                            {prix(plat.prix)}
                            <span className="sr-only"> {t.carte.euros}</span>
                          </span>
                        </p>
                        {plat.description && <p className="plat__description">{plat.description[langue]}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          <div className="menu__pied">
            {t.carte.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
            <a href={LIENS.cartePdf} className="lien" target="_blank" rel="noopener noreferrer">
              {t.carte.pdf}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
