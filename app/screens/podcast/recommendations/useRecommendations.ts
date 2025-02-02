import {useEffect, useState} from 'react';
import {fetchArticleRecommendations, fetchArticlesByIds} from '../../../api';
import {ArticleSearchItem} from '../../../api/Types';

const useRecomendations = (articleId: number) => {
  const [items, setItems] = useState<ArticleSearchItem[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      return;
    }

    fetchArticleRecommendations(articleId).then((response) => {
      if (response.result?.items && response.result.items.length > 0) {
        fetchArticlesByIds(response.result.items.map((item) => item.id)).then((response) => {
          setItems(response.items);
        });
      }
    });
  }, []);

  return {
    items,
  };
};

export default useRecomendations;
