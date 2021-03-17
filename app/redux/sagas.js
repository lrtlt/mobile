import {takeEvery, call, put} from 'redux-saga/effects';
import {
  fetchHomeApi,
  fetchAudiotekaApi,
  fetchCategoryApi,
  fetchMediatekaApi,
  fetchMenuItemsApi,
  fetchNewestApi,
  fetchPopularApi,
  fetchProgramApi,
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
  FETCH_POPULAR,
  API_POPULAR_RESULT,
  API_POPULAR_ERROR,
  REFRESH_POPULAR,
  FETCH_MEDIATEKA,
  API_MEDIATEKA_RESULT,
  API_MEDIATEKA_ERROR,
  API_PROGRAM_RESULT,
  API_PROGRAM_ERROR,
  FETCH_PROGRAM,
  FETCH_AUDIOTEKA,
  API_AUDIOTEKA_RESULT,
  API_AUDIOTEKA_ERROR,
} from './actions/actionTypes';

function* fetchMenuItems() {
  try {
    const data = yield call(fetchMenuItemsApi);
    yield put({type: API_MENU_ITEMS_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_MENU_ITEMS_ERROR});
  }
  return 0;
}

function* fetchArticlesData() {
  try {
    const data = yield call(fetchHomeApi);
    yield put({type: API_HOME_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_HOME_ERROR});
  }
  return 0;
}

function* fetchMediatekaData() {
  try {
    const data = yield call(fetchMediatekaApi);
    yield put({type: API_MEDIATEKA_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_MEDIATEKA_ERROR});
  }
  return 0;
}

function* fetchAudiotekaData() {
  try {
    const data = yield call(fetchAudiotekaApi);
    yield put({type: API_AUDIOTEKA_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_AUDIOTEKA_ERROR});
  }
  return 0;
}

function* fetchProgramData() {
  try {
    const data = yield call(fetchProgramApi);
    yield put({type: API_PROGRAM_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_PROGRAM_ERROR});
  }
  return 0;
}

function* fetchCategoryData(action) {
  try {
    const {categoryId, count, page} = action.payload;
    const data = yield call(async () => await fetchCategoryApi(categoryId, count, page));
    data.refresh = false;
    yield put({type: API_CATEGORY_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_CATEGORY_ERROR, payload: action.payload});
  }
  return 0;
}

function* refreshCategoryData(action) {
  try {
    const {categoryId, count} = action.payload;
    const data = yield call(async () => await fetchCategoryApi(categoryId, count, 1));
    data.refresh = true;
    yield put({type: API_CATEGORY_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_CATEGORY_ERROR, payload: action.payload});
  }
  return 0;
}

function* fetchNewestData(action) {
  try {
    const {page, count} = action.payload;
    const data = yield call(() => fetchNewestApi(page, count));
    data.refresh = false;
    yield put({type: API_NEWEST_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_NEWEST_ERROR});
  }
  return 0;
}

function* refreshNewestData(action) {
  try {
    const {count} = action.payload;
    const data = yield call(() => fetchNewestApi(1, count));
    data.refresh = true;
    yield put({type: API_NEWEST_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_NEWEST_ERROR});
  }
  return 0;
}

function* fetchPopularData(action) {
  try {
    const {page, count} = action.payload;
    const data = yield call(() => fetchPopularApi(page, count));
    data.refresh = false;
    yield put({type: API_POPULAR_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_POPULAR_ERROR});
  }
  return 0;
}

function* refreshPopularData(action) {
  try {
    const {count} = action.payload;
    const data = yield call(() => fetchPopularApi(1, count));
    data.refresh = true;
    yield put({type: API_POPULAR_RESULT, data});
  } catch (e) {
    console.log('Saga error', e);
    yield put({type: API_POPULAR_ERROR});
  }
  return 0;
}

export default function* rootSaga() {
  yield takeEvery(FETCH_MENU_ITEMS, fetchMenuItems);
  yield takeEvery(FETCH_HOME, fetchArticlesData);
  yield takeEvery(FETCH_CATEGORY, fetchCategoryData);
  yield takeEvery(REFRESH_CATEGORY, refreshCategoryData);
  yield takeEvery(FETCH_NEWEST, fetchNewestData);
  yield takeEvery(REFRESH_NEWEST, refreshNewestData);
  yield takeEvery(FETCH_POPULAR, fetchPopularData);
  yield takeEvery(REFRESH_POPULAR, refreshPopularData);
  yield takeEvery(FETCH_MEDIATEKA, fetchMediatekaData);
  yield takeEvery(FETCH_AUDIOTEKA, fetchAudiotekaData);
  yield takeEvery(FETCH_PROGRAM, fetchProgramData);
}
