jest.mock('react-native', () => ({Platform: {OS: 'ios', Version: '18.2', constants: {}}}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => {
    const values = ((globalThis as Record<string, unknown>).__smartoctoStorage = new Map<
      string,
      string | number
    >());
    return {
      getString: (key: string) => values.get(key),
      getNumber: (key: string) => values.get(key),
      set: (key: string, value: string | number) => values.set(key, value),
    };
  },
}));

jest.mock('../app/util/useNavigationAnalytics', () => ({__esModule: true, default: jest.fn()}));

import {ArticleContent} from '../app/api/Types';
import {articleToTrackingParams} from '../app/screens/article/useArticleAnalytics';
import {LIFETIME_ID_TTL, mediaLandingPage, newsLandingPage, toLrtUrl, trackPageView} from '../app/util/smartocto';

// Expected values are what lrt.lt sends to smartocto for the same pages (window._ain)
describe('articleToTrackingParams', () => {
  it('mirrors lrt.lt metadata of a news article', () => {
    const article = {
      article_id: 3061211,
      article_title: 'Konstitucinis Teismas priėmė nagrinėti LRT įstatymo pataisas',
      article_url:
        '/naujienos/lietuvoje/2/3061211/konstitucinis-teismas-prieme-nagrineti-lrt-istatymo-pataisas',
      article_authors: [{author_id: 568160, slug: 'jurate-skeryte', name: 'Jūratė Skėrytė, BNS'}],
      article_keywords: [
        {slug: 'lrt', name: 'LRT'},
        {slug: 'konstitucinis-teismas', name: 'Konstitucinis Teismas'},
        {slug: 'istatymo-pataisos', name: 'Įstatymo pataisos'},
      ],
      category_url: '/naujienos/lietuvoje',
      category_title: 'Lietuvoje',
      item_date_iso8601: '2026-09-23T10:20:00Z',
    } as unknown as ArticleContent;

    expect(articleToTrackingParams(article)?.smartocto).toEqual({
      url: 'https://www.lrt.lt/naujienos/lietuvoje/2/3061211/konstitucinis-teismas-prieme-nagrineti-lrt-istatymo-pataisas',
      pageType: 'article',
      postId: '3061211',
      title: 'Konstitucinis Teismas priėmė nagrinėti LRT įstatymo pataisas',
      authors: 'Jūratė Skėrytė',
      sections: 'naujienos>lietuvoje',
      tags: 'LRT, Konstitucinis Teismas, Įstatymo pataisos',
      pubdate: '2026-09-23T10:20:00Z',
      articleType: 'news',
    });
  });

  it('lists every author without the affiliation', () => {
    const article = {
      article_id: 1,
      article_title: '',
      article_authors: [
        {name: 'Aistė Valiauskaitė'},
        {name: 'Goda Malinauskaitė, LRT TV, LRT.lt'},
        {name: 'Marie-Line Deleye, specialiai LRT.lt iš Prancūzijos'},
      ],
    } as unknown as ArticleContent;

    expect(articleToTrackingParams(article)?.smartocto?.authors).toBe(
      'Aistė Valiauskaitė, Goda Malinauskaitė, Marie-Line Deleye',
    );
  });

  it('mirrors lrt.lt metadata of a radioteka article', () => {
    const article = {
      id: 3061155,
      title: 'Kauno „Žalgirio“ prekės ženklo atnaujinimo bendraautoris',
      url: '/radioteka/irasas/2000872059/kauno-zalgirio-prekes-zenklo-atnaujinimo-bendraautoris',
      is_audio: 1,
      authors: [{slug: 'lrt-klasika', name: 'LRT KLASIKA', author_id: 2811260}],
      keywords: [
        {name: 'LRT Klasika', slug: 'lrt-klasika'},
        {name: 'Tendencingai', slug: 'tendencingai'},
      ],
      category_title: 'Tendencingai',
      item_date_iso8601: '2026-09-23T07:05:00Z',
    } as unknown as ArticleContent;

    expect(articleToTrackingParams(article)?.smartocto).toEqual({
      url: 'https://www.lrt.lt/radioteka/irasas/2000872059/kauno-zalgirio-prekes-zenklo-atnaujinimo-bendraautoris',
      pageType: 'article',
      postId: '3061155',
      title: 'Kauno „Žalgirio“ prekės ženklo atnaujinimo bendraautoris',
      authors: 'LRT KLASIKA',
      sections: 'Radioteka>Tendencingai',
      tags: 'LRT Klasika, Tendencingai',
      pubdate: '2026-09-23T07:05:00.000Z',
      articleType: 'audio',
    });
  });

  it('mirrors lrt.lt metadata of a mediateka article', () => {
    const article = {
      id: 3061180,
      title: 'Neimantas apie JAV politiką dėl trąšų',
      url: '/mediateka/irasas/2000872064/neimantas-apie-jav-politika-del-trasu',
      is_video: 1,
      authors: [],
      keywords: [],
      category_title: 'Žvilgtelk',
      item_date_iso8601: '2026-09-23T09:10:00Z',
    } as unknown as ArticleContent;

    expect(articleToTrackingParams(article)?.smartocto).toMatchObject({
      postId: '3061180',
      authors: '',
      sections: 'Mediateka>Žvilgtelk',
      tags: '',
      pubdate: '2026-09-23T09:10:00.000Z',
      articleType: 'video',
    });
  });
});

describe('landing pages', () => {
  it('mirrors lrt.lt news site landing pages', () => {
    expect(newsLandingPage('https://www.lrt.lt/', 'LRT')).toMatchObject({
      url: 'https://www.lrt.lt/',
      pageType: 'landing',
      authors: 'redaction',
      sections: 'lrt',
      articleType: 'landing',
    });
    expect(newsLandingPage('https://www.lrt.lt/naujienos/lietuvoje', 'Lietuvoje - LRT').sections).toBe(
      'naujienos>lietuvoje',
    );
    expect(newsLandingPage('https://www.lrt.lt/orai/vilnius', 'Orai').sections).toBe('orai>vilnius');
  });

  it('mirrors lrt.lt mediateka web app landing pages', () => {
    expect(
      mediaLandingPage(
        'https://www.lrt.lt/mediateka/tiesiogiai/lrt-televizija',
        'LRT TELEVIZIJA',
        'Tiesiogiai',
      ),
    ).toEqual({
      url: 'https://www.lrt.lt/mediateka/tiesiogiai/lrt-televizija',
      title: 'LRT TELEVIZIJA',
      pageType: 'landing',
      postId: 'landing:/mediateka/tiesiogiai/lrt-televizija',
      sections: 'Landing>Tiesiogiai',
      pubdate: '1970-01-01T00:00:00Z',
    });
  });

  it.each([
    ['/naujienos/lietuvoje', 'https://www.lrt.lt/naujienos/lietuvoje'],
    ['https://www.lrt.lt/naujienos/lietuvoje/', 'https://www.lrt.lt/naujienos/lietuvoje'],
    ['https://lrt.lt/naujienos/sportas?utm=x', 'https://www.lrt.lt/naujienos/sportas'],
    ['https://www.lrt.lt/', 'https://www.lrt.lt/'],
    ['https://epika.lrt.lt/', undefined],
    ['missing category url on suggestion', undefined],
    ['', undefined],
  ])('toLrtUrl(%p) is %p', (input, expected) => {
    expect(toLrtUrl(input)).toBe(expected);
  });
});

describe('trackPageView', () => {
  const fetchMock = jest.fn(() => Promise.resolve({status: 204}));
  const requests = () =>
    (fetchMock.mock.calls as unknown as string[][]).map(([url]) => {
      const [endpoint, query] = url.split('?');
      return {endpoint, params: Object.fromEntries(new URLSearchParams(query))};
    });

  const storedLifetimeId = (id?: string) => {
    const storage = (globalThis as Record<string, unknown>).__smartoctoStorage as Map<string, string>;
    if (id !== undefined) {
      storage.set('lifetime_id', id);
    }
    return storage;
  };

  const page = newsLandingPage('https://www.lrt.lt/naujienos/lietuvoje', 'Lietuvoje - LRT');

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockClear();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sends a page view with the lrt.lt page metadata', () => {
    trackPageView(page, 'anonymous');

    expect(requests()).toHaveLength(1);
    const [{endpoint, params}] = requests();
    expect(endpoint).toBe('https://ingestion.smartocto.com/p');
    expect(params).toMatchObject({
      d: 'https://www.lrt.lt/naujienos/lietuvoje',
      f: '30520',
      c: 'Lietuvoje - LRT',
      a: 'redaction',
      e: 'naujienos>lietuvoje',
      j: 'free',
      k: 'landing',
      m: 'anonymous',
      n: 'landing',
      t: '0',
      ch: 'iOS',
      os_ver: '18.2',
      manuf: 'Apple',
    });
    expect(params.u).toMatch(/^\d{13}\.\d+(\.\d+)?$/);
    expect(params.ul).toMatch(/^\d{13}\.\d+(\.\d+)?$/);
  });

  it('keeps the visitor ids between page views and renews the session after 30 minutes', () => {
    trackPageView(page, 'anonymous');
    jest.advanceTimersByTime(29 * 60 * 1000);
    trackPageView(page, 'registered');
    jest.advanceTimersByTime(31 * 60 * 1000);
    trackPageView(page, 'registered');

    const [first, second, third] = requests().map(({params}) => params);
    expect(second.u).toBe(first.u);
    expect(second.ul).toBe(first.ul);
    expect(second.x).not.toBe(first.x);
    expect(second.m).toBe('registered');
    expect(third.u).not.toBe(first.u);
    expect(third.ul).toBe(first.ul);
  });

  it('renews the lifetime id after its two-year expiry', () => {
    trackPageView(page, 'anonymous');
    jest.advanceTimersByTime(LIFETIME_ID_TTL + 60 * 1000);
    trackPageView(page, 'anonymous');

    const [first, second] = requests().map(({params}) => params);
    expect(second.ul).not.toBe(first.ul);
  });

  it.each([
    'garbage',
    String(Date.now()), // creation time instead of the expiry timestamp
    '0.1', // long expired
    '.1', // missing expiry
  ])('recovers from a malformed or expired stored lifetime id %p', (storedId) => {
    storedLifetimeId(storedId);
    trackPageView(page, 'anonymous');

    const [{params}] = requests();
    expect(params.ul).toMatch(/^\d{13}\.\d+(\.\d+)?$/);
    expect(params.ul).not.toBe(storedId);
  });

  it('URL-encodes values like the web tracker', () => {
    trackPageView(
      {url: 'https://www.lrt.lt/a b', pageType: 'article', sections: 'naujienos>lietuvoje', title: 'Ą & B'},
      'anonymous',
    );
    const url = (fetchMock.mock.calls as unknown as string[][])[0][0];
    expect(url).toContain('d=https%3A%2F%2Fwww.lrt.lt%2Fa%20b');
    expect(url).toContain('e=naujienos%3Elietuvoje');
    expect(url).toContain('c=%C4%84%20%26%20B');
  });
});
