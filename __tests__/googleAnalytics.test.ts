jest.mock('react-native', () => ({Platform: {OS: 'ios', Version: '18.2', constants: {}}}));
jest.mock('react-native-mmkv', () => ({createMMKV: () => ({})}));
jest.mock('@react-native-firebase/analytics', () => ({getAnalytics: jest.fn(), logEvent: jest.fn()}));

import {logEvent} from '@react-native-firebase/analytics';
import {logPageView, toParamValue} from '../app/util/googleAnalytics';

// Expected values are what lrt.lt sends to G-0HK3QSMV3W for the same pages
describe('logPageView', () => {
  beforeEach(() => jest.mocked(logEvent).mockClear());

  it('sends lrt.lt pages as page_view with the previous page as referrer', () => {
    logPageView('https://www.lrt.lt/naujienos/lietuvoje', 'Lietuvoje - LRT');
    logPageView(
      'https://www.lrt.lt/mediateka/tiesiogiai/lrt-televizija',
      'LRT TELEVIZIJA - Tiesiogiai - LRT',
    );

    expect(jest.mocked(logEvent).mock.calls.map(([, name, params]) => [name, params])).toEqual([
      ['page_view', {page_location: 'https://www.lrt.lt/naujienos/lietuvoje', page_title: 'Lietuvoje - LRT'}],
      [
        'page_view',
        {
          page_location: 'https://www.lrt.lt/mediateka/tiesiogiai/lrt-televizija',
          page_title: 'LRT TELEVIZIJA - Tiesiogiai - LRT',
          page_referrer: 'https://www.lrt.lt/naujienos/lietuvoje',
        },
      ],
    ]);
  });

  it('sends the content type and id of articles', () => {
    logPageView(
      'https://www.lrt.lt/naujienos/lietuvoje/2/3061211/konstitucinis-teismas',
      'Konstitucinis Teismas - LRT',
      {
        type: 'text',
        id: '3061211',
      },
    );

    expect(jest.mocked(logEvent).mock.calls[0][2]).toMatchObject({
      content_type: 'text',
      content_id: '3061211',
    });
  });

  it('skips screens without an lrt.lt page', () => {
    logPageView('Lrt app - Bookmarks', 'Lrt app - Bookmarks');
    logPageView('https://example.com/page', 'Example - LRT');

    expect(logEvent).not.toHaveBeenCalled();
  });
});

describe('toParamValue', () => {
  it('keeps values of up to 100 characters', () => {
    const url = 'https://www.lrt.lt/naujienos/lietuvoje/2/2345678/seimas-pritare-pataisoms';
    expect(toParamValue(url)).toBe(url);
  });

  it.each([
    [
      'https://www.lrt.lt/naujienos/lietuvoje/2/2345678/seimas-pritare-pataisoms-kurios-leis-savivaldybems-patiems-spresti-del-vietines-rinkliavos',
      'https://www.lrt.lt/naujienos/lietuvoje/2/2345678',
    ],
    [
      'https://www.lrt.lt/mediateka/irasas/2000123456/labas-rytas-lietuva-pokalbis-su-ekonomistu-apie-infliacija-ir-busto-kainas-sostineje',
      'https://www.lrt.lt/mediateka/irasas/2000123456',
    ],
    [
      'https://www.lrt.lt/radioteka/irasas/2000654321/ryto-garsai-pokalbis-apie-klimato-kaita-ir-jos-poveiki-baltijos-jurai',
      'https://www.lrt.lt/radioteka/irasas/2000654321',
    ],
  ])('drops the title slug of long deep link urls: %s', (url, expected) => {
    expect(toParamValue(url)).toBe(expected);
  });

  it('cuts other long values at 100 characters', () => {
    const title = 'Seimas pritarė pataisoms, kurios leis savivaldybėms pačioms spręsti dėl vietinės rinkliavos dydžio - LRT';
    expect(toParamValue(title)).toBe(title.slice(0, 100));
  });
});

describe('logPageView with long values', () => {
  beforeEach(() => jest.mocked(logEvent).mockClear());

  it('sends the trimmed url as page_location and as the next page_referrer', () => {
    const url =
      'https://www.lrt.lt/naujienos/lietuvoje/2/2345678/seimas-pritare-pataisoms-kurios-leis-savivaldybems-patiems-spresti-del-vietines-rinkliavos';
    const trimmed = 'https://www.lrt.lt/naujienos/lietuvoje/2/2345678';
    logPageView(url, 'x'.repeat(150));
    logPageView('https://www.lrt.lt/naujienos/lietuvoje', 'Lietuvoje - LRT');

    const [[, , first], [, , second]] = jest.mocked(logEvent).mock.calls;
    expect(first).toMatchObject({page_location: trimmed, page_title: 'x'.repeat(100)});
    expect(second).toMatchObject({page_referrer: trimmed});
  });
});
