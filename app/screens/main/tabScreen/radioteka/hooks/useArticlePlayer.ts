import {useCallback} from 'react';
import {useMediaPlayer} from '../../../../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../../../../components/videoComponent/context/PlayerContext';
import {isMediaArticle} from '../../../../../api/Types';
import {fetchArticle} from '../../../../../api';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../../../util/ImageUtil';

export const useArticlePlayer = () => {
  const {setMediaData} = useMediaPlayer();

  const playArticle = useCallback(
    async (articleId: number) => {
      try {
        const response = await fetchArticle(articleId);
        const article = response.article;

        if (!isMediaArticle(article)) {
          throw new Error('Invalid article type');
        }

        setMediaData({
          uri: article.stream_url,
          title: article.title,
          poster: buildArticleImageUri(IMG_SIZE_M, article.main_photo.path),
          mediaType: article.is_video ? MediaType.VIDEO : MediaType.AUDIO,
          isLiveStream: false,
        });
      } catch (error) {
        console.error('Failed to play article:', error);
      }
    },
    [setMediaData],
  );

  return {playArticle};
};
