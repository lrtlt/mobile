import {create} from 'zustand';
import {
  MenuItem,
  MenuItemCategory,
  MenuItemChannels,
  MenuItemPage,
  MenuItemProjects,
  MenuResponse,
  ROUTE_TYPE_AUDIOTEKA,
  ROUTE_TYPE_CATEGORY,
  ROUTE_TYPE_HOME,
  ROUTE_TYPE_MEDIA,
  ROUTE_TYPE_NEWEST,
  ROUTE_TYPE_PAGE,
  ROUTE_TYPE_POPULAR,
  ROUTE_TYPE_WEBPAGES,
} from '../api/Types';
import {fetchMenuItemsApi} from '../api';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_OPEN_CATEGORY, EVENT_SELECT_CATEGORY_INDEX} from '../constants';
import {useSettingsStore} from './settings_store';

export type NavigationState = {
  routes: (MenuItem | MenuItemCategory)[];
  channels?: MenuItemChannels;
  pages: MenuItemPage[];
  projects: MenuItemProjects[];
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  launchUrl?: string;
  fetchMenuItems: () => void;
  openCategoryById: (id: number, title?: string) => void;
  openCategoryByName: (name: string) => void;
  setLaunchUrl: (url?: string) => void;
};

const initialState: Omit<
  NavigationState,
  'fetchMenuItems' | 'openCategoryByName' | 'openCategoryById' | 'setLaunchUrl'
> = {
  routes: [],
  pages: [],
  projects: [],
  isLoading: false,
  isReady: false,
  isError: false,
};

export const useNavigationStore = create<NavigationState>((set) => ({
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
  openCategoryByName: (name) => {
    const state = useNavigationStore.getState();
    const index = state.routes.findIndex((route) => route.name.toLowerCase() === name.toLowerCase());

    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.warn('Index not found for route: ' + name);
    }
  },
  openCategoryById: (id, title) => {
    const state = useNavigationStore.getState();
    const index = state.routes.findIndex((route) => route.type === ROUTE_TYPE_CATEGORY && route.id === id);

    if (index !== -1) {
      EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
    } else {
      console.log('Index not found for category: ' + JSON.stringify({id, title}));
      EventRegister.emit(EVENT_OPEN_CATEGORY, {id, title});
    }
  },
  setLaunchUrl: (url) => set({launchUrl: url}),
}));

const parseRoutes = (apiResponse: MenuResponse): (MenuItem | MenuItemCategory)[] => {
  const availableTypes = [
    ROUTE_TYPE_HOME,
    ROUTE_TYPE_AUDIOTEKA,
    ROUTE_TYPE_MEDIA,
    ROUTE_TYPE_NEWEST,
    ROUTE_TYPE_POPULAR,
    ROUTE_TYPE_CATEGORY,
  ];

  const routes = apiResponse.main_menu.filter((item): item is MenuItem | MenuItemCategory => {
    return availableTypes.includes(item.type);
  });
  routes.unshift({
    type: ROUTE_TYPE_HOME,
    name: 'Pagrindinis',
  });
  return routes;
};

const parsePages = (apiResponse: MenuResponse): MenuItemPage[] => {
  return apiResponse.main_menu.filter((item): item is MenuItemPage => {
    return item.type === ROUTE_TYPE_PAGE;
  });
};

const parseChannels = (apiResponse: MenuResponse): MenuItemChannels | undefined => {
  return apiResponse.main_menu.find((i): i is MenuItemChannels => i.type === 'channels');
};

const parseProjects = (apiResponse: MenuResponse): MenuItemProjects[] => {
  return apiResponse.main_menu.filter((item): item is MenuItemProjects => {
    return item.type === ROUTE_TYPE_WEBPAGES;
  });
};
