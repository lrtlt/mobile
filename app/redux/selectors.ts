import {HomePageType} from '../../Types';
import {HomeBlockChannels, ROUTE_TYPE_MEDIA} from '../api/Types';
import {RootState} from './reducers';
import {memoize} from 'proxy-memoize';
import {CategoryState} from './reducers/articles';

export const selectAppIsReady = (state: RootState) => {
  return state.articles.home.items.length > 0;
};

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
