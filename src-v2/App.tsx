import Header from '../src/components/Header'
import Cucina from '../src/components/Cucina'
import Carte from '../src/components/Carte'
import Infos from '../src/components/Infos'
import Reserver from '../src/components/Reserver'
import Footer from '../src/components/Footer'
import { useLangue } from '../src/hooks/useLangue'
import { useReveal } from '../src/hooks/useReveal'
import Hero from './components/Hero'
import Amore from './components/Amore'
import Maison from './components/Maison'
import Decor from './components/Decor'
import { useEffets } from './hooks/useEffets'

/*
  Version immersive : même contenu et mêmes données que la version classique (src/),
  avec l'accueil en profondeur, le manifeste qui s'allume, la maison de poupée en 3D à la place
  de la galerie « Il posto », et les effets communs de hooks/useEffets.ts.
*/
export default function App() {
  const { t } = useLangue()
  useReveal()
  useEffets()

  return (
    <>
      <a href="#contenu" className="lien-evitement">
        {t.lienEvitement}
      </a>
      <Header />
      <main id="contenu">
        <Hero />
        <Amore />
        <Decor type="citrons" />
        <Cucina />
        <Decor type="roses" />
        <Carte />
        <Maison />
        <Infos />
        <Reserver />
      </main>
      <Footer />
    </>
  )
}
