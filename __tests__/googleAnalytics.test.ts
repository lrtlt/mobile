jest.mock('react-native', () => ({Platform: {OS: 'ios', Version: '18.2', constants: {}}}));
jest.mock('react-native-mmkv', () => ({createMMKV: () => ({})}));
jest.mock('@react-native-firebase/analytics', () => ({getAnalytics: jest.fn(), logEvent: jest.fn()}));

import {logEvent} from '@react-native-firebase/analytics';
import {logPageView} from '../app/util/googleAnalytics';

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

  it('skips screens without an lrt.lt page', () => {
    logPageView('Lrt app - Bookmarks', 'Lrt app - Bookmarks');
    logPageView('https://example.com/page', 'Example - LRT');

    expect(logEvent).not.toHaveBeenCalled();
  });
});
