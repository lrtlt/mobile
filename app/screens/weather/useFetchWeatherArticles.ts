import {useEffect, useState} from 'react';
import {Article} from '../../../Types';
import {fetchArticlesByTag} from '../../api';
import useCancellablePromise from '../../hooks/useCancellablePromise';

const TAG = 'orai';

const useFetchWeatherArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    cancellablePromise(fetchArticlesByTag(TAG, 5))
      .then((response) => {
        setArticles(response.articles);
      })
      .catch((e) => {
        console.log('Error:', e);
      });
  }, [cancellablePromise]);

  return articles;
};

export default useFetchWeatherArticles;
