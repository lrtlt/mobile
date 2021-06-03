import {MenuResponse, SearchFilter} from '../../api/Types';
import {
  FETCH_MENU_ITEMS,
  OPEN_CATEGORY_FOR_NAME,
  SET_SEARCH_FILTER,
  RESET_SEARCH_FILTER,
  API_MENU_ITEMS_RESULT,
  API_MENU_ITEMS_ERROR,
} from './actionTypes';
import {FetchHomeAction, FetchHomeErrorAction, FetchHomeResultAction} from './articles';

export type FetchMenuItemsAction = {
  type: typeof FETCH_MENU_ITEMS;
};
export const fetchMenuItems = (): FetchMenuItemsAction => ({type: FETCH_MENU_ITEMS});

export type FetchMenuItemsResultAction = {
  type: typeof API_MENU_ITEMS_RESULT;
  data: MenuResponse;
};
export const fetchMenuItemsResult = (data: MenuResponse): FetchMenuItemsResultAction => ({
  type: API_MENU_ITEMS_RESULT,
  data,
});

export type FetchMenuItemsErrorAction = {
  type: typeof API_MENU_ITEMS_ERROR;
};
export const fetchMenuItemsError = (): FetchMenuItemsErrorAction => ({
  type: API_MENU_ITEMS_ERROR,
});

export type OpenCategoryByNameAction = {
  type: typeof OPEN_CATEGORY_FOR_NAME;
  categoryName: string;
};
export const openCategoryForName = (categoryName: string): OpenCategoryByNameAction => ({
  type: OPEN_CATEGORY_FOR_NAME,
  categoryName,
});

export type SetSearchFilterAction = {
  type: typeof SET_SEARCH_FILTER;
  filter: SearchFilter;
};
export const setSearchFilter = (filter: SearchFilter): SetSearchFilterAction => ({
  type: SET_SEARCH_FILTER,
  filter,
});

export type ResetSearchFilterAction = {
  type: typeof RESET_SEARCH_FILTER;
};
export const resetSearchFilter = (): ResetSearchFilterAction => ({
  type: RESET_SEARCH_FILTER,
});

export type NavigationActionType =
  | FetchMenuItemsAction
  | FetchMenuItemsResultAction
  | FetchMenuItemsErrorAction
  | OpenCategoryByNameAction
  | SetSearchFilterAction
  | ResetSearchFilterAction
  | FetchHomeAction
  | FetchHomeResultAction
  | FetchHomeErrorAction;
