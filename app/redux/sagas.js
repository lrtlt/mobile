import { takeEvery, call, put } from 'redux-saga/effects';
import {
  homeGet,
  menuGet,
  categoryGet,
  categoryTopsGet,
  newestArticlesGet,
  mediatekaGet,
  programGet,
} from '../api';
import {
  FETCH_HOME,
  API_HOME_RESULT,
  API_HOME_ERROR,
  FETCH_CATEGORY,
  REFRESH_CATEGORY,
  API_CATEGORY_RESULT,
  API_CATEGORY_ERROR,
  FETCH_MENU_ITEMS,
  API_MENU_ITEMS_RESULT,
  API_MENU_ITEMS_ERROR,
  FETCH_NEWEST,
  API_NEWEST_RESULT,
  API_NEWEST_ERROR,
  REFRESH_NEWEST,
  FETCH_MEDIATEKA,
  API_MEDIATEKA_RESULT,
  API_MEDIATEKA_ERROR,
  API_PROGRAM_RESULT,
  API_PROGRAM_ERROR,
  FETCH_PROGRAM,
} from './actions/actionTypes';

const fetchMenuItemsApi = () => fetch(menuGet());

const fetchArticlesApi = () => fetch(homeGet());

const fetchProgramApi = () => fetch(programGet());

const fetchMediatekaApi = () => fetch(mediatekaGet());

const fetchNewestAPI = (page, count) => fetch(newestArticlesGet(count, page));

const fetchCategoryAPI = (categoryId, count, page) => fetch(categoryGet(categoryId, count, page));

const fetchCategoryTopsAPI = (categoryId, count) => fetch(categoryTopsGet(categoryId, count));

function* fetchMenuItems() {
  try {
    const response = yield call(fetchMenuItemsApi);
    const result = yield response.json();
    //console.log('API RESPONSE MENU', result);
    yield put({ type: API_MENU_ITEMS_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_MENU_ITEMS_ERROR });
  }
}

function* fetchArticlesData() {
  try {
    const response = yield call(fetchArticlesApi);
    const result = yield response.json();
    //console.log('API RESPONSE ARTICLES', result);
    yield put({ type: API_HOME_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_HOME_ERROR });
  }
}

function* fetchMediatekaData() {
  try {
    const response = yield call(fetchMediatekaApi);
    const result = yield response.json();
    //console.log('API RESPONSE MEDIATEKA', result);
    yield put({ type: API_MEDIATEKA_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_MEDIATEKA_ERROR });
  }
}

function* fetchProgramData() {
  try {
    const response = yield call(fetchProgramApi);
    const result = yield response.json();
    //console.log('API RESPONSE PROGRAM', result);
    yield put({ type: API_PROGRAM_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_PROGRAM_ERROR });
  }
}

function* fetchCategoryData(action) {
  try {
    const { categoryId, count, page } = action.payload;
    const response = yield call(() => fetchCategoryAPI(categoryId, count, page));
    const result = yield response.json();
    result.refresh = false;
    //console.log('API RESPONSE', result);
    yield put({ type: API_CATEGORY_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_CATEGORY_ERROR, payload: action.payload });
  }
}

function* refreshCategoryData(action) {
  try {
    const { categoryId, count } = action.payload;
    const response = yield call(() => fetchCategoryAPI(categoryId, count, 1));
    const result = yield response.json();
    result.refresh = true;
    //console.log('API RESPONSE', result);
    yield put({ type: API_CATEGORY_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_CATEGORY_ERROR, payload: action.payload });
  }
}

function* fetchNewestData(action) {
  try {
    const { page, count } = action.payload;
    const response = yield call(() => fetchNewestAPI(page, count));
    const result = yield response.json();
    result.refresh = false;
    //console.log('API RESPONSE NEWEST', result);
    yield put({ type: API_NEWEST_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_NEWEST_ERROR });
  }
}

function* refreshNewestData(action) {
  try {
    const { count } = action.payload;
    const response = yield call(() => fetchNewestAPI(1, count));
    const result = yield response.json();
    result.refresh = true;
    //console.log('API RESPONSE _REFRESH', result);
    yield put({ type: API_NEWEST_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_NEWEST_ERROR });
  }
}

function* fetchCategoryTopsData(action) {
  try {
    const { categoryId, count } = action.payload;
    const response = yield call(() => fetchCategoryTopsAPI(categoryId, count));
    const result = yield response.json();
    //console.log('API RESPONSE CATEGORY TOPS', result);
    yield put({ type: API_CATEGORY_RESULT, result });
  } catch (e) {
    //console.log('Saga error', e);
    yield put({ type: API_CATEGORY_ERROR });
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_MENU_ITEMS, fetchMenuItems);
  yield takeEvery(FETCH_HOME, fetchArticlesData);
  yield takeEvery(FETCH_CATEGORY, fetchCategoryData);
  yield takeEvery(REFRESH_CATEGORY, refreshCategoryData);
  yield takeEvery(FETCH_NEWEST, fetchNewestData);
  yield takeEvery(REFRESH_NEWEST, refreshNewestData);
  yield takeEvery(FETCH_MEDIATEKA, fetchMediatekaData);
  yield takeEvery(FETCH_PROGRAM, fetchProgramData);
}
