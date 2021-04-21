import {Article} from '../../Types';

//Route types from menu api
export const ROUTE_TYPE_HOME = 'home';
export const ROUTE_TYPE_CATEGORY = 'category';
export const ROUTE_TYPE_NEWEST = 'newest';
export const ROUTE_TYPE_POPULAR = 'popular';
export const ROUTE_TYPE_MEDIA = 'mediateka';
export const ROUTE_TYPE_AUDIOTEKA = 'audioteka';
export const ROUTE_TYPE_PAGE = 'page';
export const ROUTE_TYPE_WEBPAGES = 'webpages';

export const SEARCH_TYPE_ALL = 0;
export const SEARCH_TYPE_NEWS = 1;
export const SEARCH_TYPE_AUDIO = 2;
export const SEARCH_TYPE_VIDEO = 3;
export const SEARCH_TYPE_VIDEO_SUBTITLES = 4;

export type MenuItem = {
  type:
    | typeof ROUTE_TYPE_HOME
    | typeof ROUTE_TYPE_NEWEST
    | typeof ROUTE_TYPE_POPULAR
    | typeof ROUTE_TYPE_MEDIA
    | typeof ROUTE_TYPE_AUDIOTEKA;
  name: string;
};

export type MenuItemCategory = {
  type: typeof ROUTE_TYPE_CATEGORY;
  name: string;
  id: number;
};

export type MenuItemProjects = {
  type: typeof ROUTE_TYPE_WEBPAGES;
  name: string;
  categories: {
    name: string;
    url: string;
  }[];
};

export type MenuItemPage = {
  type: typeof ROUTE_TYPE_PAGE;
  name: string;
  categories: {
    name: string;
    id: number;
  }[];
};

export type MenuResponse = {
  main_menu: (MenuItem | MenuItemCategory | MenuItemPage | MenuItemProjects)[];
};

/**
 * Channel type in home page
 */
export type TVChannel = {
  channel_id: number;
  channel: string;
  channel_title: string;
  title: string;
  cover_url: string;
  proc: string;
  certification: string;
  time_start: string;
  time_end: string;
  stream_embed: string;
  get_streams_url: string;
  is_radio?: 0 | 1;
  block_all?: 0 | 1;
  allow_lt?: 0 | 1;
};

export type LiveChannel = {
  channel_id: number;
  channel: string;
  title: string;
  get_streams_url: string;
  href: string;
  stream_embed: string;
  photo: string;
  photo_id: number;
  w_h: string;
};

export type HomeArticlesBlock = {
  template_id: number;
  block_title?: string;
  category_title?: string;
  slug_title?: string;
  slug_url?: string;
  is_slug_block?: 1 | 0;
  category_id?: number;
  articles_list: Article[];
};

export type HomeChannels = {
  items: TVChannel[];
  live_items?: LiveChannel[];
};

export type HomeDataResponse = {
  articles: Article[];
  tvprog: HomeChannels;
  articles_blocks: HomeArticlesBlock[];
};

export type SearchFilterTypes =
  | typeof SEARCH_TYPE_ALL
  | typeof SEARCH_TYPE_NEWS
  | typeof SEARCH_TYPE_AUDIO
  | typeof SEARCH_TYPE_VIDEO
  | typeof SEARCH_TYPE_VIDEO_SUBTITLES;

export type SearchFilter = {
  type: SearchFilterTypes;
  section: string;
  days: '' | '1' | '7' | '30';
};

export type VideoDataLiveStream = {
  response: {
    data: {
      content: string;
      content2?: string;
      content3?: string;
    };
  };
};

export type VideoDataDefault = {
  id: number;
  title: string;
  type: number;
  content: string;
  category_id: number;
  date: string;
  offset: number;
  tags: any[];
  url: string;
  full_url: string;
  playlist_item: {
    mediaid: number;
    file: string;
    title: string;
    image: string;
  };
};

export type AudiotekaResponse = AudiotekaTemplate[];

export type AudiotekaTemplate =
  | AudiotekaTopArticle
  | AudiotekaNewest
  | AudiotekaPopular
  | AudiotekaPodcasts
  | AudiotekaCategory
  | AudiotekaSlug;

export type AudiotekaTopArticle = {
  template: 'top';
  article: Article;
  backgroundImage?: string;
  icon?: string;
};

export type AudiotekaNewestCategory = {
  id: number;
  title: string;
  color: string;
  'color-active': string;
  'background-color-active': string;
  'background-color': string;
  articles: Article[];
};

export type AudiotekaNewest = {
  template: 'newest';
  title: string;
  categories: AudiotekaNewestCategory[];
};

export type AudiotekaPopular = {
  template: 'popular';
  title: string;
  articles: Article[];
};

export type Podcast = {
  id: number;
  title: string;
  backgroundImage: string;
  category_url: string;
  category_id: number;
};

export type AudiotekaPodcasts = {
  template: 'podcasts';
  title: string;
  podcasts: Podcast[];
};

export type AudiotekaCategory = {
  template: 'category';
  category_title: string;
  category_url: string;
  category_id: number;
  template_id: number;
  articles_list: Article[];
};

export type AudiotekaSlug = {
  template: 'slug';
  is_slug_block: 1;
  articles_list: Article[];
  slug_title: string;
  slug_url: string;
};

export type ForecastLocation = {
  n: string;
  c: string;
  ad: string;
};

export type Forecast = {
  location: {
    code: string;
    name: string;
  };
  forecast: {
    forecastTimeUtc: string;
    localDateTime: string;
    airTemperature: number;
    relativeHumidity: number;
    conditionCode: string;
  };
};

export type ForecastResponse = {
  current?: Forecast;
  default: Forecast;
};

export type CategoryArticlesResponse = {
  page: number;
  next_page: number;
  refresh: boolean;
  category_info: {
    url: string;
    category_id: number;
    category_title: string;
    term: string;
  };
  articles: Article[];
};

export type PopularArticlesResponse = {
  page: number;
  refresh: boolean;
  articles: Article[];
};

export type NewestArticlesResponse = {
  page: number;
  refresh: boolean;
  articles: Article[];
};

export type ArticlePhoto = {
  title: string;
  path: string;
  w_h: string;
  author: string;
};

export type ArticleContentDefault = {
  article_id: number;
  article_title: string;
  article_subtitle?: string;
  article_url?: string;
  article_date: string;
  article_summary: string;
  article_photos: ArticlePhoto[];
  main_photo: ArticlePhoto;
  article_authors: {
    name: string;
    slug: string;
  }[];
  article_keywords: {
    name: string;
    slug: string;
  }[];
  category_id?: number;
  category_url?: string;
  category_title?: string;
  text2speech_file_url?: string;
  reactions_count?: string;

  paragraphs: {
    p: string;
    embed?: any;
  }[];
  'n-18'?: 0 | 1;
  is_video?: 0 | 1;
};

export type ArticleContentMedia = {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  category_id: number;
  category_title: string;
  //Stream api url for video info
  get_playlist_url: string;
  //Stream url for audio
  stream_url: string;
  age_restriction: string;
  url?: string;
  authors: {
    name: string;
    slug: string;
  }[];
  content: string;
  main_photo: ArticlePhoto;
  'n-18'?: 0 | 1;
  is_video?: 0 | 1;
  is_audio?: 0 | 1;
};

export const isMediaArticle = (article?: ArticleContent): article is ArticleContentMedia => {
  const a = article as ArticleContentMedia | undefined;
  return Boolean(a?.id);
};

export const isDefaultArticle = (article?: ArticleContent): article is ArticleContentDefault => {
  const a = article as ArticleContentDefault | undefined;
  return Boolean(a?.article_id);
};

export type ArticleContent = ArticleContentDefault | ArticleContentMedia;

export type ArticleContentResponse = {
  article: ArticleContent;
};

export type ProgramItem = {
  title: string;
  channel_title: string;
  proc: string;
  time_start: string;
  time_end: string;
  is_radio?: 0 | 1;
  allow_lt?: 0 | 1;
  block_all?: 0 | 1;
};

export type ProgramResponse = {
  all_programs: {
    days: any;
    [key: string]: {
      channel_id: number;
      title: string;
      certification: string;
      prog: ProgramItem[];
    };
  };
};

export type ChannelResponse = {
  channel_info: {
    channel_id: number;
    channel: string;
    title: string;
    get_streams_url: string;
    stream_embed: string;
    player_background_image: string;
    is_permanent?: 0 | 1;
    is_radio?: 0 | 1;
  };
  prog: ProgramItem[];
};

export type SearchResponse = {
  page: number;
  q: string;
  total_found: string;
  items: Article[];
};

export type SlugArticlesResponse = {
  articles: Article[];
  slug: {
    title: string;
    slug: string;
  };
};
