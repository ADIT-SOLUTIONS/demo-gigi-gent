/*
  Informations pratiques de Gigi (sources : docs/recherche.md).
  Tout ce qui est entre crochets [...] est à confirmer ou à fournir par les gérants (docs/points-a-valider.md).
*/

export const ADRESSE = {
  rue: 'Belfortstraat 24',
  codePostal: '9000',
  ville: 'Gent',
  latitude: 51.0555152,
  longitude: 3.7273852,
}

export const CONTACT = {
  // Deux numéros circulent : celui du site officiel (ci-dessous) et +32 486 23 27 90 sur Google. À confirmer.
  telephone: '+32 479 32 72 71',
  telephoneLien: 'tel:+32479327271',
  email: 'info@gigi6161.be',
}

export const LIENS = {
  reservation: 'https://bookings.zenchef.com/results?rid=374272&pid=1001',
  carteCadeau: 'https://www.resengo.com/Code/Webshop/?AID=1&LC=NL&CompanyID=1769161',
  instagram: 'https://www.instagram.com/gigi__6161/',
  uberEats: 'https://www.ubereats.com/be-nl/store/gigi/jQ0W8pXUR6eo8jkALAAHtw',
  deliveroo: 'https://deliveroo.be/nl-be/menu/ghent/baudelo-noord/gigi-gent',
  itineraire: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Gigi, Belfortstraat 24, 9000 Gent')}`,
  plan: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Gigi Belfortstraat 24 9000 Gent')}`,
  osm: 'https://www.openstreetmap.org/?mlat=51.05552&mlon=3.72739#map=18/51.05552/3.72739',
  cartePdf: 'https://gigi6161.be/wp-content/uploads/2024/12/1911_MENU.pdf',
  aditSolutions: 'https://aditsolutions.be/',
}

export const MENTIONS = {
  societe: '[RAISON SOCIALE]',
  bce: '[N° BCE / TVA]',
}

/** Un service : ouverture et fermeture en minutes depuis minuit. */
export type Service = readonly [number, number]

const h = (heures: number, minutes = 0) => heures * 60 + minutes

/**
 * Horaires relevés sur Google Maps le 2026-09-23 (à confirmer). Index 0 = dimanche, comme Date.getDay().
 * Plusieurs services par jour possibles (midi et soir).
 */
export const HORAIRES: readonly (readonly Service[])[] = [
  [[h(12), h(20)]], // dimanche
  [[h(17, 30), h(23, 30)]], // lundi
  [[h(17, 30), h(22, 30)]], // mardi
  [[h(12, 30), h(14, 30)], [h(17, 30), h(23, 30)]], // mercredi
  [[h(12, 30), h(14, 30)], [h(17, 30), h(23, 30)]], // jeudi
  [[h(12, 30), h(14, 30)], [h(17, 30), h(23, 30)]], // vendredi
  [[h(12), h(23, 30)]], // samedi
]

/** Ordre d'affichage des jours : lundi en premier. */
export const ORDRE_JOURS = [1, 2, 3, 4, 5, 6, 0]
