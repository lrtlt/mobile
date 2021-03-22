import {
  API_HOME_RESULT,
  API_HOME_ERROR,
  API_MENU_ITEMS_RESULT,
  API_MENU_ITEMS_ERROR,
  FETCH_MENU_ITEMS,
  OPEN_CATEGORY_FOR_NAME,
  FETCH_HOME,
  SET_SEARCH_FILTER,
  RESET_SEARCH_FILTER,
  OPEN_LINKING_URL,
} from '../actions/actionTypes';
import {EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {EventRegister} from 'react-native-event-listeners';
import {Linking} from 'react-native';
import {NavigationActionType} from '../actions';
import {
  MenuItem,
  MenuItemCategory,
  MenuItemPage,
  MenuItemProjects,
  MenuResponse,
  ROUTE_TYPE_HOME,
  ROUTE_TYPE_AUDIOTEKA,
  ROUTE_TYPE_CATEGORY,
  ROUTE_TYPE_MEDIA,
  ROUTE_TYPE_NEWEST,
  ROUTE_TYPE_PAGE,
  ROUTE_TYPE_POPULAR,
  ROUTE_TYPE_WEBPAGES,
  SearchFilter,
  SEARCH_TYPE_ALL,
} from '../../api/Types';

export type NavigationState = {
  routes: (MenuItem | MenuItemCategory)[];
  pages: MenuItemPage[];
  projects: MenuItemProjects[];
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  filter: SearchFilter;
  linkingOpenUrl?: string;
};

const initialState: NavigationState = {
  routes: [],
  pages: [],
  projects: [],
  isLoading: false,
  isReady: false,
  isError: false,
  filter: {
    type: SEARCH_TYPE_ALL,
    section: '',
    days: '',
  },
  linkingOpenUrl: undefined,
};

const reducer = (state = initialState, action: NavigationActionType): NavigationState => {
  switch (action.type) {
    case SET_SEARCH_FILTER: {
      return {
        ...state,
        filter: action.filter,
      };
    }
    case RESET_SEARCH_FILTER: {
      return {
        ...state,
        filter: {
          type: SEARCH_TYPE_ALL,
          section: '',
          days: '',
        },
      };
    }
    case FETCH_MENU_ITEMS: {
      return {
        ...state,
        isLoading: true,
        isError: false,
        isReady: false,
      };
    }
    case FETCH_HOME: {
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    }
    case API_HOME_RESULT:
      if (state.linkingOpenUrl) {
        if (Linking.canOpenURL(state.linkingOpenUrl)) {
          Linking.openURL(state.linkingOpenUrl);
        }
      }

      return {
        ...state,
        isLoading: false,
        isError: false,
        isReady: true,
        linkingOpenUrl: undefined,
      };
    case API_HOME_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isReady: false,
      };
    case API_MENU_ITEMS_RESULT:
      return {
        ...state,
        routes: parseRoutes(action.data),
        pages: parsePages(action.data),
        projects: parseProjects(action.data),
        isLoading: false,
        isError: false,
        isReady: false,
      };
    case API_MENU_ITEMS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isReady: false,
      };
    case OPEN_CATEGORY_FOR_NAME: {
      const {categoryName} = action;
      const index = state.routes.findIndex(
        (route) => route.name.toLowerCase() === categoryName.toLowerCase(),
      );
      if (index > 0) {
        EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
      } else {
        console.warn('Index not found for route: ' + categoryName);
      }
      return state;
    }
    case OPEN_LINKING_URL: {
      const {url} = action;
      if (state.isReady) {
        if (Linking.canOpenURL(url)) {
          Linking.openURL(url);
        }
        return state;
      } else {
        return {
          ...state,
          linkingOpenUrl: url,
        };
      }
    }
    default:
      return state;
  }
};

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

const parseProjects = (apiResponse: MenuResponse): MenuItemProjects[] => {
  return apiResponse.main_menu.filter((item): item is MenuItemProjects => {
    return item.type === ROUTE_TYPE_WEBPAGES;
  });
};

export default reducer;
