import React, {useEffect, useMemo} from 'react';

import Gemius from 'react-native-gemius-plugin';
import {ROUTE_TYPE_CATEGORY, ROUTE_TYPE_NEWEST, ROUTE_TYPE_POPULAR} from '../../../../api/Types';
import {EVENT_LOGO_PRESS} from '../../../../constants';
import useNewestArticlesProvider from './articleProviders/useNewestArticlesProvider';
import usePopularArticlesProvider from './articleProviders/usePopularArticlesProvider';
import TabScreenContent from './SimpleArticleScreenContent';
import {ArticleScreenAdapter} from './articleProviders/Types';
import useCategoryArticlesProvider from './articleProviders/useCategoryArticlesProvider';
import {EventRegister} from 'react-native-event-listeners';
import useSimpleArticleScreenAnalytics from './useSimpleArticleScreenAnalytics';
import Config from 'react-native-config';

interface Props {
  isCurrent: boolean;
  type: typeof ROUTE_TYPE_CATEGORY | typeof ROUTE_TYPE_NEWEST | typeof ROUTE_TYPE_POPULAR;
  showTitle: boolean;
  showBackToHome?: boolean;
  categoryId?: number;
  categoryTitle?: string;
  categoryUrl?: string;
}

const TWO_MINUTES = 1000 * 60 * 2;

const SimpleArticleScreen: React.FC<React.PropsWithChildren<Props>> = ({
  isCurrent,
  type,
  showTitle,
  showBackToHome,
  categoryId,
  categoryTitle,
  categoryUrl,
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

  useSimpleArticleScreenAnalytics({type, categoryTitle, categoryUrl});

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
      categoryId: categoryId?.toString(),
    });

    if (!!state.lastFetchTime && Date.now() - state.lastFetchTime > TWO_MINUTES) {
      refresh();
    }
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

export default SimpleArticleScreen;
