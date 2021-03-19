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
  AudiotekaResponse,
  CategoryArticlesResponse,
  HomeDataResponse,
  MenuResponse,
  NewestArticlesResponse,
  PopularArticlesResponse,
  ProgramResponse,
} from '../api/Types';
import {
  fetchAudiotekaError,
  fetchAudiotekaResult,
  FetchCategoryArticlesAction,
  fetchCategoryError,
  fetchCategoryResult,
  fetchHomeError,
  fetchHomeResult,
  fetchMediatekaError,
  fetchMediatekaResult,
  fetchMenuItemsError,
  fetchMenuItemsResult,
  FetchNewestArticlesAction,
  fetchNewestError,
  fetchNewestResult,
  FetchPopularArticlesAction,
  fetchPopularError,
  fetchPopularResult,
  fetchProgramError,
  fetchProgramResult,
  RefreshCategoryArticlesAction,
  RefreshNewestArticlesAction,
  RefreshPopularArticlesAction,
} from './actions';
import {
  FETCH_HOME,
  FETCH_CATEGORY,
  REFRESH_CATEGORY,
  FETCH_MENU_ITEMS,
  FETCH_NEWEST,
  REFRESH_NEWEST,
  FETCH_POPULAR,
  REFRESH_POPULAR,
  FETCH_MEDIATEKA,
  FETCH_PROGRAM,
  FETCH_AUDIOTEKA,
} from './actions/actionTypes';

function* fetchMenuItems() {
  try {
    const data: MenuResponse = yield call(fetchMenuItemsApi);
    yield put(fetchMenuItemsResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchMenuItemsError());
  }
  return 0;
}

function* fetchArticlesData() {
  try {
    const data: HomeDataResponse = yield call(fetchHomeApi);
    yield put(fetchHomeResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchHomeError());
  }
  return 0;
}

function* fetchMediatekaData() {
  try {
    const data: HomeDataResponse = yield call(fetchMediatekaApi);
    yield put(fetchMediatekaResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchMediatekaError());
  }
  return 0;
}

function* fetchAudiotekaData() {
  try {
    const data: AudiotekaResponse = yield call(fetchAudiotekaApi);
    yield put(fetchAudiotekaResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchAudiotekaError());
  }
  return 0;
}

function* fetchProgramData() {
  try {
    const data: ProgramResponse = yield call(fetchProgramApi);
    yield put(fetchProgramResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchProgramError());
  }
  return 0;
}

function* fetchCategoryData(action: FetchCategoryArticlesAction) {
  const {categoryId, count, page} = action.payload;
  try {
    const data: CategoryArticlesResponse = yield call(
      async () => await fetchCategoryApi(categoryId, count, page),
    );
    data.refresh = false;
    yield put(fetchCategoryResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchCategoryError(categoryId));
  }
  return 0;
}

function* refreshCategoryData(action: RefreshCategoryArticlesAction) {
  const {categoryId, count} = action.payload;
  try {
    const data: CategoryArticlesResponse = yield call(
      async () => await fetchCategoryApi(categoryId, count, 1),
    );
    data.refresh = true;
    yield put(fetchCategoryResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchCategoryError(categoryId));
  }
  return 0;
}

function* fetchNewestData(action: FetchNewestArticlesAction) {
  try {
    const {page, count} = action.payload;
    const data: NewestArticlesResponse = yield call(() => fetchNewestApi(page, count));
    data.refresh = false;
    yield put(fetchNewestResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchNewestError());
  }
  return 0;
}

function* refreshNewestData(action: RefreshNewestArticlesAction) {
  try {
    const {count} = action.payload;
    const data: NewestArticlesResponse = yield call(() => fetchNewestApi(1, count));
    data.refresh = true;
    yield put(fetchNewestResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchNewestError());
  }
  return 0;
}

function* fetchPopularData(action: FetchPopularArticlesAction) {
  try {
    const {page, count} = action.payload;
    const data: PopularArticlesResponse = yield call(() => fetchPopularApi(page, count));
    data.refresh = false;
    yield put(fetchPopularResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchPopularError());
  }
  return 0;
}

function* refreshPopularData(action: RefreshPopularArticlesAction) {
  try {
    const {count} = action.payload;
    const data: PopularArticlesResponse = yield call(() => fetchPopularApi(1, count));
    data.refresh = true;
    yield put(fetchPopularResult(data));
  } catch (e) {
    console.log('Saga error', e);
    yield put(fetchPopularError());
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
