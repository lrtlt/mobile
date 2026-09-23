import {Platform} from 'react-native';
import {createMMKV} from 'react-native-mmkv';
import {getAppVersion} from './useAppVersion';

/**
 * smartocto mobile app tracking: https://knowledgebase.smartocto.com/mobile-app-tracking
 * Only Page View requests are sent, without Article Read and Attention Time.
 *
 * smartocto merges app traffic with the lrt.lt web traffic of the same page by matching the url,
 * domain id and post id, so page metadata must be identical to what the website sends in `window._ain`.
 */

const PAGE_VIEW_URL = 'https://ingestion.smartocto.com/p';
const LRT_ORIGIN = 'https://www.lrt.lt';
const LRT_ORIGIN_PATTERN = /^https?:\/\/(?:www\.)?lrt\.lt/i;

// Same as `window._ain.id` on lrt.lt
const DOMAIN_ID = '30520';

const SESSION_TIMEOUT = 30 * 60 * 1000;
const LIFETIME_ID_TTL = 2 * 365 * 24 * 60 * 60 * 1000;

const KEY_LIFETIME_ID = 'lifetime_id';
const KEY_SESSION_ID = 'session_id';
const KEY_SESSION_ACTIVITY = 'session_last_activity';

export type ReaderType = 'anonymous' | 'registered';

/** Page metadata, mirroring the lrt.lt `window._ain` object of the same page. */
export type SmartoctoPage = {
  url: string;
  pageType: 'article' | 'landing';
  postId?: string;
  title?: string;
  /** Comma separated */
  authors?: string;
  /** `>` separated hierarchy */
  sections?: string;
  /** Comma separated */
  tags?: string;
  /** ISO 8601 */
  pubdate?: string;
  articleType?: string;
};

const storage = createMMKV({
  id: 'smartocto-storage',
});

// Same format as the web tracker's cookie ids: `<timestamp ms>.<random * 1e9>`
const generateId = (timestamp: number) => `${timestamp}.${Math.random() * 1e9}`;

const getLifetimeId = () => {
  let id = storage.getString(KEY_LIFETIME_ID);
  if (!id) {
    id = generateId(Date.now() + LIFETIME_ID_TTL);
    storage.set(KEY_LIFETIME_ID, id);
  }
  return id;
};

// Renewed after 30 minutes without page views
const getSessionId = () => {
  const now = Date.now();
  let id = storage.getString(KEY_SESSION_ID);
  if (!id || now - (storage.getNumber(KEY_SESSION_ACTIVITY) ?? 0) > SESSION_TIMEOUT) {
    id = generateId(now);
    storage.set(KEY_SESSION_ID, id);
  }
  storage.set(KEY_SESSION_ACTIVITY, now);
  return id;
};

export const trackPageView = (page: SmartoctoPage, readerType: ReaderType) => {
  const query: Record<string, string | number | undefined> = {
    a: page.authors,
    c: page.title,
    d: page.url,
    e: page.sections,
    f: DOMAIN_ID,
    g: page.pubdate,
    h: page.tags,
    j: 'free',
    k: page.articleType,
    m: readerType,
    n: page.pageType,
    pid: page.postId,
    u: getSessionId(),
    ul: getLifetimeId(),
    x: Math.random(),
    t: 0,
    ch: Platform.OS === 'ios' ? 'iOS' : 'Android',
    ver: getAppVersion(),
    os_ver: String(Platform.Version),
    manuf: Platform.OS === 'android' ? Platform.constants.Manufacturer : 'Apple',
  };
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join('&');
  const url = `${PAGE_VIEW_URL}?${params}`;

  fetch(url)
    .then((response) => {
      if (__DEV__) {
        console.log(`smartocto ${response.status}: ${url}`);
      }
    })
    .catch(() => {});
};

/** Canonical lrt.lt url of a path or an url, or undefined if it is not an lrt.lt page. */
export const toLrtUrl = (pathOrUrl: string) => {
  const path = pathOrUrl.trim().replace(LRT_ORIGIN_PATTERN, '');
  if (!path.startsWith('/')) {
    return undefined;
  }
  // Without query and trailing slash
  return LRT_ORIGIN + path.split(/[?#]/)[0].replace(/(.)\/+$/, '$1');
};

/** Joins section path segments like the lrt.lt news site does: `/naujienos/lietuvoje` → `naujienos>lietuvoje`. */
export const sectionsFromPath = (path: string) => path.split('/').filter(Boolean).join('>');

/** Landing page served by the lrt.lt news site. */
export const newsLandingPage = (
  url: string,
  title: string,
  sections: string = sectionsFromPath(url.replace(LRT_ORIGIN, '')) || 'lrt',
): SmartoctoPage => ({
  url,
  title,
  pageType: 'landing',
  authors: 'redaction',
  sections,
  articleType: 'landing',
});

/** Landing page served by the lrt.lt mediateka/radioteka web app, which has its own `_ain` conventions. */
export const mediaLandingPage = (url: string, title: string, section: string): SmartoctoPage => ({
  url,
  title,
  pageType: 'landing',
  postId: `landing:${url.replace(LRT_ORIGIN, '')}`,
  sections: `Landing>${section}`,
  pubdate: '1970-01-01T00:00:00Z',
});
