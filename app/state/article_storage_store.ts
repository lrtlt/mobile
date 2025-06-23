import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from './mmkv';
import {ArticleContent, isMediaArticle} from '../api/Types';
import {ARTICLE_HISTORY_COUNT, ARTICLE_SAVED_MAX_COUNT} from '../constants';
import {fetchArticle} from '../api';
import FastImage from '@d11/react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_M} from '../util/ImageUtil';

//TODO: 2024-10-01 remove migration after a while.
export const runArticleStorageMigration = async () => {
  if (zustandStorage.getItem('article-storage-migrated')) return;

  const rootJson = await AsyncStorage.getItem('persist:root');
  if (rootJson) {
    console.log('## Migrating article storage');
    const root = JSON.parse(rootJson);
    const articleStorage = JSON.parse(root['articleStorage']);
    if (articleStorage) {
      useArticleStorageStore.setState(articleStorage);
      zustandStorage.setItem('article-storage-migrated', 'true');
    }
  }
};

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
  syncSavedArticles: () => void;
  removeArticle: (articleId: number) => void;
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
      },
      removeArticle: (articleId) => {
        set((state) => {
          return {
            savedArticles: state.savedArticles.filter((a) => _articleId(a) !== articleId),
          };
        });
      },
      syncSavedArticles: async () => {
        const {lastSyncTime} = get();
        if (lastSyncTime && Date.now() - lastSyncTime < 4 * 60 * 60 * 1000) {
          // If last sync was less than 4 hours ago, skip syncing
          return;
        }

        const {savedArticles} = get();
        for (const article of savedArticles) {
          try {
            const isMedia = isMediaArticle(article);
            var response = await fetchArticle(_articleId(article), isMedia);

            // TODO: remove after some time in future. Added at 2025-06-23
            // This can happen when migrating from old storage
            // When article is actualy not media but stored as media
            if (!response.article) {
              response = await fetchArticle(_articleId(article), !isMedia);
            }

            const index = savedArticles.indexOf(article);
            if (index !== -1) {
              savedArticles[index] = response.article;
            }
          } catch (e) {
            console.error(`Error syncing article ${_articleId(article)}:`, e);
          }
        }

        const nonNullArticles = savedArticles.filter((a) => !!a);
        _cacheImages(nonNullArticles);
        set({savedArticles: nonNullArticles, lastSyncTime: Date.now()});
      },
      addArticleToHistory: (article) => {
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
