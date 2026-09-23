import { Rose } from '../../src/components/Emblemes'
import Citron from './Citron'

/** Décor flottant entre deux sections (citrons du papier peint, roses de la carte), en parallaxe. */
export default function Decor({ type }: { type: 'citrons' | 'roses' }) {
  const Objet = type === 'citrons' ? Citron : Rose
  return (
    <div className={`decor-entre decor-entre--${type}`} aria-hidden="true">
      <span className="decor-entre__objet decor-entre__objet--1" data-vitesse="0.9">
        <Objet />
      </span>
      <span className="decor-entre__objet decor-entre__objet--2" data-vitesse="0.45">
        <Objet />
      </span>
    </div>
  )
}
