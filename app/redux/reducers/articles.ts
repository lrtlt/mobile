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
} from '../actions/actionTypes';

import {formatArticles as formatArticleBlock} from '../../util/articleFormatters';
import {AudiotekaResponse, HomeBlockType} from '../../api/Types';
import {Article} from '../../../Types';
import {ArticlesActionType} from '../actions';

type BaseBlockState = {
  isFetching: boolean;
  isError: boolean;
  lastFetchTime: number;
  isRefreshing?: boolean;
};

type HomeState = {
  items: HomeBlockType[];
} & BaseBlockState;

type AudiotekaState = {
  data: AudiotekaResponse;
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

export type ArticlesState = {
  home: HomeState;
  mediateka: HomeState;
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
      const homeItems = action.data.homepage_data;
      console.log('HOME ITEMS', homeItems);

      return {
        ...state,
        home: {
          isError: false,
          isFetching: false,
          lastFetchTime: Date.now(),
          items: homeItems,
        },
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
      const mediatekaItems = action.data;
      return {
        ...state,
        mediateka: {
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
          items: mediatekaItems,
        },
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
      const articles = formatArticleBlock(-1, data.articles, false);

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
        lastArticle: data.articles?.length ? data.articles[data.articles.length - 1] : undefined,
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
          lastArticle: action.data?.articles[action.data.articles.length - 1],
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
          lastArticle: action.data?.articles[action.data.articles.length - 1],
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

export default reducer;
