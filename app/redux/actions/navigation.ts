import {MenuResponse} from '../../api/Types';
import {
  FETCH_MENU_ITEMS,
  OPEN_CATEGORY_FOR_NAME,
  API_MENU_ITEMS_RESULT,
  API_MENU_ITEMS_ERROR,
  SET_LAUNCH_URL,
  CLEAR_LAUNCH_URL,
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

export type SetLaunchUrl = {
  type: typeof SET_LAUNCH_URL;
  url: string;
};

export const setLaunchUrl = (url: string): SetLaunchUrl => ({
  type: SET_LAUNCH_URL,
  url,
});

export type ClearLaunchUrl = {
  type: typeof CLEAR_LAUNCH_URL;
};

export const clearLaunchUrl = (): ClearLaunchUrl => ({
  type: CLEAR_LAUNCH_URL,
});

export type NavigationActionType =
  | FetchMenuItemsAction
  | FetchMenuItemsResultAction
  | FetchMenuItemsErrorAction
  | OpenCategoryByNameAction
  | FetchHomeAction
  | FetchHomeResultAction
  | FetchHomeErrorAction
  | SetLaunchUrl
  | ClearLaunchUrl;
