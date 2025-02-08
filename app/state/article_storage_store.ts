import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from './mmkv';
import {ArticleContent, isMediaArticle} from '../api/Types';
import {ARTICLE_HISTORY_COUNT, ARTICLE_SAVED_MAX_COUNT} from '../constants';

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
  history: SavedArticle[];
  savedArticles: SavedArticle[];
};

type ArticleStorageActions = {
  saveArticle: (article: ArticleContent) => void;
  removeArticle: (articleId: number) => void;
  addArticleToHistory: (article: ArticleContent) => void;
};

type ArticleStorageStore = ArticleStorageState & ArticleStorageActions;

const initialState: ArticleStorageState = {
  history: [],
  savedArticles: [],
};

export const useArticleStorageStore = create<ArticleStorageStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      saveArticle: (article) => {
        const savedArticles = get().savedArticles;
        savedArticles.unshift(mapArticleData(article));
        if (savedArticles.length > ARTICLE_SAVED_MAX_COUNT) {
          savedArticles.pop();
        }
        set({savedArticles});
      },
      removeArticle: (articleId) => {
        set((state) => {
          return {
            savedArticles: state.savedArticles.filter((a) => a.id !== articleId),
          };
        });
      },
      addArticleToHistory: (article) => {
        let history = get().history;
        const articleData = mapArticleData(article);
        history = history.filter((a) => a.id !== articleData.id);
        history.unshift(articleData);
        if (history.length > ARTICLE_HISTORY_COUNT) {
          history.pop();
        }
        set({history});
      },
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

const mapArticleData = (article: ArticleContent): SavedArticle => {
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
