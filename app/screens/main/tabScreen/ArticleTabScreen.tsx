import React, {useEffect, useMemo} from 'react';

import Gemius from 'react-native-gemius-plugin';
import {ROUTE_TYPE_CATEGORY, ROUTE_TYPE_NEWEST, ROUTE_TYPE_POPULAR} from '../../../api/Types';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../../constants';
import useNewestArticlesProvider from './useNewestArticlesProvider';
import usePopularArticlesProvider from './usePopularArticlesProvider';
import TabScreenContent from './ArticleTabScreenContent';
import {ArticleScreenAdapter} from './Types';
import useCategoryArticlesProvider from './useCategoryArticlesProvider';

interface Props {
  isCurrent: boolean;
  type: typeof ROUTE_TYPE_CATEGORY | typeof ROUTE_TYPE_NEWEST | typeof ROUTE_TYPE_POPULAR;
  showTitle: boolean;
  categoryId?: number;
  categoryTitle?: string;
}

const ArticleTabScreen: React.FC<Props> = ({isCurrent, type, showTitle, categoryId, categoryTitle}) => {
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

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
      categoryId: categoryId?.toString(),
    });
    refresh();
  }, [categoryId, refresh, type]);

  return (
    <TabScreenContent
      data={state}
      isCurrent={isCurrent}
      requestNextPage={loadNextPage}
      requestRefresh={refresh}
      showTitle={showTitle}
    />
  );
};

export default ArticleTabScreen;
