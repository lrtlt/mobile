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
  MENU_TYPE_WEATHER,
  MENU_TYPE_WEBPAGE,
  Menu2Item,
  Menu2ItemCategory,
  Menu2ItemExpandable,
  Menu2ItemGroup,
  SidebarMenuItem,
  SidebarMenuResponse,
} from './Types';

const WEB_BASE_URL = 'https://www.lrt.lt';
const LRT_ORIGIN_PATTERN = /^https?:\/\/(?:www\.)?lrt\.lt/i;

/**
 * Menu items that are not part of the sidebar menu API response,
 * but are required by the app. They are always rendered above the API items.
 */
const STATIC_TOP_ITEMS: Menu2Item[] = [
  {
    type: MENU_TYPE_HOME,
    title: 'TITULINIS',
    url: `${WEB_BASE_URL}/`,
  },
  {
    type: MENU_TYPE_SEARCH,
    title: 'PAIEŠKA',
    url: `${WEB_BASE_URL}/paieska`,
  },
  {
    type: MENU_TYPE_CHANNELS,
    title: 'TIESIOGIAI',
  },
];

/**
 * Language switcher is not part of the sidebar menu API response.
 */
const LANGUAGES_GROUP: Menu2ItemGroup = {
  type: MENU_TYPE_GROUP,
  title: 'KALBOS',
  items: [
    {
      type: MENU_TYPE_HOME,
      title: 'Lietuvių (LT)',
      url: `${WEB_BASE_URL}/`,
    },
    {
      type: MENU_TYPE_CATEGORY,
      title: 'English (EN)',
      url: `${WEB_BASE_URL}/en/news-in-english`,
      category_id: 19,
    },
    {
      type: MENU_TYPE_CATEGORY,
      title: 'Novosti (RU)',
      url: `${WEB_BASE_URL}/ru/novosti`,
      category_id: 17,
    },
    {
      type: MENU_TYPE_CATEGORY,
      title: 'Wiadomosci (PL)',
      url: `${WEB_BASE_URL}/pl/wiadomosci`,
      category_id: 1261,
    },
  ],
};

/**
 * Paths that are handled by a dedicated app screen. Everything that is not
 * listed here (and is not a category or a tag page) is opened as a webpage.
 */
const PATH_TO_TYPE: Record<
  string,
  | typeof MENU_TYPE_HOME
  | typeof MENU_TYPE_SEARCH
  | typeof MENU_TYPE_PROGRAM
  | typeof MENU_TYPE_MEDIATEKA
  | typeof MENU_TYPE_MEDIATEKA_SHOWS
  | typeof MENU_TYPE_RADIOTEKA
  | typeof MENU_TYPE_RADIOTEKA_SHOWS
  | typeof MENU_TYPE_GAMES
  | typeof MENU_TYPE_WEATHER
> = {
  '/': MENU_TYPE_HOME,
  '/paieska': MENU_TYPE_SEARCH,
  '/programa': MENU_TYPE_PROGRAM,
  '/radioteka/programa': MENU_TYPE_PROGRAM,
  '/mediateka': MENU_TYPE_MEDIATEKA,
  '/mediateka/tv-laidos': MENU_TYPE_MEDIATEKA_SHOWS,
  '/mediateka/radijo-laidos': MENU_TYPE_RADIOTEKA_SHOWS,
  '/radioteka': MENU_TYPE_RADIOTEKA,
  '/audioteka': MENU_TYPE_RADIOTEKA,
  '/zaidimai': MENU_TYPE_GAMES,
  '/orai': MENU_TYPE_WEATHER,
};

/**
 * Custom pages that aggregate several categories. The category list cannot be
 * resolved from the API, so it is kept here.
 */
const PATH_TO_PAGE_CATEGORIES: Record<string, {id: number; name: string}[]> = {
  '/lituanica': [
    {id: 751, name: 'Aktualijos'},
    {id: 752, name: 'Istorijos'},
    {id: 754, name: 'Norintiems sugrįžti'},
    {id: 753, name: 'Pasaulio lietuvių balsas'},
  ],
};

/**
 * Returns lrt.lt path of the url or undefined if the url points to another host.
 */
const toPath = (url?: string | null): string | undefined => {
  if (!url) {
    return undefined;
  }

  let path = url.trim();
  if (LRT_ORIGIN_PATTERN.test(path)) {
    path = path.replace(LRT_ORIGIN_PATTERN, '');
  } else if (!path.startsWith('/')) {
    // Another host (epika.lrt.lt, archyvai.lrt.lt, ...)
    return undefined;
  }

  path = path.split(/[?#]/)[0];
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path.length ? path : '/';
};

const toAbsoluteUrl = (url: string): string => {
  const trimmed = url.trim();
  return trimmed.startsWith('/') ? `${WEB_BASE_URL}${trimmed}` : trimmed;
};

type CategoryInfo = {category_id: number; hasHome?: boolean};

/**
 * Category ids by lrt.lt path. Sidebar menu API does not provide category ids,
 * so they are kept here. A category that is not listed here is opened as a webpage.
 */
const CATEGORY_BY_PATH: Record<string, CategoryInfo> = {
  '/naujienos/lietuvoje': {category_id: 2, hasHome: true},
  '/naujienos/verslas': {category_id: 4, hasHome: true},
  '/naujienos/pasaulyje': {category_id: 6, hasHome: true},
  '/naujienos/eismas': {category_id: 7, hasHome: true},
  '/naujienos/sportas': {category_id: 10, hasHome: true},
  '/naujienos/mokslas-ir-it': {category_id: 11, hasHome: true},
  '/naujienos/kultura': {category_id: 12, hasHome: true},
  '/naujienos/laisvalaikis': {category_id: 13, hasHome: true},
  '/naujienos/tavo-lrt': {category_id: 15, hasHome: true},
  '/naujienos/svietimas': {category_id: 45, hasHome: true},
  '/naujienos/sveikata': {category_id: 682, hasHome: true},
  '/naujienos/lrt-tyrimai': {category_id: 5},
  '/naujienos/nuomones': {category_id: 3},
  '/naujienos/pozicija': {category_id: 679},
  '/naujienos/verslo-pozicija': {category_id: 692},
  '/naujienos/muzika': {category_id: 680},
};

const mapItem = (item: SidebarMenuItem, isTopLevel: boolean): Menu2Item | undefined => {
  if (!item.url) {
    return undefined;
  }

  const title = isTopLevel ? item.name.toUpperCase() : item.name;
  const url = toAbsoluteUrl(item.url);

  // Items marked to open in a new tab are always opened as a webpage.
  const path = item.target === '_blank' ? undefined : toPath(item.url);

  if (path) {
    const type = PATH_TO_TYPE[path];
    if (type) {
      return {type, title, url};
    }

    const pageCategories = PATH_TO_PAGE_CATEGORIES[path];
    if (pageCategories) {
      return {type: MENU_TYPE_PAGE, title, url, categories: pageCategories};
    }

    const category = CATEGORY_BY_PATH[path];
    if (category) {
      const categoryItem: Menu2ItemCategory = {
        type: MENU_TYPE_CATEGORY,
        title,
        url,
        category_id: category.category_id,
      };
      if (category.hasHome) {
        categoryItem.hasHome = true;
      }
      return categoryItem;
    }

    if (path.startsWith('/tema/')) {
      return {
        type: MENU_TYPE_SLUG,
        title,
        url,
        slug: path.substring(path.lastIndexOf('/') + 1),
      };
    }
  }

  return {type: MENU_TYPE_WEBPAGE, title, url};
};

const isActive = (item: SidebarMenuItem) => item.isActive !== false;

const notUndefined = <T>(item: T | undefined): item is T => item !== undefined;

/**
 * Converts sidebar menu API response into the app menu. Paths that are not
 * handled by a dedicated app screen are opened as a webpage.
 */
export const mapSidebarMenu = (menu: SidebarMenuResponse): Menu2Item[] => {
  const items = (menu.items ?? [])
    .filter(isActive)
    .map<Menu2Item | undefined>((item) => {
      const subitems = (item.subitems ?? []).filter(isActive);

      if (subitems.length) {
        const children = subitems.map((sub) => mapItem(sub, false)).filter(notUndefined);
        if (!children.length) {
          return undefined;
        }
        const expandable: Menu2ItemExpandable = {
          type: MENU_TYPE_EXPANDABLE,
          title: item.name.toUpperCase(),
          items: children,
        };
        return expandable;
      }

      return mapItem(item, true);
    })
    .filter(notUndefined);

  return [...STATIC_TOP_ITEMS, ...items, LANGUAGES_GROUP];
};
