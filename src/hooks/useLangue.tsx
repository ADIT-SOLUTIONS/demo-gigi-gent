import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LANGUES, TEXTES, type Langue, type Textes } from '../i18n'

const CLE = 'gigi-langue'

const estLangue = (valeur: unknown): valeur is Langue => LANGUES.some((l) => l.code === valeur)

function lire(): string | null {
  try {
    return localStorage.getItem(CLE)
  } catch {
    return null
  }
}

/** Langue de départ : ?lang= dans l'adresse, puis le dernier choix du visiteur, puis son navigateur, sinon le néerlandais. */
function langueInitiale(): Langue {
  const parametre = new URLSearchParams(location.search).get('lang')
  if (estLangue(parametre)) return parametre
  const memorisee = lire()
  if (estLangue(memorisee)) return memorisee
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = l.slice(0, 2).toLowerCase()
    if (estLangue(code)) return code
  }
  return 'nl'
}

type ContexteLangue = { langue: Langue; t: Textes; changer: (langue: Langue) => void }

const Contexte = createContext<ContexteLangue | null>(null)

export function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>(langueInitiale)

  const changer = useCallback((nouvelle: Langue) => {
    setLangue(nouvelle)
    // Une langue imposée par l'adresse (?lang=) suit le choix, pour qu'un rechargement le conserve
    const adresse = new URL(location.href)
    if (adresse.searchParams.has('lang')) {
      adresse.searchParams.set('lang', nouvelle)
      history.replaceState(history.state, '', adresse)
    }
    try {
      localStorage.setItem(CLE, nouvelle)
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour cette visite
    }
  }, [])

  useEffect(() => {
    const t = TEXTES[langue]
    document.documentElement.lang = langue
    document.title = t.meta.titre
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [langue])

  // Même choix de langue dans les autres onglets (et dans l'autre version de la démo)
  useEffect(() => {
    const surStockage = (e: StorageEvent) => {
      if (e.key === CLE && estLangue(e.newValue)) setLangue(e.newValue)
    }
    addEventListener('storage', surStockage)
    return () => removeEventListener('storage', surStockage)
  }, [])

  const valeur = useMemo(() => ({ langue, t: TEXTES[langue], changer }), [langue, changer])
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
}

export function useLangue() {
  const contexte = useContext(Contexte)
  if (!contexte) throw new Error('useLangue doit être utilisé dans LangueProvider')
  return contexte
}
