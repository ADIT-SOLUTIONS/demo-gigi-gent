import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CONTACT, LIENS } from '../data/infos'
import { PHOTOS } from '../data/photos'
import { useLangue } from '../hooks/useLangue'
import { envoyerDemande, type Demande } from '../utils/envoi'
import { Filet } from './Emblemes'
import Photo from './Photo'

const VIDE: Demande = { nom: '', email: '', telephone: '', date: '', personnes: '', message: '' }

export default function Reserver() {
  const { t } = useLangue()
  const d = t.reserver.demande
  const [demande, setDemande] = useState<Demande>(VIDE)
  const [etat, setEtat] = useState<'repos' | 'ouvert' | 'envoye' | 'erreur'>('repos')

  const champ = (cle: keyof Demande) => ({
    name: cle,
    id: `demande-${cle}`,
    value: demande[cle],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDemande((v) => ({ ...v, [cle]: e.target.value })),
  })

  const envoyer = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setEtat(await envoyerDemande(demande, d))
    } catch {
      setEtat('erreur')
    }
  }

  return (
    <section id="reserver" className="section section--framboise reserver">
      <div className="container">
        <header className="section__entete section__entete--centre" data-reveal>
          <p className="surtitre">{t.reserver.surtitre}</p>
          <h2 className="titre">{t.reserver.titre}</h2>
          <Filet />
          <p className="section__intro">{t.reserver.texte}</p>
          <div className="reserver__actions">
            <a href={LIENS.reservation} className="btn btn--creme" target="_blank" rel="noopener noreferrer">
              {t.reserver.enLigne}
            </a>
            <a href={CONTACT.telephoneLien} className="btn btn--contour-creme">
              {t.reserver.appeler} · {CONTACT.telephone}
            </a>
          </div>
        </header>

        <div className="reserver__grille">
          <article className="carte-cadeau" data-reveal>
            <div className="carte-cadeau__photo">
              <Photo photo={PHOTOS.carteCadeau} sizes="(max-width: 1023px) 92vw, 460px" />
            </div>
            <div className="carte-cadeau__texte">
              <h3 className="bloc__titre">{t.reserver.cadeau.titre}</h3>
              <p>{t.reserver.cadeau.texte}</p>
              <a href={LIENS.carteCadeau} className="btn btn--plein" target="_blank" rel="noopener noreferrer">
                {t.reserver.cadeau.cta}
              </a>
            </div>
          </article>

          <form className="demande" onSubmit={envoyer} data-reveal>
            <h3 className="bloc__titre">{d.titre}</h3>
            <p className="demande__texte">{d.texte}</p>
            <div className="demande__grille">
              <div className="champ">
                <label htmlFor="demande-nom">{d.nom}</label>
                <input {...champ('nom')} type="text" autoComplete="name" required />
              </div>
              <div className="champ">
                <label htmlFor="demande-email">{d.email}</label>
                <input {...champ('email')} type="email" autoComplete="email" required />
              </div>
              <div className="champ">
                <label htmlFor="demande-telephone">
                  {d.telephone} <span className="champ__facultatif">({d.facultatif})</span>
                </label>
                <input {...champ('telephone')} type="tel" autoComplete="tel" />
              </div>
              <div className="champ">
                <label htmlFor="demande-date">
                  {d.date} <span className="champ__facultatif">({d.facultatif})</span>
                </label>
                <input {...champ('date')} type="date" />
              </div>
              <div className="champ">
                <label htmlFor="demande-personnes">
                  {d.personnes} <span className="champ__facultatif">({d.facultatif})</span>
                </label>
                <input {...champ('personnes')} type="number" min="1" inputMode="numeric" />
              </div>
              <div className="champ champ--large">
                <label htmlFor="demande-message">{d.message}</label>
                <textarea {...champ('message')} rows={4} required />
              </div>
            </div>
            <div className="demande__bas">
              <button type="submit" className="btn btn--plein">
                {d.envoyer}
              </button>
              <p className="demande__etat" role="status">
                {etat === 'ouvert' && d.ouvert}
                {etat === 'envoye' && d.envoye}
                {etat === 'erreur' && d.erreur(CONTACT.email)}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
