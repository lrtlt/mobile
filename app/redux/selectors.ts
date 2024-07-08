import {HomePageType} from '../../Types';
import {HomeBlockChannels, ROUTE_TYPE_CATEGORY, ROUTE_TYPE_MEDIA} from '../api/Types';
import {RootState} from './reducers';
import {SavedArticle} from './reducers/articleStorage';
import {memoize} from 'proxy-memoize';
import {CategoryState} from './reducers/articles';

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

export const selectMainScreenState = memoize((state: RootState) => {
  const {navigation} = state;
  return {
    routes: navigation.routes.map((r) => {
      if (r.type === ROUTE_TYPE_CATEGORY) {
        return {type: r.type, key: r.name, title: r.name, categoryId: r.id, categoryUrl: r.url};
      } else {
        return {type: r.type, key: r.name, title: r.name};
      }
    }),
  };
});

export const selectNewestArticlesScreenState = (state: RootState) => state.articles.newest;

export const selectPopularArticlesScreenState = (state: RootState) => state.articles.popular;

export const selectCategoryScreenState = (categoryId: number, categoryTitle?: string) =>
  memoize((state: RootState) => {
    const categoryState: CategoryState = state.articles.categories.find(
      (category) => category.id === categoryId,
    ) ?? {
      id: categoryId,
      title: categoryTitle ?? '-',
      articles: [],
      isFetching: false,
      lastArticle: undefined,
      isRefreshing: false,
      isError: false,
      lastFetchTime: 0,
      page: 0,
      nextPage: 1,
    };

    return categoryState;
  });

export const selectHomeScreenState = (type: HomePageType) =>
  memoize((state: RootState) => {
    const block = type === ROUTE_TYPE_MEDIA ? state.articles.mediateka : state.articles.home;

    return {
      refreshing: block.isFetching && block.items.length > 0,
      lastFetchTime: block.lastFetchTime,
      items: block.items,
    };
  });

export const selectAudiotekaScreenState = memoize((state: RootState) => {
  const block = state.articles.audioteka;
  return {
    refreshing: block.isFetching && block.data.length > 0,
    lastFetchTime: block.lastFetchTime,
    data: block.data,
  };
});

export const selectBookmarkedArticles = (state: RootState) => state.articleStorage.savedArticles;

export const selectHistoryArticles = (state: RootState) => state.articleStorage.history;

export const selectProgramScreenState = memoize((state: RootState) => {
  const prog = state.program;

  const loadingState = prog.isError
    ? 'error'
    : prog.isFetching || !state.program.program
    ? 'loading'
    : 'ready';

  return {
    loadingState,
    program: prog.program,
    lastFetchTime: prog.lastFetchTime,
  };
});

export const selectHomeChannels = memoize((state: RootState) => {
  const channelsBlock = state.articles.home.items.find((i) => i.type === 'channels') as HomeBlockChannels;

  if (!channelsBlock) {
    return {
      channels: [],
      liveChannels: [],
      tempLiveChannels: [],
    };
  }
  return {
    channels: channelsBlock.data.items,
    liveChannels: channelsBlock.data.live_items?.filter((c) => !c.web_permanent),
    tempLiveChannels: channelsBlock.data.live_items?.filter((c) => Boolean(c.web_permanent)),
  };
});

export const selectArticleBookmarked = (articleId: string | number) => (state: RootState) => {
  const {savedArticles} = state.articleStorage;
  return Boolean(savedArticles && savedArticles.find((article: SavedArticle) => article.id === articleId));
};

export const selectDrawerData = memoize((state: RootState) => {
  const {navigation} = state;
  const {projects} = navigation;
  return {
    routes: navigation.routes,
    channels: navigation.channels,
    pages: navigation.pages,
    webPageProjects: projects,
  };
});

export const selectLogo = (state: RootState) => state.config.logo;

export const selectSettings = memoize((state: RootState) => {
  const {config} = state;

  return {
    isDarkMode: config.isDarkMode,
    isContinuousPlayEnabled: config.isContinuousPlayEnabled ?? true,
    textSizeMultiplier: config.textSizeMultiplier,
  };
});

export const selectForecastLocation = (state: RootState) => {
  return state.config.forecastLocation;
};

export const selectDailyQuestionChoice = (state: RootState) => {
  return state.config.daily_question_response;
};
