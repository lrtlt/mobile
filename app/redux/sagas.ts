import {takeEvery, call, put} from 'redux-saga/effects';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  fetchHomeApi,
  fetchAudiotekaApi,
  fetchCategoryApi,
  fetchMediatekaApi,
  fetchNewestApi,
  fetchPopularApi,
} from '../api';
import {
  AudiotekaResponse,
  CategoryArticlesResponse,
  HomeDataResponse,
  MediatekaDataResponse,
  NewestArticlesResponse,
  PopularArticlesResponse,
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
  FetchNewestArticlesAction,
  fetchNewestError,
  fetchNewestResult,
  FetchPopularArticlesAction,
  fetchPopularError,
  fetchPopularResult,
  RefreshCategoryArticlesAction,
  RefreshNewestArticlesAction,
  RefreshPopularArticlesAction,
} from './actions';
import {
  FETCH_HOME,
  FETCH_CATEGORY,
  REFRESH_CATEGORY,
  FETCH_NEWEST,
  REFRESH_NEWEST,
  FETCH_POPULAR,
  REFRESH_POPULAR,
  FETCH_MEDIATEKA,
  FETCH_AUDIOTEKA,
} from './actions/actionTypes';

function report(error: any, message: string) {
  crashlytics().log(JSON.stringify(error, null, 4));
  crashlytics().recordError(
    {
      name: 'APIError: menu',
      message: error.message ?? message,
      stack: error.stack ?? JSON.stringify(error, null, 4),
    },
    'APIError',
  );
}

function* fetchArticlesData() {
  try {
    const data: HomeDataResponse = yield call(fetchHomeApi);
    yield put(fetchHomeResult(data));
  } catch (e) {
    console.log('Saga error', e);
    report(e, 'Error getting home data from API');
    yield put(fetchHomeError());
  }
  return 0;
}

function* fetchMediatekaData() {
  try {
    const data: MediatekaDataResponse = yield call(fetchMediatekaApi);
    yield put(fetchMediatekaResult(data));
  } catch (e) {
    console.log('Saga error', e);
    report(e, 'Error getting mediateka data from API');
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
    report(e, 'Error getting audioteka data from API');
    yield put(fetchAudiotekaError());
  }
  return 0;
}

function* fetchCategoryData(action: FetchCategoryArticlesAction) {
  const {categoryId, count, page, date_max, not_id} = action.payload;
  try {
    const data: CategoryArticlesResponse = yield call(
      async () => await fetchCategoryApi(categoryId, count, page, date_max, not_id),
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
    const {page, count, date_max, not_id} = action.payload;
    const data: NewestArticlesResponse = yield call(() => fetchNewestApi(page, count, date_max, not_id));
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
  yield takeEvery(FETCH_HOME, fetchArticlesData);
  yield takeEvery(FETCH_CATEGORY, fetchCategoryData);
  yield takeEvery(REFRESH_CATEGORY, refreshCategoryData);
  yield takeEvery(FETCH_NEWEST, fetchNewestData);
  yield takeEvery(REFRESH_NEWEST, refreshNewestData);
  yield takeEvery(FETCH_POPULAR, fetchPopularData);
  yield takeEvery(REFRESH_POPULAR, refreshPopularData);
  yield takeEvery(FETCH_MEDIATEKA, fetchMediatekaData);
  yield takeEvery(FETCH_AUDIOTEKA, fetchAudiotekaData);
}
