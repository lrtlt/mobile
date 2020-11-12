import EStyleSheet from 'react-native-extended-stylesheet';
import {ARTICLE_LIST_TYPE_MEDIA, ARTICLE_LIST_TYPE_POPULAR, ARTICLE_LIST_TYPE_NEWEST} from '../constants';
import {formatArticles} from '../util/articleFormatters';

export const selectNavigationIsReady = (state) => {
  return state.navigation.isReady && state.navigation.routes.length !== 0;
};

export const selectSplashScreenState = (state) => {
  return {
    isReady: state.navigation.isReady,
    isLoading: state.navigation.isLoading,
    isError: state.navigation.isError,
    hasMenuData: state.navigation.routes.length !== 0,
  };
};

export const selectMainScreenState = (state) => {
  return {
    index: state.navigation.selectedCategory,
    routes: state.navigation.routes,
  };
};

export const selectNewestArticlesScreenState = (state) => {
  const {newest} = state.articles;

  const newestRoute = state.navigation.routes.find((r) => r.type === ARTICLE_LIST_TYPE_NEWEST);
  const title = newestRoute && newestRoute.title;

  return {
    ...newest,
    title,
  };
};

export const selectPopularArticlesScreenState = (state) => {
  const {popular} = state.articles;

  const popularRoute = state.navigation.routes.find((r) => r.type === ARTICLE_LIST_TYPE_POPULAR);
  const title = popularRoute && popularRoute.title;

  return {
    ...popular,
    title,
  };
};

export const selectCategoryScreenState = (categoryId) => (state) => {
  const category = state.articles.categories.find((val) => {
    return val.id === categoryId;
  });

  return {
    category,
  };
};

export const selectHomeScreenState = (type) => (state) => {
  const block = type === ARTICLE_LIST_TYPE_MEDIA ? state.articles.mediateka : state.articles.home;

  const mapSections = (items) => {
    return items.map((b, i) => {
      return {
        index: i,
        category: b.category,
        data: b.items,
        backgroundColor: EStyleSheet.value(b.category.backgroundColor),
      };
    });
  };

  return {
    refreshing: block.isFetching && block.items.length !== 0,
    lastFetchTime: block.lastFetchTime,
    sections: mapSections(block.items),
  };
};

export const selectBookmarksScreenState = (state) => {
  const {savedArticles} = state.articleStorage;
  return {articles: formatArticles(-1, savedArticles, false)};
};

export const selectHistoryScreenState = (state) => {
  const {history} = state.articleStorage;
  return {articles: formatArticles(-1, history, false)};
};

export const selectProgramScreenState = (state) => {
  const prog = state.program;
  const loadingState = prog.isError
    ? 'error'
    : prog.isFetching || state.program.program === null
    ? 'loading'
    : 'ready';

  return {
    loadingState,
    program: prog.program,
  };
};

export const selectArticleBookmarked = (articleId) => (state) => {
  const {savedArticles} = state.articleStorage;
  return savedArticles && savedArticles.find((a) => a.id === articleId) !== undefined;
};

export const selectDrawerData = (state) => {
  return {
    routes: state.navigation.routes,
    pages: state.navigation.pages,
    channels: state.articles.tvprog.items,
  };
};

export const selectSearchFilter = (state) => {
  return state.navigation.filter;
};

export const selectConfig = (state) => {
  return state.config;
};
