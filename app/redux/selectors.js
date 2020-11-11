import EStyleSheet from 'react-native-extended-stylesheet';
import {ARTICLE_LIST_TYPE_MEDIA} from '../constants';

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
