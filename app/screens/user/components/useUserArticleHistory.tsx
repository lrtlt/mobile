import {useEffect, useState} from 'react';
import {articleHistoryGet, fetchArticlesByIds} from '../../../api';
import {ArticleSearchItem} from '../../../api/Types';

const useUserArticleHistory = () => {
  const [articles, setArticles] = useState<ArticleSearchItem[]>([]);

  useEffect(() => {
    articleHistoryGet(1).then((response) => {
      const articleIds = response.articles.map((a) => a.articleId.toString());
      fetchArticlesByIds(articleIds).then((fetchedArticles) => {
        setArticles(fetchedArticles.items);
      });
    });
  }, []);

  return {articles};
};

export default useUserArticleHistory;
