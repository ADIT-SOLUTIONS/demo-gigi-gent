import type { Texte } from './carte'

/*
  Photos du site (public/images/, générées par scripts/images.py).
  Sources : animation d'accueil de gigi6161.be (2021), Studio Sissi et Zware Jongens (agences de Gigi).
*/

export type Photo = {
  fichier: string
  /** Largeur et hauteur du fichier principal (le plus grand). */
  largeur: number
  hauteur: number
  /** Largeurs réduites disponibles (fichier-LARGEUR.webp). */
  reduites: number[]
  alt: Texte
}

const p = (fichier: string, largeur: number, hauteur: number, reduites: number[], en: string, nl: string, fr: string): Photo => ({
  fichier,
  largeur,
  hauteur,
  reduites,
  alt: { en, nl, fr },
})

export const PHOTOS = {
  salleCitrons: p(
    'salle-citrons', 683, 1024, [460],
    'The lemon room: lemon-patterned wallpaper and benches, small white tables, lamps held by sculpted arms',
    'De citroenzaal: behang en banken met citroenen, witte tafeltjes, lampen gedragen door gebeeldhouwde armen',
    'La salle aux citrons : papier peint et banquettes à citrons, guéridons blancs, lampes tenues par des bras sculptés',
  ),
  madoneStore: p(
    'madone-store', 1040, 692, [640],
    'A Madonna statue under red and white striped awnings',
    'Een Madonnabeeld onder rood-wit gestreepte luifels',
    'Une statue de madone sous les stores rayés rouge et blanc',
  ),
  entreeToast: p(
    'entree-toast', 692, 1024, [460],
    'Two men raising a glass on the green steps of the arched entrance',
    'Twee mannen heffen het glas op de groene trappen van de boogdeur',
    'Deux hommes lèvent leur verre sur les marches vertes de l’entrée en arc',
  ),
  roseNeon: p(
    'rose-neon', 692, 1024, [460],
    'Red neon rose on the facade',
    'Rode neonroos op de gevel',
    'Rose en néon rouge sur la façade',
  ),
  tablePartage: p(
    'table-partage', 1038, 692, [640],
    'Friends sharing dishes around a white tablecloth, seen from above',
    'Vrienden delen gerechten rond een wit tafellaken, van bovenaf gezien',
    'Des amis partagent des plats autour d’une nappe blanche, vus du dessus',
  ),
  lampesBras: p(
    'lampes-bras', 692, 1024, [460],
    'Wall lamps with red fringed shades held by sculpted arms',
    'Wandlampen met rode kapjes, gedragen door gebeeldhouwde armen',
    'Appliques aux abat-jour rouges tenues par des bras sculptés',
  ),
  escalierVert: p(
    'escalier-vert', 692, 1024, [460],
    'The green staircase with lemon wallpaper',
    'De groene trap met citroenbehang',
    'L’escalier vert et son papier peint aux citrons',
  ),
  vitrineStatues: p(
    'vitrine-statues', 692, 1024, [460],
    'Salmon-pink Roman statues seen through the window',
    'Zalmroze Romeinse beelden door het raam gezien',
    'Statues romaines rose saumon vues à travers la vitrine',
  ),
  facadeNuit: p(
    'facade-nuit', 692, 1024, [460],
    'The facade at night, lit in red, with a neon rose',
    'De gevel ’s nachts, rood verlicht, met een neonroos',
    'La façade la nuit, éclairée en rouge, avec une rose en néon',
  ),
  verresVin: p(
    'verres-vin', 896, 1024, [520],
    'Wine glasses on a white tablecloth at the end of the evening',
    'Wijnglazen op een wit tafellaken aan het einde van de avond',
    'Verres à vin sur une nappe blanche en fin de soirée',
  ),
  barVert: p(
    'bar-vert', 682, 1024, [460],
    'The bar: salmon-pink stools on a green floor with white lines, under striped awnings',
    'De bar: zalmroze krukken op een groene vloer met witte lijnen, onder gestreepte luifels',
    'Le bar : tabourets rose saumon sur un sol vert à lignes blanches, sous les stores rayés',
  ),
  cuisinePasse: p(
    'cuisine-passe', 1044, 696, [640],
    'A chef dressing plates at the pass of the open kitchen',
    'Een chef werkt borden af aan de pass van de open keuken',
    'Un chef dresse les assiettes au passe de la cuisine ouverte',
  ),
  plafondMiroir: p(
    'plafond-miroir', 682, 1024, [460],
    'The dining room reflected in the mirrored ceiling',
    'De eetzaal weerspiegeld in het spiegelplafond',
    'La salle reflétée dans le plafond en miroirs',
  ),
  equipe: p(
    'equipe', 692, 1024, [460],
    'The Gigi team in front of the arched entrance',
    'Het team van Gigi voor de boogdeur',
    'L’équipe de Gigi devant l’entrée en arc',
  ),
  boiteCitrons: p(
    'boite-citrons', 700, 1024, [460],
    'The yellow striped Gigi pizza box on a table in the lemon room',
    'De geel gestreepte pizzadoos van Gigi op een tafel in de citroenzaal',
    'La boîte à pizza rayée jaune de Gigi sur une table de la salle aux citrons',
  ),
  bouteilles: p(
    'bouteilles', 692, 1024, [460],
    'Backlit shelves of gin and spirits at the bar',
    'Verlichte rekken met gin en sterke drank aan de bar',
    'Étagères rétroéclairées de gins et spiritueux au bar',
  ),
  facadeRoses: p(
    'facade-roses', 692, 1024, [460],
    'Two neon roses glowing on the facade at night',
    'Twee neonrozen die ’s nachts op de gevel gloeien',
    'Deux roses en néon allumées sur la façade, la nuit',
  ),
  grandeSalle: p(
    'grande-salle', 692, 1024, [460],
    'The main dining room: a long white table, striped benches, statues and a mirrored ceiling',
    'De grote zaal: een lange witte tafel, gestreepte banken, beelden en een spiegelplafond',
    'La grande salle : longue table blanche, banquettes rayées, statues et plafond en miroirs',
  ),
  tablePates: p(
    'table-pates', 1034, 602, [640],
    'Pasta dishes and glasses of wine on a white table, seen from above',
    'Pastagerechten en glazen wijn op een witte tafel, van bovenaf gezien',
    'Assiettes de pâtes et verres de vin sur une table blanche, vues du dessus',
  ),
  boiteVert: p(
    'boite-vert', 1039, 694, [640],
    'The Gigi pizza box, yellow stripes and a rose, on the green bar floor',
    'De pizzadoos van Gigi, gele strepen en een roos, op de groene barvloer',
    'La boîte à pizza de Gigi, rayures jaunes et rose, sur le sol vert du bar',
  ),
  rosesNeon: p(
    'roses-neon', 789, 802, [480],
    'Pink neon roses on the red facade',
    'Roze neonrozen op de rode gevel',
    'Roses en néon rose sur la façade rouge',
  ),
  platCitrons: p(
    'plat-citrons', 1100, 1649, [700],
    'Pasta on a blue and white plate, lemons and a spritz in the sun',
    'Pasta op een blauw-wit bord, citroenen en een spritz in de zon',
    'Pâtes dans une assiette bleue et blanche, citrons et spritz au soleil',
  ),
  spaghetti: p(
    'spaghetti', 1100, 1649, [700],
    'Spaghetti on a floral porcelain plate',
    'Spaghetti op een bord van gebloemd porselein',
    'Spaghetti dans une assiette en porcelaine fleurie',
  ),
  pizzaPartage: p(
    'pizza-partage', 1600, 1068, [900],
    'Two women biting into the same slice of pizza',
    'Twee vrouwen bijten in hetzelfde stuk pizza',
    'Deux femmes croquent la même part de pizza',
  ),
  carteCadeau: p(
    'carte-cadeau', 1400, 934, [800],
    'Gigi gift cards with pink, green and white stripes',
    'Cadeaubonnen van Gigi met roze, groene en witte strepen',
    'Cartes cadeaux Gigi à rayures roses, vertes et blanches',
  ),
  banquet: p(
    'banquet', 1920, 709, [1200, 760],
    'A joyful banquet in front of the salmon-pink statues',
    'Een uitbundig feestmaal voor de zalmroze beelden',
    'Un banquet joyeux devant les statues rose saumon',
  ),
  pizzaiolo: p(
    'pizzaiolo', 1100, 1650, [700],
    'The pizzaiolo stretching dough in the open kitchen',
    'De pizzaiolo rekt het deeg uit in de open keuken',
    'Le pizzaiolo étire la pâte dans la cuisine ouverte',
  ),
  boitePizza: p(
    'boite-pizza', 1100, 1650, [700],
    'Close-up of the yellow striped pizza box with the Gigi rose',
    'Close-up van de geel gestreepte pizzadoos met de roos van Gigi',
    'Gros plan sur la boîte à pizza rayée jaune et sa rose Gigi',
  ),
} satisfies Record<string, Photo>
