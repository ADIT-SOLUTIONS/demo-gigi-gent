import { useEffect, useState } from 'react'
import { statutActuel } from '../utils/horaires'
import { useLangue } from './useLangue'

/** Statut ouvert ou fermé, recalculé toutes les 30 secondes et à chaque changement de langue. */
export function useStatut() {
  const { t } = useLangue()
  const [maintenant, setMaintenant] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setMaintenant(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return statutActuel(t, maintenant)
}
