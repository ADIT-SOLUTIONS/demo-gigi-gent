import { ADRESSE, CONTACT, HORAIRES, LIENS, ORDRE_JOURS } from '../data/infos'
import { useLangue } from '../hooks/useLangue'
import { useStatut } from '../hooks/useStatut'
import { Filet, Rose } from './Emblemes'

export default function Infos() {
  const { t } = useLangue()
  const statut = useStatut()

  return (
    <section id="infos" className="section infos">
      <div className="container">
        <header className="section__entete" data-reveal>
          <p className="surtitre">{t.infos.surtitre}</p>
          <h2 className="titre">{t.infos.titre}</h2>
          <Filet />
        </header>

        <div className="infos__grille">
          <div className="infos__colonne" data-reveal>
            <h3 className="infos__titre">{t.infos.horaires}</h3>
            <p className={`statut ${statut.ouvert ? 'statut--ouvert' : 'statut--ferme'}`}>
              <span className="statut__point" aria-hidden="true" />
              {statut.libelle}
            </p>
            <table className="horaires">
              <tbody>
                {ORDRE_JOURS.map((jour) => {
                  const services = HORAIRES[jour]
                  const aujourdhui = jour === statut.jour
                  return (
                    <tr key={jour} className={aujourdhui ? 'horaires__jour--actuel' : undefined}>
                      <th scope="row">
                        {t.jours[jour]}
                        {aujourdhui && <span className="horaires__marque">{t.infos.aujourdhui}</span>}
                      </th>
                      <td>
                        {services.length
                          ? services.map(([debut, fin]) => (
                              <span key={debut} className="horaires__service">
                                {t.heure(debut)}–{t.heure(fin)}
                              </span>
                            ))
                          : t.infos.ferme}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="infos__colonne" data-reveal>
            <h3 className="infos__titre">{t.infos.adresse}</h3>
            <address className="infos__adresse">
              Gigi
              <br />
              {ADRESSE.rue}
              <br />
              {ADRESSE.codePostal} {ADRESSE.ville}
            </address>
            <p className="infos__acces">{t.infos.acces}</p>

            <h3 className="infos__titre">{t.infos.contact}</h3>
            <p className="infos__contact">
              <a href={CONTACT.telephoneLien} className="lien">
                {CONTACT.telephone}
              </a>
              <br />
              <a href={`mailto:${CONTACT.email}`} className="lien">
                {CONTACT.email}
              </a>
            </p>

            <h3 className="infos__titre">{t.infos.services}</h3>
            <p className="infos__services">
              {t.infos.servicesTexte}{' '}
              <a href={LIENS.uberEats} className="lien" target="_blank" rel="noopener noreferrer">
                Uber Eats
              </a>
              {' · '}
              {LIENS.deliveroo.startsWith('http') ? (
                <a href={LIENS.deliveroo} className="lien" target="_blank" rel="noopener noreferrer">
                  Deliveroo
                </a>
              ) : (
                <span>Deliveroo {LIENS.deliveroo}</span>
              )}
            </p>
          </div>

          <div className="plan" data-reveal>
            <a href={LIENS.plan} className="plan__carte" target="_blank" rel="noopener noreferrer" aria-label={t.infos.plan}>
              <img
                src="/images/plan-600.webp"
                srcSet="/images/plan-600.webp 600w, /images/plan.webp 1200w"
                sizes="(max-width: 1023px) 92vw, 420px"
                width="1200"
                height="900"
                alt={t.infos.planAlt}
                loading="lazy"
                decoding="async"
              />
              <span className="plan__repere" aria-hidden="true">
                <Rose />
              </span>
            </a>
            <p className="plan__credit">
              ©{' '}
              <a href={LIENS.osm} target="_blank" rel="noopener noreferrer">
                OpenStreetMap
              </a>
            </p>
            <div className="plan__actions">
              <a href={LIENS.itineraire} className="btn btn--plein" target="_blank" rel="noopener noreferrer">
                {t.infos.itineraire}
              </a>
              <a href={LIENS.plan} className="btn btn--contour" target="_blank" rel="noopener noreferrer">
                {t.infos.plan}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
