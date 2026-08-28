import {mapSidebarMenu} from '../app/api/menuMapper';
import {
  MENU_TYPE_CATEGORY,
  MENU_TYPE_CHANNELS,
  MENU_TYPE_EXPANDABLE,
  MENU_TYPE_GAMES,
  MENU_TYPE_GROUP,
  MENU_TYPE_HOME,
  MENU_TYPE_MEDIATEKA,
  MENU_TYPE_MEDIATEKA_SHOWS,
  MENU_TYPE_PAGE,
  MENU_TYPE_PROGRAM,
  MENU_TYPE_RADIOTEKA,
  MENU_TYPE_RADIOTEKA_SHOWS,
  MENU_TYPE_SEARCH,
  MENU_TYPE_SLUG,
  MENU_TYPE_WEBPAGE,
  Menu2Item,
  Menu2ItemExpandable,
  SidebarMenuItem,
  SidebarMenuResponse,
} from '../app/api/Types';
import sidebarMenuFixture from './fixtures/sidebarMenu.json';

const liveMenu = sidebarMenuFixture as SidebarMenuResponse;

const menuOf = (...items: SidebarMenuItem[]): SidebarMenuResponse => ({
  id: 86,
  name: 'Sidebar menu',
  slug: 'sidebar-menu',
  items,
});

const itemOf = (item: Partial<SidebarMenuItem>): SidebarMenuItem => ({
  id: 1,
  name: 'Item',
  url: null,
  isActive: true,
  target: '_self',
  ...item,
});

/** Items produced by the API, without the hardcoded ones around them. */
const mapApiItems = (menu: SidebarMenuResponse): Menu2Item[] => {
  const items = mapSidebarMenu(menu);
  return items.slice(3, items.length - 1);
};

const findByTitle = (items: Menu2Item[], title: string): Menu2Item | undefined => {
  for (const item of items) {
    if (item.title === title) {
      return item;
    }
    if (item.type === MENU_TYPE_EXPANDABLE || item.type === MENU_TYPE_GROUP) {
      const child = findByTitle(item.items, title);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
};

describe('mapSidebarMenu static items', () => {
  it('adds Home, Search and Channels above the API items', () => {
    expect(mapSidebarMenu(menuOf()).slice(0, 3)).toEqual([
      {type: MENU_TYPE_HOME, title: 'TITULINIS', url: 'https://www.lrt.lt/'},
      {type: MENU_TYPE_SEARCH, title: 'PAIEŠKA', url: 'https://www.lrt.lt/paieska'},
      {type: MENU_TYPE_CHANNELS, title: 'TIESIOGIAI'},
    ]);
  });

  it('adds the languages group below the API items', () => {
    const items = mapSidebarMenu(menuOf());
    const last = items[items.length - 1];

    expect(last.type).toBe(MENU_TYPE_GROUP);
    expect(last.title).toBe('KALBOS');
    expect(last.type === MENU_TYPE_GROUP && last.items.map((it) => it.title)).toEqual([
      'Lietuvių (LT)',
      'English (EN)',
      'Novosti (RU)',
      'Wiadomosci (PL)',
    ]);
  });
});

describe('mapSidebarMenu path mapping', () => {
  const mapUrl = (url: string, target: SidebarMenuItem['target'] = '_self') =>
    mapApiItems(menuOf(itemOf({name: 'Item', url, target})))[0];

  it.each([
    ['/programa', MENU_TYPE_PROGRAM],
    ['/radioteka/programa', MENU_TYPE_PROGRAM],
    ['/mediateka', MENU_TYPE_MEDIATEKA],
    ['/mediateka/tv-laidos', MENU_TYPE_MEDIATEKA_SHOWS],
    ['/mediateka/radijo-laidos', MENU_TYPE_RADIOTEKA_SHOWS],
    ['/radioteka', MENU_TYPE_RADIOTEKA],
    ['/zaidimai', MENU_TYPE_GAMES],
  ])('maps %s to a %s screen', (url, type) => {
    expect(mapUrl(url)).toMatchObject({type, title: 'ITEM'});
  });

  it('does not put a url on the games item', () => {
    expect(mapUrl('/zaidimai')).toEqual({type: MENU_TYPE_GAMES, title: 'ITEM'});
  });

  it('maps a known category path to a category with its id', () => {
    expect(mapUrl('/naujienos/lietuvoje')).toEqual({
      type: MENU_TYPE_CATEGORY,
      title: 'ITEM',
      url: 'https://www.lrt.lt/naujienos/lietuvoje',
      category_id: 2,
      hasHome: true,
    });
  });

  it('omits hasHome for a category that has no home blocks', () => {
    expect(mapUrl('/naujienos/lrt-tyrimai')).toEqual({
      type: MENU_TYPE_CATEGORY,
      title: 'ITEM',
      url: 'https://www.lrt.lt/naujienos/lrt-tyrimai',
      category_id: 5,
    });
  });

  it('falls back to a webpage for a category that is not in the table', () => {
    expect(mapUrl('/naujienos/nera-tokios')).toEqual({
      type: MENU_TYPE_WEBPAGE,
      title: 'ITEM',
      url: 'https://www.lrt.lt/naujienos/nera-tokios',
    });
  });

  it('maps /tema/* to a slug screen', () => {
    expect(mapUrl('/tema/lrt-faktai')).toEqual({
      type: MENU_TYPE_SLUG,
      title: 'ITEM',
      url: 'https://www.lrt.lt/tema/lrt-faktai',
      slug: 'lrt-faktai',
    });
  });

  it('maps /lituanica to a page with its categories', () => {
    expect(mapUrl('/lituanica')).toMatchObject({
      type: MENU_TYPE_PAGE,
      categories: [
        {id: 751, name: 'Aktualijos'},
        {id: 752, name: 'Istorijos'},
        {id: 754, name: 'Norintiems sugrįžti'},
        {id: 753, name: 'Pasaulio lietuvių balsas'},
      ],
    });
  });

  it('opens another host as a webpage', () => {
    expect(mapUrl('https://epika.lrt.lt/filmai')).toEqual({
      type: MENU_TYPE_WEBPAGE,
      title: 'ITEM',
      url: 'https://epika.lrt.lt/filmai',
    });
  });

  it('opens a _blank item as a webpage even when the path is known', () => {
    expect(mapUrl('/mediateka', '_blank')).toEqual({
      type: MENU_TYPE_WEBPAGE,
      title: 'ITEM',
      url: 'https://www.lrt.lt/mediateka',
    });
  });

  it('resolves absolute lrt.lt urls, trailing slashes and query strings', () => {
    expect(mapUrl('https://www.lrt.lt/zaidimai/')).toMatchObject({type: MENU_TYPE_GAMES});
    expect(mapUrl('http://lrt.lt/mediateka?utm_source=app')).toMatchObject({
      type: MENU_TYPE_MEDIATEKA,
    });
  });

  it('makes a relative url absolute and keeps an absolute one as is', () => {
    expect(mapUrl('/naujienos/nera-tokios')).toMatchObject({
      url: 'https://www.lrt.lt/naujienos/nera-tokios',
    });
    expect(mapUrl('https://archyvai.lrt.lt/paveldas')).toMatchObject({
      url: 'https://archyvai.lrt.lt/paveldas',
    });
  });
});

describe('mapSidebarMenu grouping', () => {
  it('turns an item with subitems into an expandable group', () => {
    const items = mapApiItems(
      menuOf(
        itemOf({
          name: 'Laisvalaikis',
          url: null,
          subitems: [
            itemOf({id: 2, name: 'Muzika', url: '/naujienos/muzika'}),
            itemOf({id: 3, name: 'Laisvalaikis', url: '/naujienos/laisvalaikis'}),
          ],
        }),
      ),
    );

    expect(items).toEqual([
      {
        type: MENU_TYPE_EXPANDABLE,
        title: 'LAISVALAIKIS',
        items: [
          {
            type: MENU_TYPE_CATEGORY,
            title: 'Muzika',
            url: 'https://www.lrt.lt/naujienos/muzika',
            category_id: 680,
          },
          {
            type: MENU_TYPE_CATEGORY,
            title: 'Laisvalaikis',
            url: 'https://www.lrt.lt/naujienos/laisvalaikis',
            category_id: 13,
            hasHome: true,
          },
        ],
      },
    ]);
  });

  it('uppercases top level titles only', () => {
    const items = mapApiItems(
      menuOf(
        itemOf({name: 'Sportas', url: '/naujienos/sportas'}),
        itemOf({
          id: 2,
          name: 'Vaikams',
          subitems: [itemOf({id: 3, name: 'Žaidimai', url: '/tema/zaidimai-vaikams'})],
        }),
      ),
    );

    expect(items[0].title).toBe('SPORTAS');
    expect(items[1].title).toBe('VAIKAMS');
    expect((items[1] as Menu2ItemExpandable).items[0].title).toBe('Žaidimai');
  });

  it('drops inactive items and inactive subitems', () => {
    const items = mapApiItems(
      menuOf(
        itemOf({name: 'Sportas', url: '/naujienos/sportas', isActive: false}),
        itemOf({
          id: 2,
          name: 'Laisvalaikis',
          subitems: [
            itemOf({id: 3, name: 'Muzika', url: '/naujienos/muzika', isActive: false}),
            itemOf({id: 4, name: 'Laisvalaikis', url: '/naujienos/laisvalaikis'}),
          ],
        }),
      ),
    );

    expect(items).toHaveLength(1);
    expect((items[0] as Menu2ItemExpandable).items.map((it) => it.title)).toEqual(['Laisvalaikis']);
  });

  it('drops a group whose subitems are all unusable', () => {
    const items = mapApiItems(
      menuOf(
        itemOf({
          name: 'Tuščia',
          subitems: [itemOf({id: 2, name: 'Be nuorodos', url: null})],
        }),
      ),
    );

    expect(items).toEqual([]);
  });

  it('drops a leaf item without a url', () => {
    expect(mapApiItems(menuOf(itemOf({name: 'Be nuorodos', url: null})))).toEqual([]);
  });

  it('keeps an item that is missing isActive', () => {
    const items = mapApiItems(
      menuOf({id: 1, name: 'Sportas', url: '/naujienos/sportas'} as SidebarMenuItem),
    );

    expect(items).toHaveLength(1);
  });

  it('returns only the hardcoded items for an empty response', () => {
    expect(mapApiItems(menuOf())).toEqual([]);
    expect(mapSidebarMenu({...menuOf(), items: undefined as any})).toHaveLength(4);
  });
});

describe('mapSidebarMenu with the live API payload', () => {
  const items = mapSidebarMenu(liveMenu);

  it('maps every top level item', () => {
    expect(items.map((item) => item.title)).toEqual([
      'TITULINIS',
      'PAIEŠKA',
      'TIESIOGIAI',
      'PROGRAMA',
      'AKTUALIJOS',
      'MEDIATEKA',
      'RADIOTEKA',
      'EPIKA',
      'KULTŪRA',
      'SPORTAS',
      'VAIKAMS',
      'LAISVALAIKIS',
      'ŽAIDIMAI',
      'PROJEKTAI',
      'ARCHYVAI',
      'PAPRASTAI',
      'EUROVISION SPORT',
      'KALBOS',
    ]);
  });

  it('never produces an item without a title', () => {
    const titles: string[] = [];
    const collect = (list: Menu2Item[]) =>
      list.forEach((item) => {
        titles.push(item.title);
        if (item.type === MENU_TYPE_EXPANDABLE || item.type === MENU_TYPE_GROUP) {
          collect(item.items);
        }
      });
    collect(items);

    expect(titles.every(Boolean)).toBe(true);
  });

  it.each([
    ['Lietuvoje', MENU_TYPE_CATEGORY],
    ['LRT faktai', MENU_TYPE_SLUG],
    ['Lituanica', MENU_TYPE_PAGE],
    ['ŽAIDIMAI', MENU_TYPE_GAMES],
    ['Laidos', MENU_TYPE_MEDIATEKA_SHOWS],
    ['Radijo laidų sąrašas', MENU_TYPE_RADIOTEKA_SHOWS],
    ['Filmai', MENU_TYPE_WEBPAGE],
  ])('maps %s to %s', (title, type) => {
    expect(findByTitle(items, title)).toMatchObject({type});
  });

  it('maps both Radioteka Pradžia and Programa to native screens', () => {
    const radioteka = findByTitle(items, 'RADIOTEKA') as Menu2ItemExpandable;

    expect(radioteka.items.map((it) => it.type)).toEqual([
      MENU_TYPE_RADIOTEKA,
      MENU_TYPE_PROGRAM,
      MENU_TYPE_RADIOTEKA_SHOWS,
    ]);
  });
});
