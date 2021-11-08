import {HomePageType} from '../../Types';
import {HomeChannels, ROUTE_TYPE_CATEGORY, ROUTE_TYPE_MEDIA} from '../api/Types';
import {formatArticles} from '../util/articleFormatters';
import {RootState} from './reducers';
import {HomeBlock} from './reducers/articles';
import {SavedArticle} from './reducers/articleStorage';

export const selectAppIsReady = (state: RootState) => {
  return state.navigation.isReady && state.navigation.routes.length !== 0;
};

export const selectSplashScreenState = (state: RootState) => {
  const {navigation} = state;
  return {
    isReady: navigation.isReady,
    isLoading: navigation.isLoading,
    isError: navigation.isError,
    hasMenuData: navigation.routes.length !== 0,
  };
};

export const selectMainScreenState = (state: RootState) => {
  const {navigation} = state;
  return {
    routes: navigation.routes.map((r) => {
      if (r.type === ROUTE_TYPE_CATEGORY) {
        return {type: r.type, key: r.name, title: r.name, categoryId: r.id};
      } else {
        return {type: r.type, key: r.name, title: r.name};
      }
    }),
  };
};

export const selectNewestArticlesScreenState = (state: RootState) => {
  return state.articles.newest;
};

export const selectPopularArticlesScreenState = (state: RootState) => {
  return state.articles.popular;
};

export const selectCategoryScreenState = (categoryId: number, categoryTitle?: string) => (
  state: RootState,
) => {
  return (
    state.articles.categories.find((category) => category.id === categoryId) ?? {
      id: categoryId,
      title: categoryTitle,
      articles: [],
      isFetching: false,
      isRefreshing: false,
      isError: false,
      lastFetchTime: 0,
      page: 0,
      nextPage: 1,
    }
  );
};

export const selectHomeScreenState = (type: HomePageType) => (state: RootState) => {
  const block = type === ROUTE_TYPE_MEDIA ? state.articles.mediateka : state.articles.home;

  const mapSections = (items: HomeBlock[]) => {
    return items.map((b) => {
      return {
        category: b.category,
        data: b.items,
      };
    });
  };

  return {
    refreshing: block.isFetching && block.items.length > 0,
    lastFetchTime: block.lastFetchTime,
    sections: mapSections(block.items),
  };
};

export const selectAudiotekaScreenState = (state: RootState) => {
  const block = state.articles.audioteka;
  return {
    refreshing: block.isFetching && block.data.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.data,
  };
};

export const selectBookmarksScreenState = (state: RootState) => {
  const {savedArticles} = state.articleStorage;
  return {articles: formatArticles(-1, savedArticles, false)};
};

export const selectHistoryScreenState = (state: RootState) => {
  const {history} = state.articleStorage;
  return {articles: formatArticles(-1, history, false)};
};

export const selectProgramScreenState = (state: RootState) => {
  const prog = state.program;

  const loadingState = prog.isError
    ? 'error'
    : prog.isFetching || !state.program.program
    ? 'loading'
    : 'ready';

  return {
    loadingState,
    program: prog.program,
  };
};

export const selectHomeChannels = (state: RootState): HomeChannels => {
  return state.articles.channels;
};

export const selectArticleBookmarked = (articleId: string | number) => (state: RootState) => {
  const {savedArticles} = state.articleStorage;
  return Boolean(savedArticles && savedArticles.find((article: SavedArticle) => article.id === articleId));
};

export const selectDrawerData = (state: RootState) => {
  const {navigation} = state;
  const {projects} = navigation;
  return {
    routes: navigation.routes,
    pages: navigation.pages,
    webPageProjects: projects,
    channels: state.articles.channels.items,
  };
};

export const selectSettings = (state: RootState) => {
  const {config} = state;

  return {
    isDarkMode: config.isDarkMode,
    imageMaxScaleFactor: config.imageMaxScaleFactor,
    textSizeMultiplier: config.textSizeMultiplier,
  };
};

export const selectForecastLocation = (state: RootState) => {
  return state.config.forecastLocation;
};

export const selectDailyQuestion = (state: RootState) => {
  return state.articles.daily_question;
};

export const selectDailyQuestionChoice = (state: RootState) => {
  return state.config.daily_question_response;
};
