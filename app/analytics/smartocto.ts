import {Platform} from 'react-native';
import {getAppVersion} from '../util/useAppVersion';
import {getLifetimeId, getSessionId, touchSession} from './smartocto_session';

/**
 * smartocto mobile app tracking: https://knowledgebase.smartocto.com/mobile-app-tracking
 * Every page sends a Page View. Article pages also send an Article Read after 10 seconds of attention
 * and an Attention Time request every 5 seconds of attention, while the visit is not paused.
 * Attention Time has no scroll position: lrt.lt already reports read depth, and the app's article
 * layout would not be comparable with it.
 *
 * smartocto merges app traffic with the lrt.lt web traffic of the same page by matching the url,
 * domain id and post id, so page metadata must be identical to what the website sends in `window._ain`.
 */

const PAGE_VIEW_URL = 'https://ingestion.smartocto.com/p';
const ATTENTION_URL = 'https://ingestion.smartocto.com/a';
const LRT_ORIGIN = 'https://www.lrt.lt';
const LRT_ORIGIN_PATTERN = /^https?:\/\/(?:www\.)?lrt\.lt/i;

// Same as `window._ain.id` on lrt.lt
const DOMAIN_ID = '3052';

/** Seconds of attention before an Article Read */
const ARTICLE_READ_TIME = 10;
/** Seconds of attention between Attention Time requests */
const ATTENTION_INTERVAL = 5;

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

/** A page on screen. Attention is counted only between `resume()` and `pause()`, and never after `end()`. */
export type PageVisit = {
  pause: () => void;
  resume: () => void;
  end: () => void;
};

type Query = Record<string, string | number | undefined>;

const send = (endpoint: string, query: Query) => {
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join('&');
  const url = `${endpoint}?${params}`;

  fetch(url)
    .then((response) => {
      if (__DEV__) {
        console.log(`smartocto ${response.status}: ${url}`);
      }
    })
    .catch(() => {});
};

/**
 * Sends a Page View. For article pages it also starts tracking the visit's Article Read and
 * Attention Time, which runs until the returned visit is paused or ended.
 */
export const trackPageView = (page: SmartoctoPage, readerType: ReaderType): PageVisit => {
  // These must be the same in every request of the visit
  const visit: Query = {
    d: page.url,
    f: DOMAIN_ID,
    pid: page.postId,
    u: getSessionId(),
    ul: getLifetimeId(),
    x: Math.random(),
    ch: Platform.OS === 'ios' ? 'iOS' : 'Android',
  };
  const pageQuery: Query = {
    ...visit,
    a: page.authors,
    c: page.title,
    e: page.sections,
    g: page.pubdate,
    h: page.tags,
    j: 'free',
    k: page.articleType,
    m: readerType,
    n: page.pageType,
    ver: getAppVersion(),
    os_ver: String(Platform.Version),
    manuf: Platform.OS === 'android' ? Platform.constants.Manufacturer : 'Apple',
  };
  send(PAGE_VIEW_URL, {...pageQuery, t: 0});

  if (page.pageType !== 'article') {
    return {pause: () => {}, resume: () => {}, end: () => {}};
  }

  let attentionTime = 0;
  let sequence = 0;
  let ended = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const tick = () => {
    attentionTime += 1;
    if (attentionTime === ARTICLE_READ_TIME) {
      send(PAGE_VIEW_URL, {...pageQuery, t: 1});
    }
    if (attentionTime % ATTENTION_INTERVAL === 0) {
      touchSession();
      sequence += 1;
      send(ATTENTION_URL, {
        ...visit,
        at: attentionTime,
        ar: ATTENTION_INTERVAL,
        ts: Date.now(),
        seq: sequence,
      });
    }
  };

  const pause = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const resume = () => {
    if (!ended && !timer) {
      timer = setInterval(tick, 1000);
    }
  };
  const end = () => {
    ended = true;
    pause();
  };

  resume();
  return {pause, resume, end};
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
