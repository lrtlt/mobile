import useNavigationAnalytics, {TrackingParams} from '../../../../util/useNavigationAnalytics';

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
  const viewId = `https://www.lrt.lt${categoryUrl}`;

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

export default useCategoryScreenAnalytics;
