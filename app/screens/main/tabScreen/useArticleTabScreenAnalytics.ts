import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {ROUTE_TYPE_CATEGORY, ROUTE_TYPE_NEWEST, ROUTE_TYPE_POPULAR} from '../../../api/Types';
import useNavigationAnalytics, {TrackingParams} from '../../../util/useNavigationAnalytics';

type Params = {
  type: typeof ROUTE_TYPE_CATEGORY | typeof ROUTE_TYPE_NEWEST | typeof ROUTE_TYPE_POPULAR;
  categoryTitle?: string;
};

const useArticleTabScreenAnalytics = (params: Params) => {
  const trackingParams = toTrackingParams(params);
  useNavigationAnalytics(trackingParams);
};

const toTrackingParams = ({type, categoryTitle}: Params): TrackingParams | undefined => {
  if (!type) {
    return undefined;
  }
  let typeTitle = '';
  switch (type) {
    case ROUTE_TYPE_CATEGORY:
      typeTitle = 'Kategorija - ' + categoryTitle;
      break;
    case ROUTE_TYPE_NEWEST:
      typeTitle = 'Naujausi';
      break;
    case ROUTE_TYPE_POPULAR:
      typeTitle = 'Populiariausi';
      break;
  }
  return {
    type: typeTitle,
    title: typeTitle,
  };
};

export default useArticleTabScreenAnalytics;
