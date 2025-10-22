export const MENU_DATA = [
  {
    type: 'home',
    title: 'TITULINIS',
    url: 'https://www.lrt.lt/',
  },
  {
    type: 'search',
    title: 'PAIEŠKA',
    url: 'https://www.lrt.lt/paieska',
  },
  {
    type: 'settings',
    title: 'NUSTATYMAI',
  },
  {
    type: 'channels',
    title: 'TIESIOGIAI',
  },
  {
    type: 'program',
    title: 'PROGRAMA',
    url: 'https://www.lrt.lt/programa',
  },
  {
    type: 'expandable',
    title: 'AKTUALIJOS',
    items: [
      {
        type: 'category',
        title: 'Lietuvoje',
        category_id: 2,
        hasHome: true,
        url: 'https://www.lrt.lt/naujienos/lietuvoje',
      },
      {
        type: 'category',
        title: 'Sveikata',
        category_id: 682,
        url: 'https://www.lrt.lt/naujienos/sveikata',
      },
      {
        type: 'category',
        title: 'Verslas',
        category_id: 4,
        hasHome: true,
        url: 'https://www.lrt.lt/naujienos/verslas',
      },
      {
        type: 'category',
        title: 'Verslo pozicija',
        category_id: 692,
        url: 'https://www.lrt.lt/naujienos/verslo-pozicija',
      },
      {
        type: 'category',
        title: 'Pasaulyje',
        category_id: 6,
        hasHome: true,
        url: 'https://www.lrt.lt/naujienos/pasaulyje',
      },
      {
        type: 'category',
        title: 'Nuomoės',
        category_id: 3,
        url: 'https://www.lrt.lt/naujienos/nuomones',
      },
      {
        type: 'category',
        title: 'Eismas',
        category_id: 7,
        hasHome: true,
        url: 'https://www.lrt.lt/naujienos/eismas',
      },
      {
        type: 'category',
        title: 'Mokslas ir IT',
        category_id: 11,
        hasHome: true,
        url: 'https://www.lrt.lt/naujienos/mokslas-ir-it',
      },
      {
        type: 'category',
        title: 'Švietimas',
        category_id: 45,
        url: 'https://www.lrt.lt/naujienos/svietimas',
      },
      {
        type: 'category',
        title: 'LRT Tyrimai',
        category_id: 5,
        url: 'https://www.lrt.lt/naujienos/lrt-tyrimai',
      },
      {
        type: 'slug',
        title: 'LRT Faktai',
        slug: 'lrt-faktai',
        url: 'https://www.lrt.lt/tema/lrt-faktai',
      },
      {
        type: 'category',
        title: 'Tavo LRT',
        category_id: 15,
        url: 'https://www.lrt.lt/naujienos/tavo-lrt',
      },
      {
        type: 'page',
        title: 'Lituanica',
        categories: [
          {
            id: 751,
            name: 'Aktualijos',
          },
          {
            name: 'Istorijos',
            id: 752,
          },
          {
            name: 'Norintiems sugrįžti',
            id: 754,
          },
          {
            name: 'Pasaulio lietuvių balsas',
            id: 753,
          },
        ],
        url: 'https://www.lrt.lt/lituanica',
      },
      {
        type: 'category',
        title: 'Pozicija',
        category_id: 679,
        url: 'https://www.lrt.lt/naujienos/pozicija',
      },
    ],
  },
  {
    type: 'expandable',
    title: 'MEDIATEKA',
    items: [
      {
        type: 'mediateka',
        title: 'Pradžia',
        url: 'https://www.lrt.lt/mediateka',
      },
      {
        type: 'program',
        title: 'Programa',
        url: 'https://www.lrt.lt/programa',
      },
      {
        type: 'webpage',
        title: 'Laidos',
        url: 'https://www.lrt.lt/mediateka/tv-laidos',
      },
      {
        type: 'webpage',
        title: 'Filmai',
        url: 'https://epika.lrt.lt/filmai?_gl=1*1arpe8a*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
      },
      {
        type: 'webpage',
        title: 'Serialai',
        url: 'https://epika.lrt.lt/serialai?_gl=1*1arpe8a*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
      },
    ],
  },
  {
    type: 'expandable',
    title: 'RADIOTEKA',
    items: [
      {
        type: 'radioteka',
        title: 'Pradžia',
        url: 'https://www.lrt.lt/mediateka',
      },
      {
        type: 'program',
        title: 'Programa',
        url: 'https://www.lrt.lt/programa',
      },
      {
        type: 'webpage',
        title: 'Radijo laidų sąrašas',
        url: 'https://www.lrt.lt/mediateka/radijo-laidos',
      },
    ],
  },
  {
    type: 'expandable',
    title: 'MANO LRT',
    items: [
      {
        type: 'bookmarks',
        title: 'Išsaugoti straipsniai',
      },
      {
        type: 'history',
        title: 'Peržiūrėti straipsniai',
      },
    ],
  },
  {
    type: 'webpage',
    title: 'EPIKA',
    url: 'https://epika.lrt.lt/?_gl=1*iyx4t3*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
  },
  {
    type: 'category',
    title: 'KULTŪRA',
    url: 'https://www.lrt.lt/naujienos/kultura',
    category_id: 12,
    hasHome: true,
  },
  {
    type: 'category',
    title: 'SPORTAS',
    url: 'https://www.lrt.lt/naujienos/sportas',
    category_id: 10,
    hasHome: true,
  },
  {
    type: 'expandable',
    title: 'VAIKAMS',
    items: [
      {
        type: 'webpage',
        title: 'Pradžia',
        url: 'https://www.lrt.lt/vaikams',
      },
      {
        type: 'webpage',
        title: 'Filmai',
        url: 'https://epika.lrt.lt/vaikams?_gl=1*1ogseq9*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
      },
      // {
      //   type: 'webpage',
      //   title: 'Vakaro pasaka',
      //   url: 'https://www.lrt.lt/tema/vakaro-pasaka',
      // },
      {
        type: 'webpage',
        title: 'Žaidimai',
        url: 'https://www.lrt.lt/tema/zaidimai-vaikams',
      },
      {
        type: 'webpage',
        title: 'Mokykla',
        url: 'https://www.lrt.lt/mediateka/rekomenduojame/mokykla',
      },
    ],
  },
  {
    type: 'expandable',
    title: 'LAISVALAIKIS',
    items: [
      {
        type: 'category',
        title: 'Muzika',
        url: 'https://www.lrt.lt/naujienos/muzika',
        category_id: 680,
      },
      {
        type: 'category',
        title: 'Laisvalaikis',
        url: 'https://www.lrt.lt/naujienos/laisvalaikis',
        category_id: 13,
        hasHome: true,
      },
    ],
  },
  {
    type: 'expandable',
    title: 'PROJEKTAI',
    items: [
      {
        type: 'webpage',
        title: 'Pradžia',
        url: 'https://www.lrt.lt/projektai',
      },
      {
        type: 'webpage',
        title: 'Mano kraštas',
        url: 'https://www.lrt.lt/mano-krastas',
      },
      {
        type: 'webpage',
        title: 'Prototo',
        url: 'https://www.lrt.lt/projektai/prototo',
      },
      {
        type: 'webpage',
        title: 'Auksinis protas',
        url: 'https://www.lrt.lt/projektai/auksinis-protas',
      },
      {
        type: 'webpage',
        title: 'Nacionalinis judumo iššūkis',
        url: 'https://www.lrt.lt/projektai/nacionalinis-judumo-issukis',
      },
      {
        type: 'webpage',
        title: 'Parašyk man dainą',
        url: 'https://www.lrt.lt/projektai/parasyk-man-daina',
      },
      // {
      //   type: 'webpage',
      //   title: '„Sirenų“ Lietuvos teatro programos žiūroviškiausio spektaklio rinkimai',
      //   url: 'https://www.lrt.lt/projektai/sirenu-rinkimai',
      // },
      {
        type: 'webpage',
        title: 'Ministerija Futura',
        url: 'https://www.lrt.lt/projektai/ministerijafutura',
      },
    ],
  },
  {
    type: 'expandable',
    title: 'LRT ARCHYVAI',
    items: [
      {
        type: 'webpage',
        title: 'Pradžia',
        url: 'https://archyvai.lrt.lt/paveldas?_gl=1*1f6ari3*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
      },
      {
        type: 'webpage',
        title: 'Apie projektą',
        url: 'https://archyvai.lrt.lt/paveldas/apie',
      },
      {
        type: 'webpage',
        title: 'Laidų ir filmų sąrašas',
        url: 'https://archyvai.lrt.lt/paveldas/archyvai-laidos',
      },
      {
        type: 'webpage',
        title: 'Šią dieną',
        url: 'https://archyvai.lrt.lt/paveldas/ivykiai',
      },
      {
        type: 'webpage',
        title: 'Įkelti turinį',
        url: 'https://archyvai.lrt.lt/paveldas/ikelk',
      },
      {
        type: 'webpage',
        title: 'Mano įšsaugoti',
        url: 'https://archyvai.lrt.lt/paveldas/kolekcijos',
      },
      {
        type: 'webpage',
        title: 'Parduotuvė',
        url: 'https://archyvai-parduotuve.lrt.lt/?_gl=1*i78eis*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
      },
    ],
  },
  {
    type: 'webpage',
    title: 'LRT PAPRASTAI',
    url: 'https://www.lrt.lt/naujienos/lrt-paprastai?_gl=1*i78eis*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
  },
  {
    type: 'group',
    title: 'KALBOS',
    items: [
      {
        type: 'home',
        title: 'Lietuvių (LT)',
        url: 'https://www.lrt.lt/',
      },
      {
        type: 'category',
        title: 'English (EN)',
        url: 'https://www.lrt.lt/en/news-in-english',
        category_id: 19,
      },
      {
        type: 'category',
        title: 'Novosti (RU)',
        url: 'https://www.lrt.lt/ru/novosti',
        category_id: 17,
      },
      {
        type: 'category',
        title: 'Wiadomosci (PL)',
        url: 'https://www.lrt.lt/pl/wiadomosci',
        category_id: 1261,
      },
      {
        type: 'category',
        title: 'Novini (UA)',
        url: 'https://www.lrt.lt/ua/novini',
        category_id: 1263,
      },
    ],
  },
];
