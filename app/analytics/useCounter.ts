import {useEffect} from 'react';
import {fetchCounter} from '../api';
import {Platform} from 'react-native';
import {ArticleContent, isDefaultArticle, isMediaArticle} from '../api/Types';
import {analyticsArticleId} from './analyticsArticleId';

export const useCounter = (id: string | number, url?: string) => {
  useEffect(() => {
    fetchCounter(id, url, Platform.OS);
  }, [id]);
};

export const useCounterForArticle = (article?: ArticleContent) => {
  useEffect(() => {
    if (article) {
      if (isDefaultArticle(article)) {
        fetchCounter(analyticsArticleId(article), article.article_url, Platform.OS);
      } else if (isMediaArticle(article)) {
        fetchCounter(analyticsArticleId(article), article.url, Platform.OS);
      }
    }
  }, [article]);
};
