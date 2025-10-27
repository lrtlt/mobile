import {useArticlesByTag} from '../../api/hooks/useArticlesByTag';

const TAG = 'orai';

const useFetchWeatherArticles = () => {
  const {data} = useArticlesByTag(TAG, 5);
  return data?.articles;
};

export default useFetchWeatherArticles;
