import { HORAIRES } from '../data/infos'
import type { Textes } from '../i18n'

const JOURS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Jour (0 = dimanche) et minutes écoulées depuis minuit, à l'heure de Gand. */
export function maintenantAGand(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Brussels',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const valeur = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return { jour: JOURS_EN.indexOf(valeur('weekday')), minutes: Number(valeur('hour')) * 60 + Number(valeur('minute')) }
}

export type Statut = { ouvert: boolean; libelle: string; jour: number }

/** Ouvert ou fermé en ce moment, avec la prochaine ouverture, dans la langue demandée. */
export function statutActuel(t: Textes, date = new Date()): Statut {
  const { jour, minutes } = maintenantAGand(date)
  const services = HORAIRES[jour]

  const enCours = services.find(([debut, fin]) => minutes >= debut && minutes < fin)
  if (enCours) return { ouvert: true, libelle: t.statut.ouvert(t.heure(enCours[1])), jour }

  const prochain = services.find(([debut]) => minutes < debut)
  if (prochain) {
    const dejaServi = services.some(([, fin]) => fin <= minutes)
    const heure = t.heure(prochain[0])
    return { ouvert: false, libelle: dejaServi ? t.statut.reouvre(heure) : t.statut.ouvre(heure), jour }
  }

  for (let i = 1; i <= 7; i++) {
    const suivant = (jour + i) % 7
    const premier = HORAIRES[suivant][0]
    if (!premier) continue
    const heure = t.heure(premier[0])
    return { ouvert: false, libelle: i === 1 ? t.statut.demain(heure) : t.statut.jour(t.jours[suivant], heure), jour }
  }
  return { ouvert: false, libelle: t.statut.ferme, jour }
}
