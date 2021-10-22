import {
  FETCH_HOME,
  FETCH_CATEGORY,
  API_HOME_RESULT,
  API_HOME_ERROR,
  API_CATEGORY_ERROR,
  API_CATEGORY_RESULT,
  REFRESH_CATEGORY,
  API_NEWEST_ERROR,
  API_NEWEST_RESULT,
  FETCH_NEWEST,
  REFRESH_NEWEST,
  API_POPULAR_ERROR,
  API_POPULAR_RESULT,
  FETCH_POPULAR,
  REFRESH_POPULAR,
  FETCH_MEDIATEKA,
  API_MEDIATEKA_RESULT,
  API_MEDIATEKA_ERROR,
  FETCH_AUDIOTEKA,
  API_AUDIOTEKA_RESULT,
  API_AUDIOTEKA_ERROR,
  API_DAILY_QUESTION_RESULT,
} from '../actions/actionTypes';

import {
  LIST_DATA_TYPE_ARTICLES,
  LIST_DATA_TYPE_CHANNELS,
  LIST_DATA_TYPE_ARTICLES_FEED,
  LIST_DATA_TYPE_MORE_FOOTER,
  LIST_DATA_TYPE_BANNER,
  LIST_DATA_TYPE_DAILY_QUESTION,
} from '../../constants';

import {formatArticles as formatArticleBlock} from '../../util/articleFormatters';
import {
  AudiotekaResponse,
  DailyQuestionResponse,
  HomeArticlesBlock,
  HomeBannerBlock,
  HomeChannels,
  HomeDataResponse,
} from '../../api/Types';
import {Article} from '../../../Types';
import {ArticlesActionType} from '../actions';

type BaseBlockState = {
  isFetching: boolean;
  isError: boolean;
  lastFetchTime: number;
  isRefreshing?: boolean;
};

type HomeState = {
  items: HomeBlock[];
} & BaseBlockState;

type AudiotekaState = {
  data: AudiotekaResponse;
} & BaseBlockState;

export type PagingState = {
  title: string;
  articles: Article[][];
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

export type HomeBlock = {
  category: Category;
  items: HomeListItem[];
};

type HomeListItemArticles = {
  type: typeof LIST_DATA_TYPE_ARTICLES;
  data: Article[];
};

type HomeListItemChannels = {
  type: typeof LIST_DATA_TYPE_CHANNELS;
};

type HomeListItemFeed = {
  type: typeof LIST_DATA_TYPE_ARTICLES_FEED;
  data: Article[];
};

type HomeListItemMoreButton = {
  type: typeof LIST_DATA_TYPE_MORE_FOOTER;
  data: Category;
};

type HomeListItemBanner = {
  type: typeof LIST_DATA_TYPE_BANNER;
  data: HomeBannerBlock;
};

type HomeListItemDailyQuestion = {
  type: typeof LIST_DATA_TYPE_DAILY_QUESTION;
};

type HomeListItem =
  | HomeListItemArticles
  | HomeListItemChannels
  | HomeListItemFeed
  | HomeListItemMoreButton
  | HomeListItemBanner
  | HomeListItemDailyQuestion;

export type ArticlesState = {
  home: HomeState;
  mediateka: HomeState;
  channels: HomeChannels;
  daily_question?: DailyQuestionResponse;
  audioteka: AudiotekaState;
  categories: CategoryState[];
  newest: PagingState;
  popular: PagingState;
};

const initialState: ArticlesState = {
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
  audioteka: {
    isFetching: false,
    isError: false,
    lastFetchTime: 0,
    data: [],
  },
  categories: [],
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
  channels: {
    items: [],
    live_items: [],
  },
};

const reducer = (state = initialState, action: ArticlesActionType): ArticlesState => {
  switch (action.type) {
    case FETCH_HOME:
      return {
        ...state,
        home: {
          ...state.home,
          isError: false,
          isFetching: true,
        },
      };
    case FETCH_CATEGORY: {
      const {categoryId} = action.payload;
      const newCategories = state.categories.map((c) => {
        return c.id === categoryId ? {...c, isFetching: true, isError: false} : c;
      });
      return {
        ...state,
        categories: newCategories,
      };
    }
    case REFRESH_CATEGORY: {
      const {categoryId} = action.payload;
      const newCategories = state.categories.map((c) => {
        return c.id === categoryId ? {...c, isFetching: true, isRefreshing: true} : c;
      });
      return {
        ...state,
        categories: newCategories,
      };
    }
    case FETCH_NEWEST: {
      return {
        ...state,
        newest: {...state.newest, isFetching: true},
      };
    }
    case REFRESH_NEWEST: {
      return {
        ...state,
        newest: {...state.newest, isFetching: true, isRefreshing: true},
      };
    }
    case API_NEWEST_ERROR: {
      return {
        ...state,
        newest: {
          ...state.newest,
          isFetching: false,
          isError: true,
          isRefreshing: false,
        },
      };
    }
    case FETCH_POPULAR: {
      return {
        ...state,
        popular: {...state.popular, isFetching: true},
      };
    }
    case REFRESH_POPULAR: {
      return {
        ...state,
        popular: {...state.popular, isFetching: true, isRefreshing: true},
      };
    }
    case API_POPULAR_ERROR: {
      return {
        ...state,
        popular: {
          ...state.popular,
          isFetching: false,
          isError: true,
          isRefreshing: false,
        },
      };
    }
    case API_HOME_ERROR: {
      return {
        ...state,
        home: {
          ...state.home,
          isError: true,
          isFetching: false,
        },
      };
    }
    case API_CATEGORY_ERROR: {
      const {categoryId} = action;
      const newCategories = state.categories.map((c) => {
        return c.id === categoryId ? {...c, isFetching: false, isRefreshing: false, isError: true} : c;
      });
      return {
        ...state,
        categories: newCategories,
      };
    }
    case API_HOME_RESULT: {
      const articleBlocks = parseHomeArticles(action.data);
      const homeItems = prepareHomeScreenData(articleBlocks);
      insertChannelsItem(homeItems);
      insertMoreFooters(homeItems);
      insertBannerBlocks(homeItems, parseHomeBanners(action.data));
      insertDailyQuestionItem(homeItems);

      console.log('HOME ITEMS', homeItems);

      const home = {
        ...state.home,
        isError: false,
        isFetching: false,
        lastFetchTime: Date.now(),
        items: homeItems,
      };

      return {
        ...state,
        home,
        channels: action.data.tvprog,
      };
    }
    case FETCH_MEDIATEKA: {
      return {
        ...state,
        mediateka: {
          ...state.mediateka,
          isError: false,
          isFetching: true,
        },
      };
    }
    case API_MEDIATEKA_RESULT: {
      const articleBlocks = parseHomeArticles(action.data);
      const mediatekaItems = prepareHomeScreenData(articleBlocks);
      insertChannelsItem(mediatekaItems);

      return {
        ...state,
        mediateka: {
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
          items: mediatekaItems,
        },
        channels: action.data.tvprog,
      };
    }
    case API_DAILY_QUESTION_RESULT: {
      return {
        ...state,
        daily_question: action.data,
      };
    }
    case API_MEDIATEKA_ERROR: {
      return {
        ...state,
        mediateka: {
          ...state.mediateka,
          isError: true,
          isFetching: false,
        },
      };
    }
    case FETCH_AUDIOTEKA: {
      return {
        ...state,
        audioteka: {
          ...state.audioteka,
          lastFetchTime: Date.now(),
          isError: false,
          isFetching: true,
        },
      };
    }
    case API_AUDIOTEKA_RESULT: {
      return {
        ...state,
        audioteka: {
          lastFetchTime: Date.now(),
          isRefreshing: false,
          isError: false,
          isFetching: false,
          data: action.data,
        },
      };
    }
    case API_AUDIOTEKA_ERROR: {
      return {
        ...state,
        audioteka: {
          ...state.audioteka,
          isError: true,
          isFetching: false,
        },
      };
    }
    case API_CATEGORY_RESULT: {
      const {data} = action;
      const {category_id, category_title} = data.category_info;
      const articles = formatArticleBlock(-1, action.data.articles);

      const savedCategory = state.categories.find((c) => c.id === category_id);

      const articlesList =
        data.refresh === true ? articles : savedCategory ? savedCategory.articles.concat(articles) : articles;

      const category = {
        isFetching: false,
        isError: false,
        isRefreshing: false,
        page: data.page,
        nextPage: data.next_page,
        articles: articlesList,
        lastFetchTime: Date.now(),
        id: savedCategory?.id ?? category_id,
        title: savedCategory?.title ?? category_title,
      };

      const restCategories = state.categories.filter((c) => c.id !== category_id);

      return {
        ...state,
        categories: [category, ...restCategories],
      };
    }
    case API_NEWEST_RESULT: {
      const formattedArticles = formatArticleBlock(-1, action.data.articles);
      const articles =
        action.data.refresh === true ? formattedArticles : state.newest.articles.concat(formattedArticles);

      const page = action.data.refresh === true ? 1 : state.newest.page + 1;

      return {
        ...state,
        newest: {
          title: 'Naujausi',
          isFetching: false,
          isError: false,
          isRefreshing: false,
          articles,
          page,
          lastFetchTime: Date.now(),
        },
      };
    }
    case API_POPULAR_RESULT: {
      const formattedArticles = formatArticleBlock(-1, action.data.articles);

      const articles =
        action.data.refresh === true ? formattedArticles : state.popular.articles.concat(formattedArticles);

      const page = action.data.refresh === true ? 1 : state.popular.page + 1;

      return {
        ...state,
        popular: {
          title: 'Populiariausi',
          isFetching: false,
          isError: false,
          isRefreshing: false,
          articles,
          page,
          lastFetchTime: Date.now(),
        },
      };
    }

    default:
      return state;
  }
};

const prepareHomeScreenData = (blocks: {category: Category; items: Article[][]}[]): HomeBlock[] => {
  return blocks.map((block) => {
    const type = block.category.template_id === 999 ? LIST_DATA_TYPE_ARTICLES_FEED : LIST_DATA_TYPE_ARTICLES;
    return {
      ...block,
      items: block.items.map((articlesRow) => ({
        type: type,
        data: articlesRow,
      })),
    };
  });
};

const insertDailyQuestionItem = (homeBlocks: HomeBlock[]) => {
  const item: HomeListItemDailyQuestion = {type: LIST_DATA_TYPE_DAILY_QUESTION};
  homeBlocks[0].items.push(item);
};

const insertChannelsItem = (homeBlocks: HomeBlock[]) => {
  const item: HomeListItemChannels = {type: LIST_DATA_TYPE_CHANNELS};
  homeBlocks[0].items.splice(1, 0, item);
};

const insertBannerBlocks = (homeBlocks: HomeBlock[], banners: HomeBannerBlock[]) => {
  const items: HomeListItemBanner[] = banners.map((b) => {
    return {type: LIST_DATA_TYPE_BANNER, data: b};
  });

  if (items.length > 0) {
    if (items.length === 1) {
      homeBlocks[0].items.push(...items);
    } else {
      homeBlocks[0].items.push(items[0]);
      const rest = items.splice(1, items.length);
      homeBlocks[1].items.push(...rest);
    }
  }
};

const insertMoreFooters = (homeBlocks: HomeBlock[]) => {
  homeBlocks.forEach((block) => {
    if (block.category.id === 0 || block.category.is_slug_block) {
      //Skip tops && slug blocks;
      return;
    }

    block.items.push({
      type: LIST_DATA_TYPE_MORE_FOOTER,
      data: block.category,
    });
  });
};

//Parses article blocks and top article block into single array.
const parseHomeArticles = (apiResponse: HomeDataResponse) => {
  const homeCategories: {
    category: Category;
    items: Article[][];
  }[] = [
    {
      category: {
        id: 0,
        name: 'Pagrindinis',
        template_id: 0,
      },
      items: formatArticleBlock(0, apiResponse.articles),
    },
  ];

  const isArticleBLock = (block: HomeArticlesBlock | HomeBannerBlock): block is HomeArticlesBlock => {
    const _block = block as HomeArticlesBlock;
    return _block.articles_list && _block.articles_list.length > 0;
  };

  apiResponse.articles_blocks.filter(isArticleBLock).forEach((block) => {
    const articles = block.articles_list;
    if (articles && articles.length > 0) {
      homeCategories.push({
        category: {
          id: block.category_id,
          name: (block.category_title || block.slug_title || block.block_title)!,
          template_id: block.template_id,
          is_slug_block: block.is_slug_block,
          slug_url: block.slug_url,
        },
        items: formatArticleBlock(block.template_id, articles),
      });
    }
  });
  return homeCategories;
};

//Filters banner block from home response.
const parseHomeBanners = (apiResponse: HomeDataResponse) => {
  const isBannerBLock = (block: HomeArticlesBlock | HomeBannerBlock): block is HomeBannerBlock => {
    const _block = block as HomeBannerBlock;
    return Boolean(_block.html_embed);
  };

  return apiResponse.articles_blocks.filter(isBannerBLock);
};

export default reducer;
