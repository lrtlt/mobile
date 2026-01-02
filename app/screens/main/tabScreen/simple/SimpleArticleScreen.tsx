import React, {useEffect, useMemo} from 'react';

import Gemius from 'react-native-gemius-plugin';
import useNewestArticlesProvider from './articleProviders/useNewestArticlesProvider';
import usePopularArticlesProvider from './articleProviders/usePopularArticlesProvider';
import TabScreenContent from './SimpleArticleScreenContent';
import {ArticleScreenAdapter} from './articleProviders/Types';
import useCategoryArticlesProvider from './articleProviders/useCategoryArticlesProvider';
import useSimpleArticleScreenAnalytics from './useSimpleArticleScreenAnalytics';
import Config from 'react-native-config';
import {MENU_TYPE_CATEGORY, MENU_TYPE_NEWEST, MENU_TYPE_POPULAR} from '../../../../api/Types';

interface Props {
  type: typeof MENU_TYPE_CATEGORY | typeof MENU_TYPE_NEWEST | typeof MENU_TYPE_POPULAR;
  showTitle: boolean;
  showBackToHome?: boolean;
  categoryId?: number;
  categoryTitle?: string;
  categoryUrl?: string;
  headerComponent?: React.ReactElement;
  onScroll?: (event: any) => void;
  paddingTop?: number;
}

const TWO_MINUTES = 1000 * 60 * 2;

const SimpleArticleScreen: React.FC<React.PropsWithChildren<Props>> = ({
  type,
  showTitle,
  showBackToHome,
  categoryId,
  categoryTitle,
  categoryUrl,
  headerComponent,
  onScroll,
  paddingTop,
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

  useSimpleArticleScreenAnalytics({
    type,
    categoryTitle,
    categoryUrl: categoryUrl ?? `/${categoryTitle?.toLocaleLowerCase()}`,
  });

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
      categoryId: categoryId?.toString(),
    });
    if (!state.lastFetchTime || Date.now() - state.lastFetchTime > TWO_MINUTES) {
      refresh();
    }
  }, [categoryId, type]);

  return (
    <TabScreenContent
      data={state}
      requestNextPage={loadNextPage}
      requestRefresh={refresh}
      showTitle={showTitle}
      showBackToHome={showBackToHome}
      headerComponent={headerComponent}
      onScroll={onScroll}
      paddingTop={paddingTop}
    />
  );
};

export default SimpleArticleScreen;
