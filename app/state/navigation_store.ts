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
  MENU_TYPE_PAGE,
  MENU_TYPE_POPULAR,
  MENU_TYPE_RADIOTEKA,
  MENU_TYPE_WEBPAGE,
  MenuItem,
  MenuItemCategory,
  MenuItemChannels,
  MenuItemPage,
  MenuItemProjects,
  MenuResponse,
} from '../api/Types';
import {fetchMenuItemsApi, fetchMenuItemsV2} from '../api';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_OPEN_CATEGORY, EVENT_SELECT_CATEGORY_INDEX} from '../constants';
import {useSettingsStore} from './settings_store';

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
  fetchMenuItems: () => void;
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
  fetchMenuItems: async () => {
    set({isLoading: true, isError: false, isReady: false});
    try {
      const data: MenuResponse = await fetchMenuItemsApi();
      set({
        routes: parseRoutes(data),
        channels: parseChannels(data),
        pages: parsePages(data),
        projects: parseProjects(data),
        isLoading: false,
        isReady: true,
      });
      useSettingsStore.getState().fetchLogo(data.logo);
    } catch (e) {
      console.log('Fetch menu error', e);
      set({isLoading: false, isError: true, isReady: false});
    }
  },
  fetchMenuItemsV2: async () => {
    set({isLoading: true, isError: false, isReady: false});
    try {
      const data = await fetchMenuItemsV2();
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

const parseRoutes = (apiResponse: MenuResponse): (MenuItem | MenuItemCategory)[] => {
  const availableTypes = [
    MENU_TYPE_HOME,
    MENU_TYPE_RADIOTEKA,
    MENU_TYPE_MEDIATEKA,
    MENU_TYPE_NEWEST,
    MENU_TYPE_POPULAR,
    MENU_TYPE_CATEGORY,
  ];

  const routes = apiResponse.main_menu.filter((item): item is MenuItem | MenuItemCategory => {
    return availableTypes.includes(item.type);
  });
  routes.unshift({
    type: MENU_TYPE_HOME,
    name: 'Pagrindinis',
  });
  return routes;
};

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

const parsePages = (apiResponse: MenuResponse): MenuItemPage[] => {
  return apiResponse.main_menu.filter((item): item is MenuItemPage => {
    return item.type === MENU_TYPE_PAGE;
  });
};

const parseChannels = (apiResponse: MenuResponse): MenuItemChannels | undefined => {
  return apiResponse.main_menu.find((i): i is MenuItemChannels => i.type === 'channels');
};

const parseProjects = (apiResponse: MenuResponse): MenuItemProjects[] => {
  return apiResponse.main_menu.filter((item): item is MenuItemProjects => {
    return item.type === MENU_TYPE_WEBPAGE;
  });
};
