import {create} from 'zustand';
import {
  Menu2Item,
  Menu2ItemCategory,
  Menu2ItemNewest,
  Menu2ItemPopular,
  Menu2Response,
  MENU_TYPE_CATEGORY,
  MENU_TYPE_EXPANDABLE,
  MENU_TYPE_HOME,
  MENU_TYPE_MEDIATEKA,
  MENU_TYPE_NEWEST,
  MENU_TYPE_POPULAR,
  MENU_TYPE_RADIOTEKA,
  MenuItem,
  MenuItemCategory,
  MenuItemChannels,
  MenuItemPage,
  MenuItemProjects,
} from '../api/Types';
import {fetchMenuItemsV2} from '../api';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_OPEN_CATEGORY, EVENT_SELECT_CATEGORY_INDEX} from '../constants';
import {createMMKV} from 'react-native-mmkv';

const menuCache = createMMKV({id: 'menu-cache'});
const MENU_CACHE_KEY = 'app-menu-v4';
const MENU_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

type MenuCacheEntry = {
  timestamp: number;
  data: Menu2Response;
};

const readMenuCache = (): Menu2Response | undefined => {
  const cached = menuCache.getString(MENU_CACHE_KEY);
  if (!cached) {
    return undefined;
  }
  try {
    const entry = JSON.parse(cached) as MenuCacheEntry;
    if (Date.now() - entry.timestamp < MENU_CACHE_TTL_MS) {
      return entry.data;
    }
  } catch {
    menuCache.remove(MENU_CACHE_KEY);
  }
  return undefined;
};

const writeMenuCache = (data: Menu2Response) => {
  const entry: MenuCacheEntry = {timestamp: Date.now(), data};
  menuCache.set(MENU_CACHE_KEY, JSON.stringify(entry));
};

export type NavigationState = {
  menu?: Menu2Response;
  /** @deprecated use routesV2 */
  routes: (MenuItem | MenuItemCategory)[];
  routesV2: Menu2Item[];
  channels?: MenuItemChannels;
  pages: MenuItemPage[];
  projects: MenuItemProjects[];
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  isOfflineMode: boolean;
};

type NavigationActions = {
  fetchMenuItemsV2: () => void;
  openHomeRoute: () => void;
  openRadiotekaRoute: () => void;
  openMediatekaRoute: () => void;

  openCategoryById: (id: number, title?: string) => void;
  openCategoryByName: (name: string) => void;
  setOfflineMode: (offline: boolean) => void;
};

type NavigationStore = NavigationState & NavigationActions;

const initialState: NavigationState = {
  routes: [],
  routesV2: [],
  pages: [],
  projects: [],
  isLoading: false,
  isReady: false,
  isError: false,
  isOfflineMode: false,
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  ...initialState,
  fetchMenuItemsV2: async () => {
    const cached = readMenuCache();
    if (cached) {
      set({menu: cached, routesV2: parseRoutesV2(cached), isLoading: false, isReady: true, isError: false});
      return;
    }

    set({isLoading: true, isError: false, isReady: false});
    try {
      const data = await fetchMenuItemsV2();
      writeMenuCache(data);
      set({menu: data, routesV2: parseRoutesV2(data), isLoading: false, isReady: true});
    } catch (e) {
      console.log('fetchMenuItemsV2 error', e);
      set({isLoading: false, isError: true, isReady: false});
    }
  },
  openHomeRoute: () => {
    const state = useNavigationStore.getState();
    const index = state.routesV2.findIndex((route) => route.type === MENU_TYPE_HOME);
    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.warn('Index not found for home route');
    }
  },
  openRadiotekaRoute: () => {
    const state = useNavigationStore.getState();
    const index = state.routesV2.findIndex((route) => route.type === MENU_TYPE_RADIOTEKA);
    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.warn('Index not found for radioteka route');
    }
  },
  openMediatekaRoute: () => {
    const state = useNavigationStore.getState();
    const index = state.routesV2.findIndex((route) => route.type === MENU_TYPE_MEDIATEKA);
    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.warn('Index not found for mediateka route');
    }
  },
  openCategoryByName: (name) => {
    const state = useNavigationStore.getState();
    const index = state.routesV2.findIndex((route) => route.title.toLowerCase() === name.toLowerCase());

    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.warn('Index not found for route: ' + name);
    }
  },
  openCategoryById: (id, title) => {
    const state = useNavigationStore.getState();
    const index = state.routesV2.findIndex(
      (route) => route.type === MENU_TYPE_CATEGORY && route.category_id === id,
    );

    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.log('Index not found for category: ' + JSON.stringify({id, title}));
      EventRegister.emit(EVENT_OPEN_CATEGORY, {id, title});
    }
  },
  setOfflineMode: (offline) => {
    set({isOfflineMode: offline});
  },
}));

const parseRoutesV2 = (apiResponse: Menu2Response): Menu2Item[] => {
  const flat = apiResponse.items.flatMap((item) => {
    if (item.type === MENU_TYPE_EXPANDABLE && item.items) {
      return item.items;
    }
    return item;
  });

  const categories = flat.filter((item): item is Menu2ItemCategory => {
    return item.type === MENU_TYPE_CATEGORY;
  });

  const homeRoute = flat.find((item): item is Menu2Item => item.type === MENU_TYPE_HOME);
  const radiotekaRoute = flat.find((item): item is Menu2Item => item.type === MENU_TYPE_RADIOTEKA);
  const mediatekaRoute = flat.find((item): item is Menu2Item => item.type === MENU_TYPE_MEDIATEKA);

  const newestRoute: Menu2ItemNewest = {
    type: MENU_TYPE_NEWEST,
    title: 'Naujausi',
  };

  const popularRoute: Menu2ItemPopular = {
    type: MENU_TYPE_POPULAR,
    title: 'Populiariausi',
  };

  return [
    ...(homeRoute
      ? [
          {
            ...homeRoute,
            // Ensure home route always has this exact title
            title: 'Pagrindinis',
          },
        ]
      : []),
    ...(mediatekaRoute
      ? [
          {
            ...mediatekaRoute,
            // Ensure mediateka route always has this exact title
            title: 'Mediateka',
          },
        ]
      : []),
    ...(radiotekaRoute
      ? [
          {
            ...radiotekaRoute,
            // Ensure radioteka route always has this exact title
            title: 'Radioteka',
          },
        ]
      : []),

    newestRoute,
    popularRoute,
    ...categories,
  ];
};
