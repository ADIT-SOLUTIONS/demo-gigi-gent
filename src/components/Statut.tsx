import { useStatut } from '../hooks/useStatut'

/** Pastille « ouvert / fermé » en direct, à l'heure de Gand. */
export default function Statut({ className }: { className?: string }) {
  const statut = useStatut()
  return (
    <p className={`statut ${statut.ouvert ? 'statut--ouvert' : 'statut--ferme'} ${className ?? ''}`} role="status">
      <span className="statut__point" aria-hidden="true" />
      {statut.libelle}
    </p>
  )
}
