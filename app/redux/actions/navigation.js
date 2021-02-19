import {
  FETCH_MENU_ITEMS,
  OPEN_CATEGORY_FOR_NAME,
  SET_SEARCH_FILTER,
  RESET_SEARCH_FILTER,
  OPEN_LINKING_URL,
} from './actionTypes';

export const fetchMenuItems = () => ({type: FETCH_MENU_ITEMS});

export const openCategoryForName = (categoryName) => ({
  type: OPEN_CATEGORY_FOR_NAME,
  categoryName,
});

export const setSearchFilter = (filter) => ({
  type: SET_SEARCH_FILTER,
  filter,
});

export const resetSearchFilter = () => ({
  type: RESET_SEARCH_FILTER,
});

export const openLinkingUrl = (url) => ({
  type: OPEN_LINKING_URL,
  url,
});
