/*
  Tous les textes du site, en néerlandais (langue par défaut à Gand), anglais et français.
  Le manifeste est celui de Gigi (carte et site gigi6161.be), traduit depuis l'anglais.
  La carte des plats est dans src/data/carte.ts.
*/

export type Langue = 'nl' | 'en' | 'fr'

export const LANGUES: { code: Langue; court: string; nom: string }[] = [
  { code: 'nl', court: 'NL', nom: 'Nederlands' },
  { code: 'en', court: 'EN', nom: 'English' },
  { code: 'fr', court: 'FR', nom: 'Français' },
]

const deuxChiffres = (n: number) => String(n).padStart(2, '0')
const heure24 = (minutes: number) => `${Math.floor(minutes / 60) % 24}:${deuxChiffres(minutes % 60)}`
const heureFr = (minutes: number) => {
  const m = minutes % 60
  return `${Math.floor(minutes / 60) % 24}h${m ? deuxChiffres(m) : ''}`
}

const FR = {
  meta: {
    titre: 'Gigi | Restaurant italien à Gand, Belfortstraat 24',
    description:
      'Gigi, cucina amorosa à Gand : pizzas, pâtes faites main, antipasti et spritz dans un décor signé Jean-Philippe Demeyer, Belfortstraat 24. Réservation en ligne.',
  },
  lienEvitement: 'Aller au contenu',
  nav: {
    amore: 'L’amore',
    carte: 'La carte',
    lieu: 'Le lieu',
    infos: 'Infos',
    reserver: 'Réserver',
    accueil: 'Gigi, retour à l’accueil',
    ouvrir: 'Ouvrir le menu',
    fermer: 'Fermer le menu',
    langue: 'Langue du site',
  },
  jours: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  heure: heureFr,
  statut: {
    ouvert: (h: string) => `Ouvert jusqu’à ${h}`,
    ouvre: (h: string) => `Fermé, ouvre à ${h}`,
    reouvre: (h: string) => `Fermé, réouvre à ${h}`,
    demain: (h: string) => `Fermé, ouvre demain à ${h}`,
    jour: (jour: string, h: string) => `Fermé, ouvre ${jour} à ${h}`,
    ferme: 'Fermé',
  },
  hero: {
    titreCache: 'Gigi, restaurant italien à Gand',
    surtitre: 'Cucina amorosa · Gent',
    accroche: 'L’amour sous toutes ses formes délicieuses.',
    texte:
      'Pizzas, pâtes faites main, antipasti à partager et spritz, dans un décor signé Jean-Philippe Demeyer, à deux pas de Sint-Jacobs.',
    reserver: 'Réserver une table',
    carte: 'Voir la carte',
  },
  amore: {
    surtitre: '6161 reasons to be (more) alive',
    titre: 'Gigi is for lovers',
    manifeste: [
      'Vous êtes vivant. Là, maintenant. Alors vivez comme tel.',
      'Mangez, buvez, parlez, chantez, embrassez, habillez-vous et faites la tête de quelqu’un d’amoureux.',
      'Pas seulement l’amour de la bonne chère : l’amour sous toutes ses formes les plus délicieuses. 6161 sortes d’amore. Et le compte continue.',
    ],
    devise: 'L’amore domina senza regole.',
    source: 'Extrait du manifeste de Gigi',
    faits: [
      { titre: 'Le nom', texte: 'Gigi doit son nom à Gigi l’amoroso, le séducteur de la chanson de Dalida.' },
      { titre: 'Depuis 2021', texte: 'Ouvert à l’automne 2021 dans la Belfortstraat, au cœur du quartier Sint-Jacobs.' },
      {
        titre: 'Le décor',
        texte: 'Signé Jean-Philippe Demeyer : citrons au mur, statues rose saumon, plafonds en miroirs et roses en néon.',
      },
    ],
  },
  cucina: {
    surtitre: 'La cucina',
    titre: 'Cuisine ouverte, pâtes faites main',
    texte:
      'Les pizzas se préparent sous vos yeux dans la cuisine ouverte. Les pâtes sont faites à la main, les ravioli et les gnocchi fatto in casa, le pesto aussi (pour le reste, c’est un secret). Au bar, tous les jus, sirops et purées des cocktails sont maison.',
    piliers: [
      {
        titre: 'Pizza',
        texte: 'De la Not so Margherita à la Mystic Pink Panther : pesto de pistache, mortadelle et stracciatella.',
      },
      {
        titre: 'Pasta',
        texte: 'Carbonara au guanciale, paccheri au fenouil et cacio e pepe à la truffe servies dans la meule, pour deux.',
      },
      {
        titre: 'Aperitivo',
        texte: 'Spritz, negroni maison au Campari infusé à la cannelle, cocktails et mocktails.',
      },
    ],
  },
  carte: {
    surtitre: 'Il menu',
    titre: 'La carte',
    intro: 'Antipasti à partager, pizzas, primi et dolci. Au bar, spritz, negroni et cocktails maison.',
    rubriques: 'Rubriques de la carte',
    notes: [
      'Coperto 1 € par personne · Un plat minimum par personne · Une table, une addition',
      'Une allergie ? Demandez-nous. La composition des plats peut changer.',
    ],
    pdf: 'Carte complète (PDF)',
    euros: 'euros',
  },
  lieu: {
    surtitre: 'Il posto',
    titre: 'Passez la porte en arc',
    texte:
      'Derrière la façade en pierre de la Belfortstraat, Jean-Philippe Demeyer a composé un restaurant comme un décor de cinéma : roses en néon à l’entrée, grande salle sous un plafond de miroirs, bar sur un sol vert rayé de blanc, salle aux citrons et statues rose saumon.',
    pieces: {
      facade: 'La façade',
      grandeSalle: 'La grande salle',
      bar: 'Le bar',
      citrons: 'La salle aux citrons',
      plafond: 'Le plafond en miroirs',
      escalier: 'L’escalier vert',
      statues: 'Les statues',
      lampes: 'Les lampes',
      stores: 'Sous les stores rayés',
      boite: 'La boîte à pizza',
      cuisine: 'La cuisine ouverte',
    },
  },
  infos: {
    surtitre: 'Info',
    titre: 'Horaires et accès',
    horaires: 'Horaires',
    aujourdhui: 'aujourd’hui',
    ferme: 'Fermé',
    adresse: 'Adresse',
    acces: 'Quartier Sint-Jacobs, à 3 minutes à pied du parking Vrijdagmarkt.',
    itineraire: 'Itinéraire',
    plan: 'Ouvrir le plan',
    planAlt: 'Plan du quartier Sint-Jacobs autour de Gigi, Belfortstraat 24 à Gand',
    contact: 'Contact',
    services: 'Sur place, à emporter, en livraison',
    servicesTexte: 'À emporter, ou en livraison avec Uber Eats et Deliveroo.',
  },
  reserver: {
    surtitre: 'Prenota',
    titre: 'Une table pour deux, ou pour 6161',
    texte: 'Réservation en ligne, ou par téléphone.',
    enLigne: 'Réserver en ligne',
    appeler: 'Appeler',
    cadeau: {
      titre: 'Offrir Gigi',
      texte: 'Une carte cadeau, pour un dîner à deux ou une grande tablée.',
      cta: 'Acheter une carte cadeau',
    },
    demande: {
      titre: 'Un groupe, une question ?',
      texte: 'Décrivez votre demande : elle nous arrive par e-mail.',
      nom: 'Nom',
      email: 'E-mail',
      telephone: 'Téléphone',
      facultatif: 'facultatif',
      date: 'Date souhaitée',
      personnes: 'Nombre de personnes',
      message: 'Votre message',
      envoyer: 'Envoyer',
      ouvert: 'Votre messagerie s’ouvre avec le message prérempli.',
      envoye: 'Merci, votre message est bien parti.',
      erreur: (email: string) => `L’envoi n’a pas fonctionné. Écrivez-nous à ${email}.`,
      sujet: 'Demande pour Gigi',
    },
  },
  instagram: {
    texte: 'Les 6161 raisons, au jour le jour',
    cta: 'Suivre Gigi sur Instagram',
  },
  footer: {
    signature: 'Cucina amorosa · Gent',
    mentions: 'Mentions légales',
    confidentialite: 'Confidentialité',
    credits: 'Photos : Gigi, Studio Sissi, Zware Jongens. Plan : © contributeurs OpenStreetMap.',
    realise: 'Site réalisé par',
  },
}

export type Textes = typeof FR

const NL: Textes = {
  meta: {
    titre: 'Gigi | Italiaans restaurant in Gent, Belfortstraat 24',
    description:
      'Gigi, cucina amorosa in Gent: pizza, handgemaakte pasta, antipasti en spritz in een interieur van Jean-Philippe Demeyer, Belfortstraat 24. Online reserveren.',
  },
  lienEvitement: 'Naar de inhoud',
  nav: {
    amore: 'L’amore',
    carte: 'De kaart',
    lieu: 'De zaak',
    infos: 'Info',
    reserver: 'Reserveren',
    accueil: 'Gigi, terug naar boven',
    ouvrir: 'Menu openen',
    fermer: 'Menu sluiten',
    langue: 'Taal van de site',
  },
  jours: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  heure: heure24,
  statut: {
    ouvert: (h) => `Nu open tot ${h}`,
    ouvre: (h) => `Gesloten, open om ${h}`,
    reouvre: (h) => `Gesloten, weer open om ${h}`,
    demain: (h) => `Gesloten, morgen open om ${h}`,
    jour: (jour, h) => `Gesloten, ${jour} open om ${h}`,
    ferme: 'Gesloten',
  },
  hero: {
    titreCache: 'Gigi, Italiaans restaurant in Gent',
    surtitre: 'Cucina amorosa · Gent',
    accroche: 'Liefde in al haar heerlijke vormen.',
    texte:
      'Pizza, handgemaakte pasta, antipasti om te delen en spritz, in een interieur van Jean-Philippe Demeyer, vlak bij Sint-Jacobs.',
    reserver: 'Reserveer een tafel',
    carte: 'Bekijk de kaart',
  },
  amore: {
    surtitre: '6161 reasons to be (more) alive',
    titre: 'Gigi is for lovers',
    manifeste: [
      'Je leeft. Nu, op dit moment. Gedraag je er dan ook naar.',
      'Eet, drink, praat, zing, kus, kleed je en trek een gezicht alsof je verliefd bent.',
      'Niet alleen liefde voor eten: liefde in al haar heerlijkste vormen. 6161 soorten amore. En we tellen verder.',
    ],
    devise: 'L’amore domina senza regole.',
    source: 'Uit het manifest van Gigi',
    faits: [
      { titre: 'De naam', texte: 'Gigi dankt zijn naam aan Gigi l’amoroso, de charmeur uit het lied van Dalida.' },
      { titre: 'Sinds 2021', texte: 'Open sinds het najaar van 2021 in de Belfortstraat, in hartje Sint-Jacobs.' },
      {
        titre: 'Het decor',
        texte: 'Van de hand van Jean-Philippe Demeyer: citroenen aan de muur, zalmroze beelden, spiegelplafonds en neonrozen.',
      },
    ],
  },
  cucina: {
    surtitre: 'La cucina',
    titre: 'Open keuken, handgemaakte pasta',
    texte:
      'De pizza’s worden voor je ogen gemaakt in de open keuken. De pasta is handgemaakt, de ravioli en gnocchi zijn fatto in casa, net als de pesto (de rest blijft geheim). Aan de bar zijn alle sappen, siropen en purees voor de cocktails huisgemaakt.',
    piliers: [
      {
        titre: 'Pizza',
        texte: 'Van de Not so Margherita tot de Mystic Pink Panther: pistachepesto, mortadella en stracciatella.',
      },
      {
        titre: 'Pasta',
        texte: 'Carbonara met guanciale, paccheri met venkel en cacio e pepe met truffel, geserveerd in de kaasbol, voor twee.',
      },
      {
        titre: 'Aperitivo',
        texte: 'Spritz, een huisnegroni met Campari op kaneel, cocktails en mocktails.',
      },
    ],
  },
  carte: {
    surtitre: 'Il menu',
    titre: 'De kaart',
    intro: 'Antipasti om te delen, pizza, primi en dolci. Aan de bar spritz, negroni en huiscocktails.',
    rubriques: 'Onderdelen van de kaart',
    notes: [
      'Coperto € 1 per persoon · Minstens één gerecht per persoon · Eén tafel, één rekening',
      'Allergie? Vraag het ons. De samenstelling van de gerechten kan wijzigen.',
    ],
    pdf: 'Volledige kaart (pdf)',
    euros: 'euro',
  },
  lieu: {
    surtitre: 'Il posto',
    titre: 'Stap door de boogdeur',
    texte:
      'Achter de stenen gevel in de Belfortstraat maakte Jean-Philippe Demeyer een restaurant als een filmdecor: neonrozen aan de ingang, een grote zaal onder een spiegelplafond, een bar op een groene vloer met witte lijnen, een citroenzaal en zalmroze beelden.',
    pieces: {
      facade: 'De gevel',
      grandeSalle: 'De grote zaal',
      bar: 'De bar',
      citrons: 'De citroenzaal',
      plafond: 'Het spiegelplafond',
      escalier: 'De groene trap',
      statues: 'De beelden',
      lampes: 'De lampen',
      stores: 'Onder de gestreepte luifels',
      boite: 'De pizzadoos',
      cuisine: 'De open keuken',
    },
  },
  infos: {
    surtitre: 'Info',
    titre: 'Openingsuren en bereikbaarheid',
    horaires: 'Openingsuren',
    aujourdhui: 'vandaag',
    ferme: 'Gesloten',
    adresse: 'Adres',
    acces: 'In de Sint-Jacobswijk, op 3 minuten wandelen van parking Vrijdagmarkt.',
    itineraire: 'Route',
    plan: 'Open de kaart',
    planAlt: 'Kaart van de Sint-Jacobswijk rond Gigi, Belfortstraat 24 in Gent',
    contact: 'Contact',
    services: 'Ter plaatse, afhalen of levering',
    servicesTexte: 'Afhalen, of laten leveren via Uber Eats en Deliveroo.',
  },
  reserver: {
    surtitre: 'Prenota',
    titre: 'Een tafel voor twee, of voor 6161',
    texte: 'Reserveer online of bel ons.',
    enLigne: 'Online reserveren',
    appeler: 'Bellen',
    cadeau: {
      titre: 'Geef Gigi cadeau',
      texte: 'Een cadeaubon, voor een etentje met twee of een lange tafel vol vrienden.',
      cta: 'Koop een cadeaubon',
    },
    demande: {
      titre: 'Een groep, een vraag?',
      texte: 'Beschrijf je aanvraag: ze komt bij ons toe per e-mail.',
      nom: 'Naam',
      email: 'E-mail',
      telephone: 'Telefoon',
      facultatif: 'optioneel',
      date: 'Gewenste datum',
      personnes: 'Aantal personen',
      message: 'Je bericht',
      envoyer: 'Versturen',
      ouvert: 'Je e-mailprogramma opent met het bericht al ingevuld.',
      envoye: 'Bedankt, je bericht is verstuurd.',
      erreur: (email) => `Het versturen is mislukt. Mail ons op ${email}.`,
      sujet: 'Aanvraag voor Gigi',
    },
  },
  instagram: {
    texte: 'De 6161 redenen, dag na dag',
    cta: 'Volg Gigi op Instagram',
  },
  footer: {
    signature: 'Cucina amorosa · Gent',
    mentions: 'Wettelijke vermeldingen',
    confidentialite: 'Privacy',
    credits: 'Foto’s: Gigi, Studio Sissi, Zware Jongens. Kaart: © OpenStreetMap-bijdragers.',
    realise: 'Website door',
  },
}

const EN: Textes = {
  meta: {
    titre: 'Gigi | Italian restaurant in Ghent, Belfortstraat 24',
    description:
      'Gigi, cucina amorosa in Ghent: pizza, handmade pasta, antipasti and spritz in an interior by Jean-Philippe Demeyer, Belfortstraat 24. Book online.',
  },
  lienEvitement: 'Skip to content',
  nav: {
    amore: 'L’amore',
    carte: 'Menu',
    lieu: 'The place',
    infos: 'Info',
    reserver: 'Book a table',
    accueil: 'Gigi, back to top',
    ouvrir: 'Open menu',
    fermer: 'Close menu',
    langue: 'Site language',
  },
  jours: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  heure: heure24,
  statut: {
    ouvert: (h) => `Open until ${h}`,
    ouvre: (h) => `Closed, opens at ${h}`,
    reouvre: (h) => `Closed, reopens at ${h}`,
    demain: (h) => `Closed, opens tomorrow at ${h}`,
    jour: (jour, h) => `Closed, opens ${jour} at ${h}`,
    ferme: 'Closed',
  },
  hero: {
    titreCache: 'Gigi, Italian restaurant in Ghent',
    surtitre: 'Cucina amorosa · Gent',
    accroche: 'Love in all its delicious forms.',
    texte:
      'Pizza, handmade pasta, antipasti to share and spritz, in an interior by Jean-Philippe Demeyer, a stone’s throw from Sint-Jacobs.',
    reserver: 'Book a table',
    carte: 'See the menu',
  },
  amore: {
    surtitre: '6161 reasons to be (more) alive',
    titre: 'Gigi is for lovers',
    manifeste: [
      'You are alive. Right now. So act like it.',
      'Eat, drink, speak, sing, kiss, dress and make a face like you’re in love.',
      'Not just love for food: love in all its most delicious forms. 6161 kinds of amore. And counting.',
    ],
    devise: 'L’amore domina senza regole.',
    source: 'From the Gigi manifesto',
    faits: [
      { titre: 'The name', texte: 'Gigi is named after Gigi l’amoroso, the charmer in Dalida’s song.' },
      { titre: 'Since 2021', texte: 'Open since autumn 2021 on Belfortstraat, in the heart of the Sint-Jacobs quarter.' },
      {
        titre: 'The décor',
        texte: 'By Jean-Philippe Demeyer: lemons on the walls, salmon-pink statues, mirrored ceilings and neon roses.',
      },
    ],
  },
  cucina: {
    surtitre: 'La cucina',
    titre: 'Open kitchen, handmade pasta',
    texte:
      'Pizzas are made in front of you in the open kitchen. The pasta is handmade, the ravioli and gnocchi are fatto in casa, and so is the pesto (the rest is a secret). At the bar, every juice, syrup and purée in the cocktails is homemade.',
    piliers: [
      {
        titre: 'Pizza',
        texte: 'From the Not so Margherita to the Mystic Pink Panther: pistachio pesto, mortadella and stracciatella.',
      },
      {
        titre: 'Pasta',
        texte: 'Carbonara with guanciale, fennel paccheri and truffle cacio e pepe served in the cheese wheel, for two.',
      },
      {
        titre: 'Aperitivo',
        texte: 'Spritz, a house negroni with cinnamon-infused Campari, cocktails and mocktails.',
      },
    ],
  },
  carte: {
    surtitre: 'Il menu',
    titre: 'The menu',
    intro: 'Antipasti to share, pizza, primi and dolci. At the bar, spritz, negroni and house cocktails.',
    rubriques: 'Menu sections',
    notes: [
      'Coperto €1 per person · One dish per person · One table, one bill',
      'Allergies? Ask us. The composition of our dishes can change.',
    ],
    pdf: 'Full menu (PDF)',
    euros: 'euros',
  },
  lieu: {
    surtitre: 'Il posto',
    titre: 'Through the arched door',
    texte:
      'Behind the stone facade on Belfortstraat, Jean-Philippe Demeyer built a restaurant like a film set: neon roses at the door, a main room under a mirrored ceiling, a bar on a green floor striped with white, a lemon room and salmon-pink statues.',
    pieces: {
      facade: 'The facade',
      grandeSalle: 'The main room',
      bar: 'The bar',
      citrons: 'The lemon room',
      plafond: 'The mirrored ceiling',
      escalier: 'The green staircase',
      statues: 'The statues',
      lampes: 'The lamps',
      stores: 'Under the striped awnings',
      boite: 'The pizza box',
      cuisine: 'The open kitchen',
    },
  },
  infos: {
    surtitre: 'Info',
    titre: 'Opening hours and getting here',
    horaires: 'Opening hours',
    aujourdhui: 'today',
    ferme: 'Closed',
    adresse: 'Address',
    acces: 'In the Sint-Jacobs quarter, a 3-minute walk from the Vrijdagmarkt car park.',
    itineraire: 'Directions',
    plan: 'Open the map',
    planAlt: 'Map of the Sint-Jacobs quarter around Gigi, Belfortstraat 24 in Ghent',
    contact: 'Contact',
    services: 'Dine in, takeaway or delivery',
    servicesTexte: 'Takeaway, or delivery with Uber Eats and Deliveroo.',
  },
  reserver: {
    surtitre: 'Prenota',
    titre: 'A table for two, or for 6161',
    texte: 'Book online or give us a call.',
    enLigne: 'Book online',
    appeler: 'Call us',
    cadeau: {
      titre: 'Give Gigi',
      texte: 'A gift card, for dinner for two or a long table of friends.',
      cta: 'Buy a gift card',
    },
    demande: {
      titre: 'A group, a question?',
      texte: 'Tell us what you have in mind: it reaches us by email.',
      nom: 'Name',
      email: 'Email',
      telephone: 'Phone',
      facultatif: 'optional',
      date: 'Preferred date',
      personnes: 'Number of guests',
      message: 'Your message',
      envoyer: 'Send',
      ouvert: 'Your email app opens with the message ready to send.',
      envoye: 'Thank you, your message has been sent.',
      erreur: (email) => `Sending failed. Email us at ${email}.`,
      sujet: 'Request for Gigi',
    },
  },
  instagram: {
    texte: 'The 6161 reasons, day by day',
    cta: 'Follow Gigi on Instagram',
  },
  footer: {
    signature: 'Cucina amorosa · Gent',
    mentions: 'Legal notice',
    confidentialite: 'Privacy',
    credits: 'Photos: Gigi, Studio Sissi, Zware Jongens. Map: © OpenStreetMap contributors.',
    realise: 'Website by',
  },
}

export const TEXTES: Record<Langue, Textes> = { nl: NL, en: EN, fr: FR }
