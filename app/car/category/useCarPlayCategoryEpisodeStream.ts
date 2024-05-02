import {useEffect, useState} from 'react';
import {CategoryListItem, PlayListItem} from '../CarPlayContext';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchArticle} from '../../api';
import {isMediaArticle} from '../../api/Types';
import {IMG_SIZE_XS, buildArticleImageUri} from '../../util/ImageUtil';

const useCarPlayCategoryEpisodeStream = (episode?: CategoryListItem) => {
  const [streamInfo, setStreamInfo] = useState<PlayListItem>();

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!episode) {
      return;
    }
    cancellablePromise(
      fetchArticle(episode.articleId).then((data) => {
        const article = data?.article;
        if (isMediaArticle(article)) {
          setStreamInfo({
            id: episode.articleId,
            text: article.title,
            detailText: article.date,
            imgUrl: buildArticleImageUri(IMG_SIZE_XS, article?.main_photo?.path) as any,
            streamUrl: article.stream_url,
          });
        }
      }),
    );
  }, [episode]);

  return {
    streamInfo,
  };
};

export default useCarPlayCategoryEpisodeStream;
