import {ArticleContent} from '../app/api/Types';
import {analyticsArticleId} from '../app/analytics/analyticsArticleId';

describe('analyticsArticleId', () => {
  it.each([
    [
      'a news article',
      {article_id: 3061211, article_url: '/naujienos/lietuvoje/2/3061211/konstitucinis-teismas'},
      '3061211',
    ],
    [
      'a news article whose url id differs from the api id',
      {article_id: 1, article_url: '/naujienos/lietuvoje/2/3061211/konstitucinis-teismas'},
      '3061211',
    ],
    [
      'a radioteka item',
      {id: 3061155, url: '/radioteka/irasas/2000872059/kauno-zalgirio-prekes-zenklo'},
      '2000872059',
    ],
    [
      'a mediateka item',
      {id: 3061180, url: '/mediateka/irasas/2000872064/neimantas-apie-jav-politika'},
      '2000872064',
    ],
    ['a url with a query', {id: 1, url: '/mediateka/irasas/2000872064/slug?autoplay=1#t'}, '2000872064'],
    ['a url without an id', {id: 3061180, url: '/mediateka/tiesiogiai/lrt-televizija'}, '3061180'],
    [
      'a url without a title slug',
      {article_id: 3061211, article_url: '/naujienos/lietuvoje/2/99'},
      '3061211',
    ],
    ['a missing url', {article_id: 3061211}, '3061211'],
  ])('analytics id of %s', (_, article, expected) => {
    expect(analyticsArticleId(article as unknown as ArticleContent)).toBe(expected);
  });
});
