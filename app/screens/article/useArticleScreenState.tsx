import {useNavigation} from '@react-navigation/core';
import {useCallback, useEffect, useState} from 'react';
import {ArticleCategoryInfo, ArticleContent} from '../../api/Types';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {useUserStore} from '../../state/user_store';
import {useAddHistoryUserArticle} from '../../api/hooks/useHistoryArticles';
import {useArticle} from '../../api/hooks/useArticle';

type ScreenState = {
  article?: ArticleContent;
  category_info?: ArticleCategoryInfo;
  loadingState:
    | typeof STATE_LOADING
    | typeof STATE_ERROR
    | typeof STATE_READY
    | typeof STATE_ADULT_CONTENT_WARNING;
};

const STATE_LOADING = 'loading';
const STATE_ADULT_CONTENT_WARNING = 'adult-content-warning';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const useArticleScreenState = (
  articleId: number,
  // isMedia is used to determine if the article is a media type (audio/video)
  isMedia: boolean = articleId > 1000000000,
): [ScreenState, (accept: boolean) => void] => {
  const [screenState, setScreenState] = useState<ScreenState>({
    loadingState: STATE_LOADING,
  });

  const {data, isLoading, isError} = useArticle(articleId, isMedia);

  const userStore = useUserStore();
  const articleStorage = useArticleStorageStore.getState();
  const navigation = useNavigation();
  const addHistoryUserArticleMutation = useAddHistoryUserArticle();

  useEffect(() => {
    addHistoryUserArticleMutation.mutate(articleId);
  }, [articleId]);

  useEffect(() => {
    if (isLoading) {
      setScreenState({loadingState: STATE_LOADING});
      return;
    }
    if (isError || !data?.article) {
      setScreenState({loadingState: STATE_ERROR});
      return;
    }

    const article = data.article;

    var articleHasAgeRestriction =
      article && (article['n-18'] || article.age_restriction?.toLowerCase() === 'n-18');
    if (articleHasAgeRestriction) {
      const last16Hours = Date.now() - 1000 * 60 * 60 * 16;
      if (userStore.lastAdultContentAcceptedTime > last16Hours) {
        articleHasAgeRestriction = false;
      }
    }

    const loadingState = articleHasAgeRestriction ? STATE_ADULT_CONTENT_WARNING : STATE_READY;

    setScreenState({
      article,
      category_info: data.category_info,
      loadingState: loadingState,
    });

    articleStorage.addArticleToHistory(article);
  }, [isLoading, isError, data]);

  const acceptAdultContent = useCallback(
    (accept: boolean) => {
      if (screenState.loadingState !== STATE_ADULT_CONTENT_WARNING) {
        console.warn(`Cannot accept adult content warning in state:"${screenState.loadingState}".`);
      } else {
        if (accept) {
          userStore.setLastAdultContentAcceptedTime(Date.now());
          setScreenState({
            ...screenState,
            loadingState: STATE_READY,
          });
        } else {
          navigation.goBack();
        }
      }
    },
    [navigation, screenState, userStore],
  );

  return [screenState, acceptAdultContent];
};

export default useArticleScreenState;
