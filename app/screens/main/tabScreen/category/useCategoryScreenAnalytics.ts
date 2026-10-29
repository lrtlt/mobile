import useNavigationAnalytics, {TrackingParams} from '../../../../analytics/useNavigationAnalytics';
import {newsLandingPage, toLrtUrl} from '../../../../analytics/smartocto';

type Params = {
  categoryTitle?: string;
  categoryUrl?: string;
};

const useCategoryScreenAnalytics = (params: Params) => {
  const trackingParams = toTrackingParams(params);
  useNavigationAnalytics(trackingParams);
};

const toTrackingParams = ({categoryTitle, categoryUrl}: Params): TrackingParams | undefined => {
  const title = `${categoryTitle} - LRT`;
  const url = categoryUrl ? toLrtUrl(categoryUrl) : undefined;

  return {
    viewId: url ?? title,
    title: title,
    smartocto: url ? newsLandingPage(url, title) : undefined,
  };
};

export default useCategoryScreenAnalytics;
