const mockOpenCategoryByName = jest.fn();

jest.mock('../app/state/navigation_store', () => ({
  useNavigationStore: {getState: () => ({openCategoryByName: mockOpenCategoryByName})},
}));

import {HomeV3Article, HomeV3BlockType, HomeV3BlockWithTitle} from '../app/api/Types';
import {
  getBlockSeparator,
  getBlockVariant,
  getMediaKind,
  getRelativeTimeText,
  openMoreUrl,
} from '../app/screens/main/tabScreen/homeV3/util';

const NOW = Date.UTC(2026, 8, 21, 19, 58, 0);
const NOW_SEC = NOW / 1000;

const articleAt = (secondsAgo: number, extra: Partial<HomeV3Article> = {}) =>
  ({unix_time: NOW_SEC - secondsAgo, item_date: '2026.09.21 22:55', ...extra} as HomeV3Article);

const block = (type: string, template_id?: number | string) =>
  ({type, template_id, data: {}} as unknown as HomeV3BlockType);

describe('getRelativeTimeText', () => {
  it.each([
    [30, 'Prieš 1 min.'],
    [3 * 60, 'Prieš 3 min.'],
    [59 * 60, 'Prieš 59 min.'],
    [60 * 60, 'Prieš 1 val.'],
    [17 * 3600 + 1800, 'Prieš 17 val.'],
    [32 * 3600, 'Prieš 1 d.'],
    [6 * 86400, 'Prieš 6 d.'],
    [7.7 * 86400, 'Prieš 1 sav.'],
    [28.1 * 86400, 'Prieš 1 mėn.'],
    [65 * 86400, 'Prieš 2 mėn.'],
    [400 * 86400, 'Prieš 1 m.'],
  ])('%is ago -> %s', (secondsAgo, expected) => {
    expect(getRelativeTimeText(articleAt(secondsAgo), NOW)).toBe(expected);
  });

  it('falls back to the API time fields without unix_time', () => {
    expect(getRelativeTimeText({time_diff_hour: 4} as HomeV3Article, NOW)).toBe('Prieš 4 val.');
    expect(getRelativeTimeText({item_date: '2026.09.14 06:00'} as HomeV3Article, NOW)).toBe(
      '2026.09.14 06:00',
    );
  });
});

describe('getBlockVariant', () => {
  it.each([
    ['top_articles1-9', undefined, 'top_articles'],
    ['top_feed', 7, 'top_feed'],
    ['channels', 7, 'channels'],
    ['top_articles10-15', 7, 'top_articles_list'],
    ['articles_list', 7, 'most_read'],
    ['slug', '63', 'slug_banner'],
    ['slug', 18, 'slug_featured'],
    ['slug', 24, 'category_list'],
    ['category', 17, 'opinions'],
    ['category', 16, 'single_article'],
    ['category', 9, 'category_list'],
    ['block_with_title', 7, 'media'],
    ['embed', undefined, 'legacy'],
  ])('%s (template %s) -> %s', (type, template, expected) => {
    expect(getBlockVariant(block(type, template))).toBe(expected);
  });
});

describe('getBlockSeparator', () => {
  it('groups consecutive category and topic lists without a line', () => {
    expect(getBlockSeparator(block('category', 9), block('slug', 24))).toBe('space');
  });

  it('keeps opinions next to the featured topic', () => {
    expect(getBlockSeparator(block('slug', 18), block('category', 17))).toBe('space');
  });

  it('does not draw a line under the top feed', () => {
    expect(getBlockSeparator(block('top_feed'), block('top_articles1-9'))).toBe('space');
  });

  it('keeps the Mediateka, Radioteka and Epika shelves together', () => {
    expect(getBlockSeparator(block('block_with_title', 7), block('block_with_title', 7))).toBe('space');
    expect(getBlockSeparator(block('block_with_title', 7), block('embed'))).toBe('line');
  });

  it('separates other sections with a line', () => {
    expect(getBlockSeparator(block('category', 9), block('category', 16))).toBe('line');
    expect(getBlockSeparator(block('articles_list'), block('slug', 63))).toBe('line');
  });
});

describe('getMediaKind', () => {
  const shelf = (block_url: string, is_epika?: 1) =>
    ({
      type: 'block_with_title',
      is_epika,
      data: {block_title: '', block_url, articles_list: []},
    } as HomeV3BlockWithTitle);

  it('tells the shelves apart', () => {
    expect(getMediaKind(shelf('/mediateka'))).toBe('video');
    expect(getMediaKind(shelf('/radioteka'))).toBe('audio');
    expect(getMediaKind(shelf('https://epika.lrt.lt', 1))).toBe('epika');
  });
});

describe('openMoreUrl', () => {
  beforeEach(() => mockOpenCategoryByName.mockClear());

  it('opens the newest and most read tabs', () => {
    expect(openMoreUrl('/naujienos/naujausi')).toBe(true);
    expect(openMoreUrl('/naujienos/skaitomiausi')).toBe(true);
    expect(mockOpenCategoryByName.mock.calls).toEqual([['Naujausi'], ['Populiariausi']]);
  });

  it('ignores unknown urls', () => {
    expect(openMoreUrl('/tema/kita')).toBe(false);
    expect(openMoreUrl(undefined)).toBe(false);
    expect(mockOpenCategoryByName).not.toHaveBeenCalled();
  });
});
