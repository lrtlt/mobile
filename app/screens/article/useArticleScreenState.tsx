import {useNavigation} from '@react-navigation/core';
import {useCallback, useEffect, useState} from 'react';
import {fetchArticle} from '../../api';
import {ArticleContent} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {useArticleStorageStore} from '../../state/article_storage_store';

type ScreenState = {
  article?: ArticleContent;
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
  isMedia?: boolean,
): [ScreenState, (accept: boolean) => void] => {
  const [state, setState] = useState<ScreenState>({
    article: undefined,
    loadingState: STATE_LOADING,
  });

  const articleStorage = useArticleStorageStore.getState();
  const navigation = useNavigation();

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    setState({
      article: undefined,
      loadingState: STATE_LOADING,
    });

    cancellablePromise(fetchArticle(articleId, isMedia))
      .then((response) => {
        const article = response.article;
        const loadingState = !article
          ? STATE_ERROR
          : article['n-18']
          ? STATE_ADULT_CONTENT_WARNING
          : STATE_READY;

        setState({
          article,
          loadingState: loadingState,
        });
        articleStorage.addArticleToHistory(article);
      })
      .catch((e) => {
        console.log(e);
        setState({
          article: undefined,
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
