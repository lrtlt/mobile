import {MENU_TYPE_CATEGORY, MENU_TYPE_NEWEST, MENU_TYPE_POPULAR} from '../../../../api/Types';
import useNavigationAnalytics, {TrackingParams} from '../../../../util/useNavigationAnalytics';

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
  let viewId;

  switch (type) {
    case MENU_TYPE_CATEGORY:
      title = `${categoryTitle} - LRT`;
      viewId = `https://www.lrt.lt${categoryUrl}`;
      break;
    case MENU_TYPE_NEWEST:
      title = 'Naujausi - LRT';
      break;
    case MENU_TYPE_POPULAR:
      title = 'Populiariausi - LRT';
      break;
  }

  const sections = ['naujienos'];
  if (categoryTitle) {
    sections.unshift(categoryTitle);
  }

  return {
    viewId: viewId ?? title,
    title: title,
    sections: sections,
  };
};

export default useSimpleArticleScreenAnalytics;
