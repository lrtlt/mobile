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
  API_MENU_ITEMS_RESULT,
  FETCH_MEDIATEKA,
  API_MEDIATEKA_RESULT,
  API_MEDIATEKA_ERROR,
  FETCH_AUDIOTEKA,
  API_AUDIOTEKA_RESULT,
  API_AUDIOTEKA_ERROR,
} from '../actions/actionTypes';

import {
  LIST_DATA_TYPE_ARTICLES,
  LIST_DATA_TYPE_TVPROG,
  LIST_DATA_TYPE_ARTICLES_FEED,
  LIST_DATA_TYPE_MORE_FOOTER,
} from '../../constants';

import {formatArticles as formatArticleBlock} from '../../util/articleFormatters';
import {ROUTE_TYPE_TYPE_CATEGORY} from '../../api/Types';

const initialNewestBlockState = {
  isFetching: false,
  isError: false,
  isRefreshing: false,
  lastFetchTime: 0,
  articles: [],
  page: 0,
};

const initialHomeBlockState = {
  isFetching: false,
  isError: false,
  lastFetchTime: 0,
  items: [],
};

const initialMediatekaBlockState = initialHomeBlockState;

const initialAudiotekaBlockState = {
  isFetching: false,
  isError: false,
  lastFetchTime: 0,
  data: {
    articles: [],
    articles_blocks: [],
    new_articles: {
      by_channel: [],
      all_articles: [],
    },
    popular_articles: [],
  },
};

const initialState = {
  homeItems: [],
  home: initialHomeBlockState,
  lastHomeDataFetchTime: 0,
  mediateka: initialMediatekaBlockState,
  audioteka: initialAudiotekaBlockState,
  categories: [],
  newest: initialNewestBlockState,
  popular: initialNewestBlockState,
};

const reducer = (state = initialState, action) => {
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
    case API_MENU_ITEMS_RESULT:
      return {
        ...state,
        categories: parseCategoriesFromMenu(action.data),
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
      const {categoryId} = action.payload;
      const newCategories = state.categories.map((c) => {
        return c.id === categoryId ? {...c, isFetching: false, isRefreshing: false, isError: true} : c;
      });
      return {
        ...state,
        categories: newCategories,
      };
    }
    case API_HOME_RESULT: {
      const articleBlocks = parseArticles(action.data);
      const formattedArticleBlocks = formatArticles(articleBlocks);
      const homeItems = prepareHomeScreenData(formattedArticleBlocks);
      insertTvProg(action.data, homeItems);
      insertMoreFooters(homeItems);

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
        tvprog: action.data.tvprog,
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
      const articleBlocks = parseArticles(action.data);
      const formattedArticleBlocks = formatArticles(articleBlocks);
      const mediatekaItems = prepareHomeScreenData(formattedArticleBlocks);
      insertTvProg(action.data, mediatekaItems);

      return {
        ...state,
        mediateka: {
          isFetching: false,
          isError: false,
          lastFetchTime: Date.now(),
          items: mediatekaItems,
        },
        tvprog: action.data.tvprog,
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
          data: action.data,
          isError: false,
          isFetching: false,
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
      const {category_id} = action.data.category_info;
      const articles = formatArticleBlock(-1, action.data.articles);

      //Reset page to 1 if it's after refresh
      const page = action.data.page;
      const nextPage = action.data.next_page;

      const newCategories = state.categories.map((c) => {
        if (c.id === category_id) {
          const articlesList = action.data.refresh === true ? articles : c.articles.concat(articles);

          return {
            isFetching: false,
            isError: false,
            isRefreshing: false,
            page,
            nextPage,
            articles: articlesList,
            lastFetchTime: Date.now(),
            id: c.id,
            title: c.title,
          };
        } else {
          return c;
        }
      });

      return {
        ...state,
        categories: newCategories,
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

//Returns formatted articles for home screen based on template_id's.
const formatArticles = (articleBlocks) => {
  return articleBlocks.map((block) => ({
    ...block,
    items: formatArticleBlock(block.category.template_id, block.items),
  }));
};

//Wraps article data into wrapper object with type:TYPE_ARTICLES or
const prepareHomeScreenData = (articleBlocks) => {
  return articleBlocks.map((block) => {
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

const insertTvProg = (apiResponse, homeItems) => {
  const tvProg = {type: LIST_DATA_TYPE_TVPROG, data: apiResponse.tvprog};
  homeItems[0].items.splice(1, 0, tvProg);
};

const insertMoreFooters = (homeItems) => {
  homeItems.forEach((block) => {
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

const parseCategoriesFromMenu = (apiResponse) => {
  const categories = [];

  const categoryMenuItems = apiResponse.main_menu.filter((menuItem) => {
    return menuItem.type === ROUTE_TYPE_TYPE_CATEGORY;
  });

  categoryMenuItems.forEach((item) => {
    categories.push({
      isFetching: false,
      isError: false,
      isRefreshing: false,
      lastFetchTime: 0,
      articles: [],
      page: 0,
      nextPage: 1,
      id: item.id,
      title: item.name,
    });
  });

  const pageMenuItems = apiResponse.main_menu.filter((menuItem) => {
    return menuItem.type === 'page';
  });

  pageMenuItems.forEach((page) => {
    page.categories.forEach((category) => {
      categories.push({
        isFetching: false,
        isError: false,
        isRefreshing: false,
        lastFetchTime: 0,
        articles: [],
        page: 0,
        nextPage: 1,
        id: category.id,
        title: category.name,
      });
    });
  });

  return categories;
};

//Parses article blocks and top article block into single array.
const parseArticles = (apiResponse) => {
  const articleBlocks = [];

  articleBlocks.push({
    category: {
      id: 0,
      name: 'Pagrindinis',
      template_id: 0,
      is_slug_block: 0,
    },
    items: apiResponse.articles,
  });

  apiResponse.articles_blocks.forEach((block, i) => {
    const category = {
      id: block.category_id,
      name: block.category_title || block.slug_title || block.block_title,
      template_id: block.template_id,
      is_slug_block: block.is_slug_block,
      slug_url: block.slug_url,
    };

    const articles = block.articles_list;
    if (articles) {
      articleBlocks.push({
        category: category,
        items: articles,
      });
    }
  });

  return articleBlocks;
};

export default reducer;
