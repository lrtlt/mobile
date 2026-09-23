import {HomeV3Article, HomeV3BlockType, HomeV3BlockWithTitle} from '../../../../api/Types';
import {useNavigationStore} from '../../../../state/navigation_store';

export type HomeV3BlockVariant =
  | 'top_articles'
  | 'top_feed'
  | 'channels'
  | 'top_articles_list'
  | 'most_read'
  | 'slug_banner'
  | 'slug_featured'
  | 'opinions'
  | 'single_article'
  | 'category_list'
  | 'media'
  | 'legacy';

/** Picks the web layout a home v3 block is drawn with. */
export const getBlockVariant = (block: HomeV3BlockType): HomeV3BlockVariant => {
  switch (block.type) {
    case 'top_articles1-9':
      return 'top_articles';
    case 'top_feed':
      return 'top_feed';
    case 'channels':
      return 'channels';
    case 'top_articles10-15':
      return 'top_articles_list';
    case 'articles_list':
      return 'most_read';
    case 'block_with_title':
      return 'media';
    case 'slug': {
      switch (getTemplateId(block)) {
        case 63:
          return 'slug_banner';
        case 18:
          return 'slug_featured';
        default:
          return 'category_list';
      }
    }
    case 'category': {
      switch (getTemplateId(block)) {
        case 17:
          return 'opinions';
        case 16:
          return 'single_article';
        case 18:
          return 'slug_featured';
        default:
          return 'category_list';
      }
    }
    default:
      return 'legacy';
  }
};

export type BlockSeparator = 'space' | 'line';

/**
 * What goes between two blocks. The web groups consecutive category lists, the media
 * shelves (Mediateka, Radioteka, Epika) and the opinions panel next to a featured topic
 * into one section without a divider line.
 */
export const getBlockSeparator = (leading: HomeV3BlockType, trailing: HomeV3BlockType): BlockSeparator => {
  const a = getBlockVariant(leading);
  const b = getBlockVariant(trailing);

  if (a === 'top_feed') {
    // The feed draws its own bottom border.
    return 'space';
  }
  if (a === 'category_list' && b === 'category_list') {
    return 'space';
  }
  if (a === 'slug_featured' && b === 'opinions') {
    return 'space';
  }
  if (a === 'media' && b === 'media') {
    return 'space';
  }
  return 'line';
};

export type MediaKind = 'video' | 'audio' | 'epika';

/** Which shelf a media block is: Mediateka (video), Radioteka (audio) or Epika. */
export const getMediaKind = (block: HomeV3BlockWithTitle): MediaKind => {
  if (block.is_epika) {
    return 'epika';
  }
  if (block.data.block_url?.startsWith('/radioteka')) {
    return 'audio';
  }
  return 'video';
};

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Relative publish time as lrt.lt shows it: "Prieš 3 min.", "Prieš 2 val.", "Prieš 4 d.",
 * "Prieš 1 sav.", "Prieš 1 mėn.".
 *
 * Computed from `unix_time` so a cached response still reads correctly; the API's
 * pre-computed `time_diff*` fields are relative to when the response was generated.
 */
export const getRelativeTimeText = (article: HomeV3Article, now: number = Date.now()): string | undefined => {
  const unixTime = Number(article.unix_time);
  if (!unixTime) {
    return getApiRelativeTimeText(article);
  }

  const diff = Math.max(0, Math.floor(now / 1000) - unixTime);
  if (diff < HOUR) {
    return `Prieš ${Math.max(1, Math.floor(diff / MINUTE))} min.`;
  }
  if (diff < DAY) {
    return `Prieš ${Math.floor(diff / HOUR)} val.`;
  }
  const days = Math.floor(diff / DAY);
  if (days < 7) {
    return `Prieš ${days} d.`;
  }
  if (days < 28) {
    return `Prieš ${Math.floor(days / 7)} sav.`;
  }
  if (days < 365) {
    return `Prieš ${Math.max(1, Math.floor(days / 30))} mėn.`;
  }
  return `Prieš ${Math.floor(days / 365)} m.`;
};

const getApiRelativeTimeText = (article: HomeV3Article): string | undefined => {
  if (article.time_diff) {
    return `Prieš ${article.time_diff} min.`;
  }
  if (article.time_diff_hour) {
    return `Prieš ${article.time_diff_hour} val.`;
  }
  if (article.time_diff_day) {
    return `Prieš ${article.time_diff_day} d.`;
  }
  if (article.time_diff_week) {
    return `Prieš ${article.time_diff_week} sav.`;
  }
  if (article.time_diff_month) {
    return `Prieš ${article.time_diff_month} mėn.`;
  }
  if (article.time_diff_year) {
    return `Prieš ${article.time_diff_year} m.`;
  }
  return article.item_date;
};

/** The API marks articles whose image the web layout leaves out. */
export const hasImage = (article: HomeV3Article) => !article._skip_image;

/** Photo count / play badges drawn over the image. */
export const hasPhotoBadges = (article: HomeV3Article) =>
  Boolean(article._view_badge) && !article.no_badges_on_photo;

export const isVideoArticle = (article: HomeV3Article) => Boolean(article.is_video) && !article.is_audio;

export const isMediaArticle = (article: HomeV3Article) =>
  Boolean(article.is_video) || Boolean(article.is_audio);

/** Block template ids arrive both as numbers and numeric strings. */
export const getTemplateId = (block: {template_id?: number | string}) => Number(block.template_id ?? 0);

const MORE_URL_ROUTES: Record<string, string> = {
  '/naujienos/naujausi': 'Naujausi',
  '/naujienos/skaitomiausi': 'Populiariausi',
};

/**
 * Opens the tab behind a "Daugiau" link of the newest / most read lists.
 * Returns false when the url has no matching tab.
 */
export const openMoreUrl = (url?: string | null): boolean => {
  const route = url ? MORE_URL_ROUTES[url] : undefined;
  if (!route) {
    return false;
  }
  useNavigationStore.getState().openCategoryByName(route);
  return true;
};
