import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {toLrtUrl} from './smartocto';

/**
 * lrt.lt sends a plain GA4 `page_view` (GTM-NNQ95HK → G-0HK3QSMV3W) with only page_location,
 * page_title and page_referrer. The app sends the same event so app and web page views can be
 * reported together. Screens without an lrt.lt page are not sent.
 *
 * Article pages also send content_type and content_id, so views can be broken down by content.
 */

export type PageContent = {
  type: 'text' | 'video' | 'audio';
  id: string;
};

// Firebase Analytics accepts event parameter values of up to 100 characters
const MAX_PARAM_LENGTH = 100;

// Article, vodcast and podcast urls (the deep links in app/navigation/index.tsx) end with an id and a title slug.
// The slug is the long part, so it is dropped as a whole, keeping the url up to the id.
const TITLE_SLUG_PATTERN =
  /^(https:\/\/www\.lrt\.lt\/(?:naujienos\/[^/]+\/.+|mediateka\/irasas|radioteka\/irasas)\/\d+)\/[^/]+$/;

/** Trims a value to the Firebase parameter length, dropping the title slug of a long lrt.lt url first. Exported for tests. */
export const toParamValue = (value: string) => {
  if (value.length <= MAX_PARAM_LENGTH) {
    return value;
  }
  const withoutSlug = value.replace(TITLE_SLUG_PATTERN, '$1');
  return withoutSlug.slice(0, MAX_PARAM_LENGTH);
};

// The browser sends the previous page as page_referrer on lrt.lt
let lastPageLocation: string | undefined;

export const logPageView = (viewId: string, title?: string, content?: PageContent) => {
  const lrtUrl = toLrtUrl(viewId);
  if (!lrtUrl) {
    return;
  }
  const pageLocation = toParamValue(lrtUrl);

  logEvent(getAnalytics(), 'page_view', {
    page_location: pageLocation,
    ...(title ? {page_title: toParamValue(title)} : {}),
    ...(lastPageLocation ? {page_referrer: lastPageLocation} : {}),
    ...(content ? {content_type: content.type, content_id: content.id} : {}),
  });
  lastPageLocation = pageLocation;
};
