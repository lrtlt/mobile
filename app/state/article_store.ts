import {create} from 'zustand';
import {produce} from 'immer';
import {Article} from '../../Types';
import {
  AudiotekaResponse,
  HomeBlockChannels,
  HomeBlockType,
  LiveChannel,
  MediatekaBlockType,
  RadiotekaResponse,
  TVChannel,
} from '../api/Types';
import {
  fetchAudiotekaApi,
  fetchCategoryApi,
  fetchCategoryHome,
  fetchHomeApi,
  fetchMediatekaApi,
  fetchMediatekaApiV2,
  fetchNewestApi,
  fetchPopularApi,
  fetchRadiotekaApi,
} from '../api';

import {formatArticles} from '../util/articleFormatters';

type BaseBlockState = {
  isFetching: boolean;
  isError: boolean;
  lastFetchTime: number;
  isRefreshing?: boolean;
};

type HomeState = {
  items: HomeBlockType[];
} & BaseBlockState;

type MediatekaState = {
  items: MediatekaBlockType[];
} & BaseBlockState;

type CategoryHomeState = {
  id: number;
} & HomeState;

type AudiotekaState = {
  data: AudiotekaResponse;
} & BaseBlockState;

type RadiotekaState = {
  data: RadiotekaResponse;
} & BaseBlockState;

export type PagingState = {
  title: string;
  articles: Article[][];
  lastArticle?: Article;
  page: number;
} & BaseBlockState;

export type CategoryState = {
  nextPage: number;
  id: number;
} & PagingState;

export type Category = {
  id?: number;
  name: string;
  template_id: number;
  is_slug_block?: 0 | 1;
  slug_url?: string;
};

type ChannelState = {
  channels: TVChannel[];
  liveChannels?: LiveChannel[];
  tempLiveChannels?: LiveChannel[];
};

export type ArticleState = {
  home: HomeState;
  mediateka: HomeState;
  mediatekaV2: MediatekaState;
  audioteka: AudiotekaState;
  radioteka: RadiotekaState;
  advancedCategories: {[key: number]: CategoryHomeState};
  categories: {[key: number]: CategoryState};

  newest: PagingState;
  popular: PagingState;
  channels: ChannelState;
};

type ArticleActions = {
  fetchHome: () => void;
  fetchMediateka: () => void;
  fetchMediatekaV2: () => void;
  fetchAudioteka: () => void;
  fetchRadioteka: () => void;
  fetchPopular: (page: number, count: number, withOverride?: boolean) => void;
  fetchNewest: (
    page: number,
    count: number,
    date_max?: string,
    not_id?: string,
    withOverride?: boolean,
  ) => void;
  fetchCategory: (
    categoryId: number,
    page: number,
    count: number,
    date_max?: string,
    not_id?: string,
    withOverride?: boolean,
  ) => void;
  fetchCategoryHome: (categoryId: number, withOverride?: boolean) => void;
};

type ArticleStore = ArticleState & ArticleActions;

const initialState: ArticleState = {
  home: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    items: [],
  },
  mediateka: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    items: [],
  },
  mediatekaV2: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    items: [],
  },
  audioteka: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    data: [],
  },
  radioteka: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    data: [],
  },
  advancedCategories: {},
  newest: {
    title: '',
    isFetching: false,
    isError: false,
    isRefreshing: false,
    lastFetchTime: 0,
    articles: [],
    page: 0,
  },
  popular: {
    title: '',
    isFetching: false,
    isError: false,
    isRefreshing: false,
    lastFetchTime: 0,
    articles: [],
    page: 0,
  },
  categories: {},
  channels: {
    channels: [],
    liveChannels: [],
    tempLiveChannels: [],
  },
};

export const initialCategoryState: CategoryState = {
  id: -1,
  title: '-',
  articles: [],
  isFetching: false,
  isRefreshing: false,
  isError: false,
  lastFetchTime: 0,
  lastArticle: undefined,
  page: 0,
  nextPage: 1,
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  ...initialState,
  fetchHome: async () => {
    set(
      produce((state: ArticleState) => {
        state.home.isFetching = true;
        state.home.isError = false;
      }),
    );
    try {
      const data = await fetchHomeApi();
      const homeState = {
        items: data.homepage_data,
        isFetching: false,
        isError: false,
        lastFetchTime: Date.now(),
      };
      set({
        home: homeState,
        channels: _parseChannels(homeState),
      });
    } catch (e) {
      console.log('Fetch home error', e);
      set(
        produce((state: ArticleState) => {
          state.home.isFetching = false;
          state.home.isError = true;
        }),
      );
    }
  },
  fetchMediateka: async () => {
    set(
      produce((state: ArticleState) => {
        state.mediateka.isFetching = true;
        state.mediateka.isError = false;
      }),
    );
    try {
      const data = await fetchMediatekaApi();
      set({
        mediateka: {
          items: data,
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch mediateka error', e);
      set(
        produce((state: ArticleState) => {
          state.mediateka.isFetching = false;
          state.mediateka.isError = true;
        }),
      );
    }
  },
  fetchMediatekaV2: async () => {
    set(
      produce((state: ArticleState) => {
        state.mediatekaV2.isFetching = true;
        state.mediatekaV2.isError = false;
      }),
    );
    try {
      const data = await fetchMediatekaApiV2();
      set({
        mediatekaV2: {
          items: data.homeblocks,
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch mediateka error', e);
      set(
        produce((state: ArticleState) => {
          state.mediatekaV2.isFetching = false;
          state.mediatekaV2.isError = true;
        }),
      );
    }
  },
  fetchAudioteka: async () => {
    set(
      produce((state: ArticleState) => {
        state.audioteka.isFetching = true;
        state.audioteka.isError = false;
      }),
    );
    try {
      const data = await fetchAudiotekaApi();
      set({
        audioteka: {
          data,
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch audioteka error', e);
      set(
        produce((state: ArticleState) => {
          state.audioteka.isFetching = false;
          state.audioteka.isError = true;
        }),
      );
    }
  },
  fetchRadioteka: async () => {
    set(
      produce((state: ArticleState) => {
        state.radioteka.isFetching = true;
        state.radioteka.isError = false;
      }),
    );
    try {
      const data = await fetchRadiotekaApi();
      set({
        radioteka: {
          data,
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch radioteka error', e);
      set(
        produce((state: ArticleState) => {
          state.radioteka.isFetching = false;
          state.radioteka.isError = true;
        }),
      );
    }
  },
  fetchPopular: async (page: number, count: number, withOverride?: boolean) => {
    set(
      produce((state: ArticleState) => {
        state.popular.isFetching = true;
        state.popular.isError = false;
        state.popular.isRefreshing = withOverride ?? initialCategoryState.isRefreshing;
      }),
    );
    try {
      const data = await fetchPopularApi(page, count);
      const formattedArticles = formatArticles(-1, data.articles, false);
      const articles = withOverride ? formattedArticles : get().popular.articles.concat(formattedArticles);
      set({
        popular: {
          title: 'Populiariausi',
          isFetching: false,
          isError: false,
          lastArticle: data?.articles[data.articles.length - 1],
          isRefreshing: false,
          articles,
          page: page,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch popular error', e);
      set(
        produce((state: ArticleState) => {
          state.popular.isFetching = false;
          state.popular.isError = true;
        }),
      );
    }
  },
  fetchNewest: async (
    page: number,
    count: number,
    date_max?: string,
    not_id?: string,
    withOverride?: boolean,
  ) => {
    set(
      produce((state: ArticleState) => {
        state.newest.isFetching = true;
        state.newest.isError = false;
        state.newest.isRefreshing = withOverride ?? initialCategoryState.isRefreshing;
      }),
    );
    try {
      const data = await fetchNewestApi(page, count, date_max, not_id);
      const formattedArticles = formatArticles(-1, data.articles, false);
      const articles = withOverride ? formattedArticles : get().newest.articles.concat(formattedArticles);
      set({
        newest: {
          title: 'Naujausi',
          isFetching: false,
          isError: false,
          lastArticle: data?.articles[data.articles.length - 1],
          isRefreshing: false,
          articles,
          page: page,
          lastFetchTime: Date.now(),
        },
      });
    } catch (e) {
      console.log('Fetch newest error', e);
      set(
        produce((state: ArticleState) => {
          state.newest.isFetching = false;
          state.newest.isError = true;
        }),
      );
    }
  },
  fetchCategory: async (
    categoryId: number,
    page: number,
    count: number,
    date_max?: string,
    not_id?: string,
    withOverride?: boolean,
  ) => {
    set(
      produce((state: ArticleState) => {
        state.categories[categoryId] = {
          ...(state.categories[categoryId] ?? initialCategoryState),
          isFetching: true,
          isError: false,
          isRefreshing: withOverride ?? initialCategoryState.isRefreshing,
        };
      }),
    );

    try {
      const data = await fetchCategoryApi(categoryId, page, count, date_max, not_id);
      const formattedArticles = formatArticles(-1, data.articles, false);

      const categoryArticles: Article[][] = get().categories[categoryId]?.articles ?? [];
      const newCategoryarticles = withOverride
        ? formattedArticles
        : categoryArticles.concat(formattedArticles);

      set(
        produce((state: ArticleState) => {
          state.categories[categoryId] = {
            id: categoryId,
            title: data.category_info.category_title,
            isFetching: false,
            isError: false,
            nextPage: data.next_page,
            lastArticle: data?.articles[data.articles.length - 1],
            isRefreshing: false,
            articles: newCategoryarticles,
            page,
            lastFetchTime: Date.now(),
          };
        }),
      );
    } catch (e) {
      console.log('Fetch category error', e);
      set(
        produce((state: ArticleState) => {
          state.categories[categoryId] = {
            isFetching: false,
            isError: true,
            isRefreshing: false,
          } as any;
        }),
      );
    }
  },
  fetchCategoryHome: async (categoryId: number, withOverride?: boolean) => {
    set(
      produce((state: ArticleState) => {
        state.advancedCategories[categoryId] = {
          id: categoryId,
          items: state.advancedCategories[categoryId]?.items ?? [],
          lastFetchTime: state.advancedCategories[categoryId]?.lastFetchTime ?? 0,
          isFetching: true,
          isError: false,
          isRefreshing: withOverride ?? initialCategoryState.isRefreshing,
        };
      }),
    );
    try {
      const data = await fetchCategoryHome(categoryId);
      set(
        produce((state: ArticleState) => {
          state.advancedCategories[categoryId] = {
            id: categoryId,
            // title: data.category_info.category_title,
            items: data.homepage_data,
            isFetching: false,
            isError: false,
            isRefreshing: false,
            lastFetchTime: Date.now(),
          };
        }),
      );
    } catch (e) {
      console.log('Fetch category home error', e);
      set(
        produce((state: ArticleState) => {
          state.advancedCategories[categoryId] = {
            id: categoryId,
            isFetching: false,
            isError: true,
            isRefreshing: false,
          } as any;
        }),
      );
    }
  },
}));

const _parseChannels = (state: HomeState): ChannelState => {
  const block = state.items.find((i) => i.type === 'channels') as HomeBlockChannels;
  if (!block) {
    return {
      channels: [],
      liveChannels: [],
      tempLiveChannels: [],
    };
  } else {
    return {
      channels: block.data.items,
      liveChannels: block.data.live_items?.filter((c) => !c.web_permanent),
      tempLiveChannels: block.data.live_items?.filter((c) => Boolean(c.web_permanent)),
    };
  }
};
