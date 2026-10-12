import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {toLrtUrl} from './smartocto';

/**
 * lrt.lt sends a plain GA4 `page_view` (GTM-NNQ95HK → G-0HK3QSMV3W) with only page_location,
 * page_title and page_referrer. The app sends the same event so app and web page views can be
 * reported together. Screens without an lrt.lt page are not sent.
 */

// The browser sends the previous page as page_referrer on lrt.lt
let lastPageLocation: string | undefined;

export const logPageView = (viewId: string, title?: string) => {
  const pageLocation = toLrtUrl(viewId);
  if (!pageLocation) {
    return;
  }

  logEvent(getAnalytics(), 'page_view', {
    page_location: pageLocation,
    ...(title ? {page_title: title} : {}),
    ...(lastPageLocation ? {page_referrer: lastPageLocation} : {}),
  });
  lastPageLocation = pageLocation;
};
