import React, {useEffect, useMemo} from 'react';

import Gemius from 'react-native-gemius-plugin';
import {ROUTE_TYPE_CATEGORY, ROUTE_TYPE_NEWEST, ROUTE_TYPE_POPULAR} from '../../../api/Types';
import {EVENT_LOGO_PRESS, GEMIUS_VIEW_SCRIPT_ID} from '../../../constants';
import useNewestArticlesProvider from './useNewestArticlesProvider';
import usePopularArticlesProvider from './usePopularArticlesProvider';
import TabScreenContent from './ArticleTabScreenContent';
import {ArticleScreenAdapter} from './Types';
import useCategoryArticlesProvider from './useCategoryArticlesProvider';
import {EventRegister} from 'react-native-event-listeners';
import useArticleTabScreenAnalytics from './useArticleTabScreenAnalytics';

interface Props {
  isCurrent: boolean;
  type: typeof ROUTE_TYPE_CATEGORY | typeof ROUTE_TYPE_NEWEST | typeof ROUTE_TYPE_POPULAR;
  showTitle: boolean;
  showBackToHome?: boolean;
  categoryId?: number;
  categoryTitle?: string;
}

const ArticleTabScreen: React.FC<Props> = ({
  isCurrent,
  type,
  showTitle,
  showBackToHome,
  categoryId,
  categoryTitle,
}) => {
  const provider: ArticleScreenAdapter = useMemo(() => {
    switch (type) {
      case 'newest': {
        return useNewestArticlesProvider;
      }
      case 'popular': {
        return usePopularArticlesProvider;
      }
      case 'category': {
        return useCategoryArticlesProvider;
      }
    }
  }, [type]);

  const {state, loadNextPage, refresh} = provider(categoryId, categoryTitle);

  useArticleTabScreenAnalytics({type, categoryTitle});

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
      categoryId: categoryId?.toString(),
    });
  }, [categoryId, type]);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        refresh();
      }
    });

    if (typeof listener === 'string') {
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }
  }, [isCurrent, refresh]);

  return (
    <TabScreenContent
      data={state}
      requestNextPage={loadNextPage}
      requestRefresh={refresh}
      showTitle={showTitle}
      showBackToHome={showBackToHome}
    />
  );
};

export default ArticleTabScreen;
