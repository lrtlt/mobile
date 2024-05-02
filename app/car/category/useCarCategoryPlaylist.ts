import {useEffect, useState} from 'react';
import {CategoryListItem} from '../CarPlayContext';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchCarCategoryPlaylist} from '../../api';
import {IMG_SIZE_XS, buildImageUri} from '../../util/ImageUtil';

const useCarPlayCategoryPlaylist = (categoryId?: number) => {
  const [episodes, setEpisodes] = useState<CategoryListItem[]>([]);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!categoryId) {
      return;
    }
    cancellablePromise(
      fetchCarCategoryPlaylist(categoryId).then((data) => {
        if (data?.articles) {
          const episodes: CategoryListItem[] = data.articles.map((item) => ({
            articleId: item.id,
            text: item.title,
            detailText: item.item_date,
            imgUrl: buildImageUri(IMG_SIZE_XS, item.img_path_prefix, item.img_path_postfix),
          }));
          setEpisodes(episodes);
        }
      }),
    );
  }, [categoryId]);

  return {
    episodes,
  };
};

export default useCarPlayCategoryPlaylist;
