import Header from './components/Header'
import Hero from './components/Hero'
import Amore from './components/Amore'
import Cucina from './components/Cucina'
import Carte from './components/Carte'
import Lieu from './components/Lieu'
import Infos from './components/Infos'
import Reserver from './components/Reserver'
import Footer from './components/Footer'
import { useLangue } from './hooks/useLangue'
import { useReveal } from './hooks/useReveal'

export default function App() {
  const { t } = useLangue()
  useReveal()

  return (
    <>
      <a href="#contenu" className="lien-evitement">
        {t.lienEvitement}
      </a>
      <Header />
      <main id="contenu">
        <Hero />
        <Amore />
        <Cucina />
        <Carte />
        <Lieu />
        <Infos />
        <Reserver />
      </main>
      <Footer />
    </>
  )
}
