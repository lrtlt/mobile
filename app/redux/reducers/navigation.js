import {
  SET_SELECTED_CATEGORY,
  API_HOME_RESULT,
  API_HOME_ERROR,
  API_MENU_ITEMS_RESULT,
  API_MENU_ITEMS_ERROR,
  FETCH_MENU_ITEMS,
  OPEN_CATEGORY_FOR_NAME,
  FETCH_HOME,
  SET_SEARCH_FILTER,
  RESET_SEARCH_FILTER,
} from '../actions/actionTypes';
import { ARTICLE_LIST_TYPE_HOME } from '../../constants';

import EStyleSheet from 'react-native-extended-stylesheet';

const defaultSearchFilter = { type: 0, section: '', days: '' };

const initialState = {
  selectedCategory: 0,
  routes: [],
  pages: [],
  isLoading: false,
  isReady: false,
  isError: false,
  filter: defaultSearchFilter,
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
        isReady: false,
      };
    }
    case API_HOME_RESULT:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isReady: true,
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
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.category,
      };
    case OPEN_CATEGORY_FOR_NAME: {
      const { categoryName } = action;
      const index = state.routes.findIndex(route => route.title.toLowerCase() === categoryName.toLowerCase());

      if (index > 0) {
        return {
          ...state,
          selectedCategory: index,
        };
      } else {
        console.warn('Index not found for route: ' + categoryName);
        return state;
      }
    }
    default:
      return state;
  }
};

const parseRoutes = apiResponse => {
  const routes = [];

  routes.push({
    key: ARTICLE_LIST_TYPE_HOME,
    title: EStyleSheet.value('$mainWindow'),
    type: ARTICLE_LIST_TYPE_HOME,
  });

  const availableTypes = ["mediateka", "newest", "popular", "category"];

  apiResponse.main_menu
    .filter(item => {
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

const parsePages = apiResponse => {
  const pages = [];

  apiResponse.main_menu
    .filter(item => {
      return item.type === "page";
    })
    .forEach(item => {
      const routes = item.categories.map(item => {
        return {
          key: item.name,
          title: item.name,
          type: "category",
          categoryId: item.id,
        };
      });

      pages.push({
        key: item.name,
        title: item.name,
        type: item.type,
        routes
      });
    });

  if (pages.length > 0) {
    console.log('Found pages', pages);
  }

  return pages;
};

export default reducer;
