import {HomePageType} from '../../Types';
import {
  ROUTE_TYPE_TYPE_CATEGORY,
  ROUTE_TYPE_TYPE_MEDIA,
  ROUTE_TYPE_TYPE_NEWEST,
  ROUTE_TYPE_TYPE_POPULAR,
} from '../api/Types';
import {formatArticles} from '../util/articleFormatters';
import {RootState} from './reducers';

export const selectNavigationIsReady = (state: RootState) => {
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
      if (r.type === ROUTE_TYPE_TYPE_CATEGORY) {
        return {type: r.type, key: r.name, title: r.name, categoryId: r.id};
      } else {
        return {type: r.type, key: r.name, title: r.name};
      }
    }),
  };
};

export const selectNewestArticlesScreenState = (state: RootState) => {
  const {newest} = state.articles;
  const newestRoute = state.navigation.routes.find((r) => r.type === ROUTE_TYPE_TYPE_NEWEST);
  return {
    ...newest,
    title: newestRoute?.name,
  };
};

export const selectPopularArticlesScreenState = (state: RootState) => {
  const {popular} = state.articles;
  const popularRoute = state.navigation.routes.find((r) => r.type === ROUTE_TYPE_TYPE_POPULAR);
  return {
    ...popular,
    title: popularRoute?.name,
  };
};

export const selectCategoryScreenState = (categoryId: number) => (state: any) => {
  const category = state.articles.categories.find((val: any) => {
    return val.id === categoryId;
  });

  return {
    category,
  };
};

export const selectHomeScreenState = (type: HomePageType) => (state: any) => {
  const block = type === ROUTE_TYPE_TYPE_MEDIA ? state.articles.mediateka : state.articles.home;

  const mapSections = (items: any[]) => {
    return items.map((b, i) => {
      return {
        index: i,
        category: b.category,
        data: b.items,
      };
    });
  };

  return {
    refreshing: block.isFetching && block.items.length !== 0,
    lastFetchTime: block.lastFetchTime,
    sections: mapSections(block.items),
  };
};

export const selectAudiotekaScreenState = (state: any) => {
  const {isFetching, lastFetchTime, data} = state.articles.audioteka;
  return {isFetching, lastFetchTime, data};
};

export const selectBookmarksScreenState = (state: any) => {
  const {savedArticles} = state.articleStorage;
  return {articles: formatArticles(-1, savedArticles, false)};
};

export const selectHistoryScreenState = (state: any) => {
  const {history} = state.articleStorage;
  return {articles: formatArticles(-1, history, false)};
};

export const selectProgramScreenState = (state: any) => {
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

export const selectTVProgram = (state: any) => {
  return {
    tvProgram: state.articles.tvprog,
  };
};

export const selectArticleBookmarked = (articleId: string | number) => (state: any) => {
  const {savedArticles} = state.articleStorage;
  return savedArticles && savedArticles.find((a: any) => a.id === articleId) !== undefined;
};

export const selectDrawerData = (state: RootState) => {
  const {navigation} = state;
  const {projects} = navigation;
  return {
    routes: navigation.routes,
    pages: navigation.pages,
    projects: projects && projects.length > 0 ? projects[0] : undefined,
    channels: state.articles.tvprog.items,
  };
};

export const selectSearchFilter = (state: RootState) => {
  return state.navigation.filter;
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
