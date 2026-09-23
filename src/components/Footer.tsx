import { ADRESSE, CONTACT, LIENS, MENTIONS } from '../data/infos'
import { useLangue } from '../hooks/useLangue'
import { Logo, Rose } from './Emblemes'

export default function Footer() {
  const { t } = useLangue()
  const annee = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <a href={LIENS.instagram} className="instagram" target="_blank" rel="noopener noreferrer">
          <Rose className="instagram__rose" />
          <span className="instagram__texte">{t.instagram.texte}</span>
          <span className="instagram__compte">@gigi__6161</span>
          <span className="instagram__cta">{t.instagram.cta}</span>
        </a>

        <div className="footer__grille">
          <div className="footer__marque">
            <Logo className="footer__logo" titre="Gigi" />
            <p className="surtitre">{t.footer.signature}</p>
          </div>
          <address className="footer__bloc">
            {ADRESSE.rue}
            <br />
            {ADRESSE.codePostal} {ADRESSE.ville}
          </address>
          <p className="footer__bloc">
            <a href={CONTACT.telephoneLien}>{CONTACT.telephone}</a>
            <br />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
          <p className="footer__bloc">
            <a href={LIENS.reservation} target="_blank" rel="noopener noreferrer">
              {t.nav.reserver}
            </a>
            <br />
            <a href={LIENS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </p>
        </div>

        <div className="footer__bas">
          <p>
            © {annee} Gigi · {MENTIONS.societe} · {MENTIONS.bce}
          </p>
          <p className="footer__legal">
            <a href="#mentions-legales">{t.footer.mentions}</a>
            <a href="#confidentialite">{t.footer.confidentialite}</a>
          </p>
          <p>{t.footer.credits}</p>
          <p>
            {t.footer.realise}{' '}
            <a href={LIENS.aditSolutions} target="_blank" rel="noopener">
              AD IT Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
