import { CONTACT } from '../data/infos'

/*
  Envoi du formulaire « Un groupe, une question ? ».
  Pas de serveur pour l'instant : la demande ouvre la messagerie du visiteur avec un e-mail prérempli.
  Pour brancher un vrai service, passer MODE à 'formspree' et renseigner FORMSPREE_URL
  (ou remplacer envoyerDemande par un appel à l'API de son choix).
*/
const MODE = 'mailto' as 'mailto' | 'formspree'
const FORMSPREE_URL = '[URL_FORMSPREE]' // ex. https://formspree.io/f/xxxxxxx

export type Demande = {
  nom: string
  email: string
  telephone: string
  date: string
  personnes: string
  message: string
}

type Libelles = { nom: string; email: string; telephone: string; date: string; personnes: string; sujet: string }

function corps(d: Demande, l: Libelles) {
  const lignes = [`${l.nom}: ${d.nom}`, `${l.email}: ${d.email}`]
  if (d.telephone) lignes.push(`${l.telephone}: ${d.telephone}`)
  if (d.date) lignes.push(`${l.date}: ${d.date}`)
  if (d.personnes) lignes.push(`${l.personnes}: ${d.personnes}`)
  lignes.push('', d.message)
  return lignes.join('\n')
}

/** Renvoie 'ouvert' (messagerie ouverte) ou 'envoye' (service en ligne). */
export async function envoyerDemande(d: Demande, l: Libelles): Promise<'ouvert' | 'envoye'> {
  if (MODE === 'formspree') {
    const reponse = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(d),
    })
    if (!reponse.ok) throw new Error(`Envoi impossible (${reponse.status})`)
    return 'envoye'
  }
  const sujet = `${l.sujet} : ${d.nom}${d.date ? ` (${d.date})` : ''}`
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps(d, l))}`
  return 'ouvert'
}
