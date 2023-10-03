import AsyncStorage from '@react-native-async-storage/async-storage';
import {legacy_createStore as createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootSaga from './sagas';
import rootReducer from './reducers';

// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['config', 'articleStorage'],
  blacklist: ['navigation', 'articles', 'program'],
};

let saggaMiddleWare = createSagaMiddleware();
let composeEnhancers = composeWithDevTools({});

const middlewaresToApply = [saggaMiddleWare];

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middlewaresToApply)));

let persistor = persistStore(store);

saggaMiddleWare.run(rootSaga);

export {store, persistor};
