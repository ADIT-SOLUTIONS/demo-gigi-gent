/*
  Carte de Gigi, reprise de la carte de décembre 2024 (PDF « 1911_MENU » publié sur gigi6161.be).
  Noms des plats tels que sur la carte (quelques fautes d'orthographe corrigées, voir docs/points-a-valider.md),
  descriptions traduites de l'anglais d'origine. Prix en euros. À faire valider par les gérants.
*/

export type Texte = { nl: string; en: string; fr: string }

export type Plat = { nom: string; prix: number; description?: Texte }

export type Groupe = { titre: string; note?: Texte; plats: Plat[] }

export type Rubrique = { id: string; titre: string; groupes: Groupe[] }

const t = (en: string, nl: string, fr: string): Texte => ({ en, nl, fr })

export const CARTE: Rubrique[] = [
  {
    id: 'antipasti',
    titre: 'Nibbles & antipasti',
    groupes: [
      {
        titre: 'Nibbles',
        plats: [
          {
            nom: 'Plattino aperitivo',
            prix: 26,
            description: t(
              'Selection of cured Italian meats, formaggi and vegetables.',
              'Selectie van Italiaanse charcuterie, formaggi en groenten.',
              'Sélection de charcuteries italiennes, formaggi et légumes.',
            ),
          },
          {
            nom: 'Cerignola',
            prix: 7,
            description: t('Apulian savoury and meaty olives.', 'Vlezige, smaakvolle olijven uit Apulië.', 'Olives des Pouilles, charnues et savoureuses.'),
          },
          {
            nom: 'Bresaola e stracciatella rolls',
            prix: 18,
            description: t(
              'Cured beef rolls with creamy stracciatella.',
              'Rolletjes bresaola met romige stracciatella.',
              'Roulés de bresaola et stracciatella crémeuse.',
            ),
          },
          {
            nom: 'La nostra focaccia',
            prix: 8,
            description: t('Focaccia, olive oil and oregano.', 'Focaccia, olijfolie en oregano.', 'Focaccia, huile d’olive et origan.'),
          },
        ],
      },
      {
        titre: 'Antipasti',
        plats: [
          {
            nom: 'Burrata tartufo',
            prix: 25,
            description: t('Truffle, Parma ham and porcini.', 'Truffel, parmaham en eekhoorntjesbrood.', 'Truffe, jambon de Parme et cèpes.'),
          },
          {
            nom: 'Burrata 5 pomodoro',
            prix: 24,
            description: t(
              'Creamy burrata with ripe tomatoes, olive oil and fresh basil.',
              'Romige burrata met rijpe tomaten, olijfolie en verse basilicum.',
              'Burrata crémeuse, tomates mûres, huile d’olive et basilic frais.',
            ),
          },
          {
            nom: 'Figliata',
            prix: 19,
            description: t(
              'A tradition from Puglia: a big burrata filled with small bocconcini, ready to be shared.',
              'Een traditie uit Apulië: een grote burrata gevuld met kleine bocconcini, om te delen.',
              'Une tradition des Pouilles : une grande burrata garnie de petits bocconcini, à partager.',
            ),
          },
          {
            nom: 'Shrimp cocktail',
            prix: 18,
            description: t(
              'Go 80s with our scampi in cocktail sauce.',
              'Terug naar de jaren 80: onze scampi in cocktailsaus.',
              'Retour dans les années 80 : nos scampi en sauce cocktail.',
            ),
          },
          {
            nom: 'Panzanella',
            prix: 14,
            description: t(
              'Tomato, mozzarella, paprika and red onion with crunchy breadcrumbs and a nice dressing.',
              'Tomaat, mozzarella, paprika en rode ui met krokant brood en een lekkere dressing.',
              'Tomate, mozzarella, poivron et oignon rouge, pain croustillant et une bonne vinaigrette.',
            ),
          },
          {
            nom: 'Mozzarella affumicata',
            prix: 21,
            description: t(
              'Smoked mozzarella with figs and caramelised orange.',
              'Gerookte mozzarella met vijgen en gekarameliseerde sinaasappel.',
              'Mozzarella fumée, figues et orange caramélisée.',
            ),
          },
          {
            nom: 'Beetroot tartare',
            prix: 21,
            description: t('Beetroot, ricotta and lemon zest.', 'Rode biet, ricotta en citroenzeste.', 'Betterave, ricotta et zeste de citron.'),
          },
        ],
      },
    ],
  },
  {
    id: 'primi',
    titre: 'Primi',
    groupes: [
      {
        titre: 'Primi',
        plats: [
          {
            nom: 'Spaghetti al branzo carbonara',
            prix: 23.5,
            description: t(
              'The iconic, authentic carbonara: guanciale, eggs and cheese on passionately handmade pasta.',
              'De iconische, authentieke carbonara: guanciale, ei en kaas op met passie handgemaakte pasta.',
              'L’authentique carbonara : guanciale, œufs et fromage sur des pâtes faites main avec passion.',
            ),
          },
          {
            nom: 'Hot fennel paccheri',
            prix: 23,
            description: t(
              'Hearty, wintery pasta in a spicy ’nduja and salsiccia sauce, topped with creamy ricotta al finocchio.',
              'Stevige winterse pasta in een pittige saus van ’nduja en salsiccia, met romige venkelricotta.',
              'Des pâtes généreuses d’hiver, sauce épicée à la ’nduja et à la salsiccia, ricotta crémeuse au fenouil.',
            ),
          },
          {
            nom: 'Ravioli di ricotta e spinaci, scampi',
            prix: 26.5,
            description: t(
              'Homemade ravioli in a creamy sauce with scampi.',
              'Huisgemaakte ravioli in een romige saus met scampi.',
              'Ravioli faits maison, sauce crémeuse aux scampi.',
            ),
          },
          {
            nom: 'Fusillone al pesto Gigi',
            prix: 22,
            description: t(
              'Homemade pesto with sun-dried tomatoes (the rest is a secret) and 24-month Parmigiano Reggiano.',
              'Huisgemaakte pesto met zongedroogde tomaten (de rest is geheim) en 24 maanden gerijpte Parmigiano Reggiano.',
              'Pesto maison aux tomates séchées (le reste est un secret) et parmigiano reggiano affiné 24 mois.',
            ),
          },
          {
            nom: 'Che caldo gnocchi',
            prix: 22,
            description: t(
              'Creamy tomato and provola sauce over our chewy potato clouds, fatto in casa.',
              'Romige saus van tomaat en provola op onze luchtige aardappelwolkjes, fatto in casa.',
              'Sauce crémeuse tomate et provola sur nos petits nuages de pomme de terre, fatto in casa.',
            ),
          },
          {
            nom: 'Fettuccine cacio e pepe al tartufo, per 2',
            prix: 48,
            description: t(
              'Pecorino and black pepper, finished with fresh truffle of the day in our cheese wheel. For two.',
              'Pecorino en zwarte peper, afgewerkt met verse truffel van de dag in onze kaasbol. Voor twee.',
              'Pecorino et poivre noir, truffe fraîche du jour, servies dans notre meule. Pour deux.',
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'pizza',
    titre: 'Pizza',
    groupes: [
      {
        titre: 'Pizza',
        plats: [
          {
            nom: 'Gigi',
            prix: 22.5,
            description: t(
              'Gorgonzola, provolone, spicy salami, Parmigiano.',
              'Gorgonzola, provolone, pikante salami, Parmigiano.',
              'Gorgonzola, provolone, salami piquant, parmigiano.',
            ),
          },
          {
            nom: 'Dario',
            prix: 25,
            description: t(
              'A Gigi classic, with Parma ham, rocket, Parmigiano, mozzarella and cherry tomatoes.',
              'Een Gigi-klassieker met parmaham, rucola, Parmigiano, mozzarella en kerstomaatjes.',
              'Un classique de Gigi : jambon de Parme, roquette, parmigiano, mozzarella et tomates cerises.',
            ),
          },
          {
            nom: 'Mystic pink panther',
            prix: 23,
            description: t('Pistachio pesto, mortadella, stracciatella.', 'Pistachepesto, mortadella, stracciatella.', 'Pesto de pistache, mortadelle, stracciatella.'),
          },
          {
            nom: '’Nduja mascarpone hot honey',
            prix: 24,
            description: t('Hot and creamy.', 'Pittig en romig.', 'Piquante et crémeuse.'),
          },
          {
            nom: 'Napoli gangster',
            prix: 24,
            description: t('Anchovies, mozzarella, capers.', 'Ansjovis, mozzarella, kappertjes.', 'Anchois, mozzarella, câpres.'),
          },
          {
            nom: 'Tartufo porcini',
            prix: 27,
            description: t(
              'Winter in a bite: the best funghi with a lovely winter truffle.',
              'De winter in één hap: de beste paddenstoelen met een heerlijke wintertruffel.',
              'L’hiver en une bouchée : les meilleurs champignons et une belle truffe d’hiver.',
            ),
          },
          {
            nom: 'Puglia mia',
            prix: 21,
            description: t(
              'Pesto, sun-dried tomato, pine nuts, garlic, mozzarella.',
              'Pesto, zongedroogde tomaat, pijnboompitten, look, mozzarella.',
              'Pesto, tomates séchées, pignons de pin, ail, mozzarella.',
            ),
          },
          {
            nom: 'Not so Margherita',
            prix: 16,
            description: t('Cherry tomatoes, smoked mozzarella.', 'Kerstomaatjes, gerookte mozzarella.', 'Tomates cerises, mozzarella fumée.'),
          },
        ],
      },
    ],
  },
  {
    id: 'secondi',
    titre: 'Secondi',
    groupes: [
      {
        titre: 'Secondi',
        note: t('Ask for our weekly specials.', 'Vraag naar onze suggesties van de week.', 'Demandez nos suggestions de la semaine.'),
        plats: [
          { nom: 'Lasagna ai porcini e tartufo', prix: 24 },
          { nom: 'Il grande Cesari', prix: 22.5 },
          { nom: 'Melanzane mediterranea', prix: 22 },
          { nom: 'Carpaccio di manzo', prix: 20 },
          {
            nom: 'Tonno, capperi e finocchio',
            prix: 18.5,
            description: t(
              'Salad with parsley, onion, chili and lemon.',
              'Salade met peterselie, ui, chili en citroen.',
              'En salade, persil, oignon, piment et citron.',
            ),
          },
        ],
      },
      {
        titre: 'Alla griglia',
        plats: [
          {
            nom: 'Tagliata di manzo',
            prix: 34.5,
            description: t('Provolone al pepe sauce.', 'Saus van provolone met peper.', 'Sauce provolone au poivre.'),
          },
          { nom: 'Polpo', prix: 31 },
        ],
      },
      {
        titre: 'Sides',
        plats: [
          { nom: 'Insalata al pesto di pistacchio', prix: 6 },
          { nom: 'Parm arm', prix: 7 },
          { nom: 'Patate al timo', prix: 7 },
          { nom: 'Beetroot carpaccio', prix: 8 },
        ],
      },
    ],
  },
  {
    id: 'dolci',
    titre: 'Dolci',
    groupes: [
      {
        titre: 'Dolci',
        plats: [
          { nom: 'Tiramisù', prix: 10 },
          { nom: 'Cannoli', prix: 10 },
          { nom: 'Torta Gigi', prix: 10 },
          { nom: 'Mousse al cioccolato', prix: 10 },
        ],
      },
    ],
  },
  {
    id: 'cocktails',
    titre: 'Cocktails & spritz',
    groupes: [
      {
        titre: 'Cocktails',
        note: t('All juices, syrups and purées are homemade.', 'Alle sappen, siropen en purees zijn huisgemaakt.', 'Tous les jus, sirops et purées sont faits maison.'),
        plats: [
          {
            nom: 'Gigi cocktail',
            prix: 13,
            description: t(
              'Blackcurrant-infused Tanqueray gin, San Pellegrino tonic, simple syrup, lemon juice.',
              'Tanqueray-gin met zwarte bes, San Pellegrino tonic, suikersiroop, citroensap.',
              'Gin Tanqueray infusé au cassis, tonic San Pellegrino, sirop de sucre, jus de citron.',
            ),
          },
          {
            nom: 'Limoncello tonic',
            prix: 12,
            description: t('Limoncello, basil leaves, tonic.', 'Limoncello, basilicumblaadjes, tonic.', 'Limoncello, feuilles de basilic, tonic.'),
          },
          {
            nom: 'Strawberry Bellini',
            prix: 12,
            description: t('Strawberry, prosecco.', 'Aardbei, prosecco.', 'Fraise, prosecco.'),
          },
          {
            nom: 'Sgroppino',
            prix: 11,
            description: t(
              'Ketel One vodka, prosecco, sorbetto al limone.',
              'Ketel One-wodka, prosecco, sorbetto al limone.',
              'Vodka Ketel One, prosecco, sorbetto al limone.',
            ),
          },
          {
            nom: 'Melon fever',
            prix: 12,
            description: t(
              'Meloncello, egg white, Ketel One vodka, lemon juice.',
              'Meloncello, eiwit, Ketel One-wodka, citroensap.',
              'Meloncello, blanc d’œuf, vodka Ketel One, jus de citron.',
            ),
          },
          {
            nom: 'White linen',
            prix: 13,
            description: t(
              'Tanqueray gin, cucumber, elderflower syrup, lime juice, prosecco.',
              'Tanqueray-gin, komkommer, vlierbloesemsiroop, limoensap, prosecco.',
              'Gin Tanqueray, concombre, sirop de sureau, jus de citron vert, prosecco.',
            ),
          },
          {
            nom: 'Amaretto sour',
            prix: 11,
            description: t(
              'Amaretto Disaronno, lemon juice, egg white.',
              'Amaretto Disaronno, citroensap, eiwit.',
              'Amaretto Disaronno, jus de citron, blanc d’œuf.',
            ),
          },
          {
            nom: 'Paloma',
            prix: 12,
            description: t(
              'Tanqueray gin, tequila, grapefruit juice, lime juice, agave syrup.',
              'Tanqueray-gin, tequila, pompelmoessap, limoensap, agavesiroop.',
              'Gin Tanqueray, tequila, jus de pamplemousse, jus de citron vert, sirop d’agave.',
            ),
          },
          {
            nom: 'Mezcal sour',
            prix: 14,
            description: t(
              'Siete Misterios, egg white, simple syrup, lime juice.',
              'Siete Misterios, eiwit, suikersiroop, limoensap.',
              'Siete Misterios, blanc d’œuf, sirop de sucre, jus de citron vert.',
            ),
          },
          {
            nom: 'Espresso martini',
            prix: 14,
            description: t(
              'Ketel One vodka, Bulleit rye whiskey, maple syrup.',
              'Ketel One-wodka, Bulleit rye whiskey, ahornsiroop.',
              'Vodka Ketel One, whiskey de seigle Bulleit, sirop d’érable.',
            ),
          },
        ],
      },
      {
        titre: 'Negroni specials',
        plats: [
          {
            nom: 'Gigi',
            prix: 11,
            description: t(
              'Cinnamon-infused Campari, Cinzano rosso, gin, grappa.',
              'Campari met kaneel, Cinzano rosso, gin, grappa.',
              'Campari infusé à la cannelle, Cinzano rosso, gin, grappa.',
            ),
          },
          {
            nom: 'Classic',
            prix: 11,
            description: t('Campari bitter, Cinzano rosso, Tanqueray gin.', 'Campari bitter, Cinzano rosso, Tanqueray-gin.', 'Campari bitter, Cinzano rosso, gin Tanqueray.'),
          },
          {
            nom: 'Compadre',
            prix: 12,
            description: t('Campari bitter, grapefruit, mezcal.', 'Campari bitter, pompelmoes, mezcal.', 'Campari bitter, pamplemousse, mezcal.'),
          },
          {
            nom: 'Sbagliato',
            prix: 11,
            description: t('Campari bitter, Cinzano rosso, prosecco.', 'Campari bitter, Cinzano rosso, prosecco.', 'Campari bitter, Cinzano rosso, prosecco.'),
          },
          {
            nom: 'Boulevardier',
            prix: 12,
            description: t('Whiskey, Campari bitter, Belsazar vermouth.', 'Whiskey, Campari bitter, Belsazar-vermout.', 'Whiskey, Campari bitter, vermouth Belsazar.'),
          },
        ],
      },
      {
        titre: 'Spritz',
        plats: [
          { nom: 'Aperol', prix: 12, description: t('Aperol, prosecco, soda.', 'Aperol, prosecco, soda.', 'Aperol, prosecco, soda.') },
          { nom: 'Hugo', prix: 11, description: t('Saint Germain, prosecco, soda.', 'Saint Germain, prosecco, soda.', 'Saint Germain, prosecco, soda.') },
          {
            nom: 'Italicus',
            prix: 11,
            description: t(
              'Italicus (the elixir of the Medici family), prosecco, soda.',
              'Italicus (het elixir van de familie De’ Medici), prosecco, soda.',
              'Italicus (l’élixir de la famille Médicis), prosecco, soda.',
            ),
          },
          { nom: 'Campari soda', prix: 10, description: t('Campari bitter, soda.', 'Campari bitter, soda.', 'Campari bitter, soda.') },
          {
            nom: 'Bicicletta',
            prix: 10,
            description: t('White wine, Campari bitter, soda.', 'Witte wijn, Campari bitter, soda.', 'Vin blanc, Campari bitter, soda.'),
          },
          {
            nom: 'Indecisione',
            prix: 10,
            description: t('Campari bitter, Aperol, prosecco, soda.', 'Campari bitter, Aperol, prosecco, soda.', 'Campari bitter, Aperol, prosecco, soda.'),
          },
        ],
      },
      {
        titre: 'Mocktails',
        plats: [
          {
            nom: 'Virgin Bellini',
            prix: 12,
            description: t(
              'Peach or strawberry purée, non-alcoholic prosecco.',
              'Puree van perzik of aardbei, alcoholvrije prosecco.',
              'Purée de pêche ou de fraise, prosecco sans alcool.',
            ),
          },
          {
            nom: 'Note floreali',
            prix: 9,
            description: t(
              'Watermelon juice, lemon, orange, hibiscus syrup.',
              'Watermeloensap, citroen, sinaasappel, hibiscussiroop.',
              'Jus de pastèque, citron, orange, sirop d’hibiscus.',
            ),
          },
          {
            nom: 'Virgin amaretto sour',
            prix: 10,
            description: t(
              'Virgin amaretto, egg white, simple syrup, lemon juice.',
              'Alcoholvrije amaretto, eiwit, suikersiroop, citroensap.',
              'Amaretto sans alcool, blanc d’œuf, sirop de sucre, jus de citron.',
            ),
          },
          {
            nom: 'Crodino spritz',
            prix: 11,
            description: t('Crodino, orange juice, soda.', 'Crodino, sinaasappelsap, soda.', 'Crodino, jus d’orange, soda.'),
          },
          {
            nom: 'Serenata',
            prix: 9,
            description: t('Lavender, rosemary syrup, soda.', 'Lavendel, rozemarijnsiroop, soda.', 'Lavande, sirop de romarin, soda.'),
          },
          {
            nom: 'Riviera',
            prix: 9,
            description: t('Grapefruit, thyme syrup, soda.', 'Pompelmoes, tijmsiroop, soda.', 'Pamplemousse, sirop de thym, soda.'),
          },
          {
            nom: 'Romantico',
            prix: 9,
            description: t('Strawberry, mint syrup, soda.', 'Aardbei, muntsiroop, soda.', 'Fraise, sirop de menthe, soda.'),
          },
          {
            nom: 'Lime and ginger spritz',
            prix: 9,
            description: t('Lemon juice, ginger beer, soda.', 'Citroensap, gemberbier, soda.', 'Jus de citron, ginger beer, soda.'),
          },
        ],
      },
    ],
  },
  {
    id: 'caffe',
    titre: 'Caffè & co',
    groupes: [
      {
        titre: 'Caffè',
        note: t('Coffee by Barbaro, Napoli.', 'Koffie van Barbaro, Napels.', 'Café Barbaro, Naples.'),
        plats: [
          { nom: 'Espresso', prix: 3.5 },
          { nom: 'Double espresso', prix: 5.5 },
          { nom: 'Espresso macchiato', prix: 4.5 },
          { nom: 'Americano', prix: 4 },
          { nom: 'Cappuccino', prix: 4.5 },
          { nom: 'Latte', prix: 5 },
          { nom: 'Iced latte', prix: 6 },
          { nom: 'Affogato', prix: 11 },
          { nom: 'Italian coffee', prix: 11 },
        ],
      },
      {
        titre: 'Digestivi',
        plats: [
          { nom: 'Limoncello', prix: 6 },
          { nom: 'Grappa superiore bianca', prix: 6 },
          { nom: 'Grappa barricata', prix: 6 },
          { nom: 'Fernet Branca', prix: 5 },
          { nom: 'Amaro Montenegro', prix: 8 },
          { nom: 'Amaro Averna', prix: 8 },
          { nom: 'Amaretto', prix: 8 },
          { nom: 'Sambuca', prix: 8 },
          { nom: 'Meloncello', prix: 8 },
          { nom: 'Vecchia Romagna', prix: 8 },
        ],
      },
      {
        titre: 'Birre',
        plats: [
          { nom: 'Stella Artois', prix: 3.5 },
          { nom: 'Stella Artois 50 cl', prix: 7 },
          { nom: 'Duvel 666', prix: 4 },
          { nom: 'Vedett', prix: 4 },
          { nom: 'Duvel', prix: 4.5 },
          { nom: 'La Chouffe', prix: 4.5 },
          { nom: 'Tripel d’Anvers', prix: 4.5 },
          { nom: 'Liefmans Fruitesse', prix: 3.5 },
          { nom: 'Liefmans 0,0 %', prix: 3.5 },
        ],
      },
    ],
  },
]
