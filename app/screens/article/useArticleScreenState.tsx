import {useNavigation} from '@react-navigation/core';
import {useCallback, useEffect, useState} from 'react';
import {fetchArticle} from '../../api';
import {ArticleCategoryInfo, ArticleContent, ArticleContentResponse} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {useUserStore} from '../../state/user_store';

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
  const [state, setState] = useState<ScreenState>({
    article: undefined,
    loadingState: STATE_LOADING,
  });

  const userStore = useUserStore();
  const articleStorage = useArticleStorageStore.getState();
  const navigation = useNavigation();

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    setState({
      article: undefined,
      category_info: undefined,
      loadingState: STATE_LOADING,
    });

    const onResponse = (response: ArticleContentResponse) => {
      const article = response.article;

      var articleHasAgeRestriction =
        article && (article['n-18'] || article.age_restriction?.toLowerCase() === 'n-18');
      if (articleHasAgeRestriction) {
        const last16Hours = Date.now() - 1000 * 60 * 60 * 16;
        if (userStore.lastAdultContentAcceptedTime > last16Hours) {
          articleHasAgeRestriction = false;
        }
      }

      const loadingState = !article
        ? STATE_ERROR
        : articleHasAgeRestriction
        ? STATE_ADULT_CONTENT_WARNING
        : STATE_READY;

      setState({
        article,
        category_info: response.category_info,
        loadingState: loadingState,
      });
      articleStorage.addArticleToHistory(article);
    };

    cancellablePromise(fetchArticle(articleId, isMedia))
      .then((response) => {
        if (response.article) {
          return response;
        } else {
          //If article is not found, we will try invert isMedia flag
          return cancellablePromise(fetchArticle(articleId, !isMedia));
        }
      })
      .then(onResponse)
      .catch((e) => {
        console.log(e);
        setState({
          article: undefined,
          category_info: undefined,
          loadingState: STATE_ERROR,
        });
      });
  }, [articleId, cancellablePromise]);

  const acceptAdultContent = useCallback(
    (accept: boolean) => {
      if (state.loadingState !== STATE_ADULT_CONTENT_WARNING) {
        console.warn(`Cannot accept adult content warning in state:"${state.loadingState}".`);
      } else {
        if (accept) {
          userStore.setLastAdultContentAcceptedTime(Date.now());
          setState({
            ...state,
            loadingState: STATE_READY,
          });
        } else {
          navigation.goBack();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return [state, acceptAdultContent];
};

export default useArticleScreenState;
