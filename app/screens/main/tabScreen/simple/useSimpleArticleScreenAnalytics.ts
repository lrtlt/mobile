import {MENU_TYPE_CATEGORY, MENU_TYPE_NEWEST, MENU_TYPE_POPULAR} from '../../../../api/Types';
import useNavigationAnalytics, {TrackingParams} from '../../../../util/useNavigationAnalytics';
import {newsLandingPage, toLrtUrl} from '../../../../util/smartocto';

type Params = {
  type: typeof MENU_TYPE_CATEGORY | typeof MENU_TYPE_NEWEST | typeof MENU_TYPE_POPULAR;
  categoryTitle?: string;
  categoryUrl?: string;
};

const useSimpleArticleScreenAnalytics = (params: Params) => {
  const trackingParams = toTrackingParams(params);
  useNavigationAnalytics(trackingParams);
};

const toTrackingParams = ({type, categoryTitle, categoryUrl}: Params): TrackingParams | undefined => {
  if (!type) {
    return undefined;
  }
  let title = '';
  let url;

  switch (type) {
    case MENU_TYPE_CATEGORY:
      title = `${categoryTitle} - LRT`;
      url = categoryUrl ? toLrtUrl(categoryUrl) : undefined;
      break;
    case MENU_TYPE_NEWEST:
      title = 'Naujausi - LRT';
      break;
    case MENU_TYPE_POPULAR:
      title = 'Populiariausi - LRT';
      break;
  }

  return {
    viewId: url ?? title,
    title: title,
    // Newest and popular lists have no lrt.lt page
    smartocto: url ? newsLandingPage(url, title) : undefined,
  };
};

export default useSimpleArticleScreenAnalytics;
