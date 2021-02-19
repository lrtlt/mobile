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
import {ARTICLE_LIST_TYPE_HOME, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {EventRegister} from 'react-native-event-listeners';
import {Linking} from 'react-native';

const defaultSearchFilter = {type: 0, section: '', days: ''};

const initialState = {
  routes: [],
  pages: [],
  projects: null,
  isLoading: false,
  isReady: false,
  isError: false,
  filter: defaultSearchFilter,
  linkingOpenUrl: undefined,
};

const reducer = (state = initialState, action) => {
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
        filter: defaultSearchFilter,
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
        //  isReady: false,
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
        routes: parseRoutes(action.result),
        pages: parsePages(action.result),
        projects: parseProjects(action.result),
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
        (route) => route.title.toLowerCase() === categoryName.toLowerCase(),
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

const parseRoutes = (apiResponse) => {
  const routes = [];

  //TODO update 'Pagrindinis' hardcode.
  routes.push({
    key: ARTICLE_LIST_TYPE_HOME,
    title: 'Pagrindinis',
    type: ARTICLE_LIST_TYPE_HOME,
  });

  const availableTypes = ['mediateka', 'newest', 'popular', 'category'];

  apiResponse.main_menu
    .filter((item) => {
      return availableTypes.includes(item.type);
    })
    .forEach((item, i) => {
      routes.push({
        key: item.name,
        title: item.name,
        type: item.type,
        categoryId: item.id,
      });
    });

  console.log(routes);
  return routes;
};

const parsePages = (apiResponse) => {
  const pages = [];

  apiResponse.main_menu
    .filter((item) => {
      return item.type === 'page';
    })
    .forEach((item) => {
      const routes = item.categories.map((category) => {
        return {
          key: category.name,
          title: category.name,
          type: 'category',
          categoryId: category.id,
        };
      });

      pages.push({
        key: item.name,
        title: item.name,
        type: item.type,
        routes,
      });
    });

  if (pages.length > 0) {
    console.log('Found pages', pages);
  }

  return pages;
};

const parseProjects = (apiResponse) => {
  let projects;

  apiResponse.main_menu
    .filter((item) => {
      return item.type === 'webpages';
    })
    .forEach((item) => {
      const routes = item.categories.map((category) => {
        return {
          key: category.name,
          title: category.name,
          type: 'webpage',
          url: category.url,
        };
      });

      projects = {
        key: item.name,
        title: item.name,
        type: item.type,
        routes,
      };
    });

  return projects;
};

export default reducer;
