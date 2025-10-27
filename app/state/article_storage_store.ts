import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from './mmkv';
import {ArticleContent, isMediaArticle} from '../api/Types';
import {ARTICLE_HISTORY_COUNT, ARTICLE_SAVED_MAX_COUNT} from '../constants';
import FastImage from '@d11/react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_M} from '../util/ImageUtil';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';

export type SavedArticle = {
  id: number;
  title: string;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  url?: string;
  photo: string;
  is_video?: 1 | 0;
  is_audio?: 1 | 0;
};

type ArticleStorageState = {
  history: ArticleContent[];
  savedArticles: ArticleContent[];
  lastSyncTime?: number;
};

type ArticleStorageActions = {
  saveArticle: (article: ArticleContent) => void;
  removeArticle: (articleId: number, noAnalytics?: boolean) => void;
  addArticleToHistory: (article: ArticleContent) => void;
};

type ArticleStorageStore = ArticleStorageState & ArticleStorageActions;

const initialState: ArticleStorageState = {
  history: [],
  savedArticles: [],
};

const _articleId = (article: ArticleContent): number => {
  return isMediaArticle(article) ? article.id : article.article_id;
};

const _articleUrl = (article: ArticleContent): string | undefined => {
  return isMediaArticle(article) ? article.url : article.article_url;
};

export const useArticleStorageStore = create<ArticleStorageStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      saveArticle: (article) => {
        const savedArticles = get().savedArticles;
        savedArticles.unshift(article);
        if (savedArticles.length > ARTICLE_SAVED_MAX_COUNT) {
          savedArticles.pop();
        }
        _cacheImages([article]);
        set({savedArticles});
        logEvent(getAnalytics(), 'app_lrt_lt_article_saved', {
          article_id: _articleId(article),
          article_url: _articleUrl(article),
        });
      },
      removeArticle: (articleId, noAnalytics) => {
        set((state) => {
          return {
            savedArticles: state.savedArticles.filter((a) => _articleId(a) !== articleId),
          };
        });
        if (!noAnalytics) {
          logEvent(getAnalytics(), 'app_lrt_lt_article_removed', {
            article_id: articleId,
          });
        }
      },
      addArticleToHistory: async (article) => {
        let history = get().history;
        history = history.filter((a) => _articleId(a) !== _articleId(article));
        history.unshift(article);
        if (history.length > ARTICLE_HISTORY_COUNT) {
          history.pop();
        }
        _cacheImages([article]);
        set({history});
      },
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

const _cacheImages = async (articles: ArticleContent[]) => {
  if (!articles || articles.length === 0) return;

  for (const article of articles) {
    if (article.main_photo?.path) {
      try {
        await FastImage.preload([{uri: buildArticleImageUri(IMG_SIZE_M, article.main_photo.path)}]);
      } catch (e) {
        console.error(`Error preloading image for article ${_articleId(article)}:`, e);
      }
    }
  }
};

export const mapArticleStorageData = (article: ArticleContent): SavedArticle => {
  if (isMediaArticle(article)) {
    return {
      id: article.id,
      category_title: article.category_title,
      category_id: article.category_id,
      title: article.title,
      url: article.url,
      photo: article.main_photo?.path,
      subtitle: article.subtitle,
      is_video: article.is_video,
      is_audio: article.is_audio,
    };
  } else {
    return {
      id: article.article_id,
      category_title: article.category_title,
      category_id: article.category_id,
      title: article.article_title,
      url: article.article_url,
      photo: article.main_photo?.path,
      subtitle: article.article_subtitle,
      is_video: article.is_video,
      is_audio: 0,
    };
  }
};
