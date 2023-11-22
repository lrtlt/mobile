import {Article as FeedArticle} from '../../Types';

//Route types from menu api
export const ROUTE_TYPE_HOME = 'home';
export const ROUTE_TYPE_CATEGORY = 'category';
export const ROUTE_TYPE_NEWEST = 'newest';
export const ROUTE_TYPE_POPULAR = 'popular';
export const ROUTE_TYPE_MEDIA = 'mediateka';
export const ROUTE_TYPE_AUDIOTEKA = 'audioteka';
export const ROUTE_TYPE_PAGE = 'page';
export const ROUTE_TYPE_CHANNELS = 'channels';
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

export type MenuItemChannels = {
  type: typeof ROUTE_TYPE_CHANNELS;
  name: string;
  items: {
    channel_id: number;
    channel_title: string;
  }[];
};

export type MenuResponse = {
  logo?: string;
  main_menu: (MenuItem | MenuItemCategory | MenuItemPage | MenuItemChannels | MenuItemProjects)[];
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
  proc: string;
  time_start: string;
  time_end: string;
  href: string;
  stream_embed: string;
  photo: string;
  photo_id: number;
  w_h: string;
  web_permanent?: 1 | null;
};

export type HomeChannels = {
  items: TVChannel[];
  live_items?: LiveChannel[];
};

export type HomeBlockArticle = {
  type: 'article';
  article: FeedArticle;
};

export type HomeBlockTopArticles = {
  type: 'top_articles';
  articles: FeedArticle[];
};

export type HomeBlockChannels = {
  type: 'channels';
  data: HomeChannels;
};

/** @deprecated */
export type HomeBlockFeedBlock = {
  type: 'articles_block';
  articles_list: FeedArticle[];
  template_id: 999;
  block_title: string;
};

export type HomeBlockTopFeedBlock = {
  //TODO: remove this template after audioteka api update
  template: 'top_feed';
  type: 'top_feed';
  articles: FeedArticle[];
};

export type HomeBlockEmbed = {
  type: 'embed';
  name: string;
  html: string;
};

export type HomeBlockCategory = {
  type: 'category';
  template_id: number;
  data: {
    articles_list: FeedArticle[];
    category_url: string;
    category_id: number;
    template_id: number;
    category_title: string;
  };
};

export type HomeBlockDailyQuestion = {
  type: 'daily_question';
  data: DailyQuestionResponse;
};

export type HomeBlockSlug = {
  type: 'slug';
  template_id: number;
  background_image?: string;
  data: {
    is_slug_block: 1;
    articles_list: FeedArticle[];
    template_id: number;
    slug_title: string;
    slug_url: string;
  };
};

export type HomeBlockType =
  | HomeBlockArticle
  | HomeBlockTopArticles
  | HomeBlockChannels
  | HomeBlockEmbed
  | HomeBlockCategory
  | HomeBlockSlug
  | HomeBlockFeedBlock
  | HomeBlockTopFeedBlock
  | HomeBlockDailyQuestion
  | AudiotekaTopUrlList;

export type HomeDataResponse = {
  homepage_data: HomeBlockType[];
};

export type MediatekaDataResponse = HomeBlockType[];

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
  searchExactPhrase: boolean;
  searchOnlyHeritage: boolean;
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

export type URLTypeCategory = {
  url_type: 'category';
  title: string;
  category_href: string;
  category_id: number;
};

export type URLTypeTag = {
  url_type: 'tag';
  title: string;
  tag_slug: string;
};

export type URLTypeExternalURL = {
  url_type: 'webpage';
  title: string;
  url: string;
};

export type AudiotekaResponse = AudiotekaTemplate[];

export type AudiotekaTemplate =
  | AudiotekaTopUrlList
  | AudiotekaTopArticle
  | AudiotekaNewest
  | AudiotekaPopular
  | AudiotekaPodcasts
  | AudiotekaCategory
  | HomeBlockTopFeedBlock
  | AudiotekaSlug;

export type AudiotekaTopUrlList = {
  template: 'url_list';
  type: 'top_url_list';
  url_list: {
    id: number;
    title: string;
    items: (URLTypeCategory | URLTypeTag | URLTypeExternalURL)[];
  };
};

export type AudiotekaTopArticle = {
  template: 'top';
  article: FeedArticle;
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
  articles: FeedArticle[];
};

export type AudiotekaNewest = {
  template: 'newest';
  title: string;
  categories: AudiotekaNewestCategory[];
};

export type AudiotekaPopular = {
  template: 'popular';
  title: string;
  articles: FeedArticle[];
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
  articles_list: FeedArticle[];
};

export type AudiotekaSlug = {
  template: 'slug';
  is_slug_block: 1;
  articles_list: FeedArticle[];
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
  articles: FeedArticle[];
};

export type PopularArticlesResponse = {
  page: number;
  refresh: boolean;
  articles: FeedArticle[];
};

export type NewestArticlesResponse = {
  page: number;
  refresh: boolean;
  articles: FeedArticle[];
};

export type ArticlePhotoType = {
  title: string;
  path: string;
  w_h: string;
  author: string;
};

export type ArticleEmbedType =
  | ArticleEmbedPhotoType
  | ArticleEmbedArticleType
  | ArticleEmbedVideoType
  | ArticleEmbedAudioType
  | ArticleEmbedBroadcastType
  | ArticleEmbedHTMLType
  | ArticleEmbedPhotoalbumType
  | ArticleEmbedTimelineType;

export type ArticleEmbedPhotoType = {
  embed_type: 'photo';
  el: ArticlePhotoType;
};

export type ArticleEmbedArticleType = {
  embed_type: 'article';
  el: {
    id: number;
    title: string;
    date: string;
    url: string;
  };
};

export type ArticleEmbedVideoType = {
  embed_type: 'video';
  el: {
    article_id?: number;
    article_url?: string;
    date?: string;
    get_playlist_url?: string;
    get_streams_url?: string;
    img_path_postfix?: string;
    img_path_prefix?: string;
    is_video?: 1 | 0;
    photo_aspectratio: string;
    photo_id: number;
    record_offset?: number;
    title: string;
  };
};

export type ArticleEmbedAudioType = {
  embed_type: 'audio';
  el: {
    id: number;
    date: string;
    record_offset?: number;
    stream_url: string;
    title: string;
  };
};

export type ArticleEmbedHTMLType = {
  embed_type: 'html';
  long_content?: boolean;
  el: {
    html?: string;
    src?: string;
    is_timeline?: number;
  };
};

export type ArticleEmbedBroadcastType = {
  embed_type: 'broadcast';
  el: {
    channel: string;
    channel_id: number;
    title: string;
    get_streams_url: string;
    img_path_postfix?: string;
    img_path_prefix?: string;
    photo_id?: number;
    url?: string;
    w_h?: number;
  };
};

export type ArticleEmbedPhotoalbumType = {
  embed_type: 'photoalbum';
  el: {
    id: number;
    title: string;
    album_photos: ArticlePhotoType[];
  };
};

export type ArticleEmbedTimelineType = {
  embed_type: 'timeline';
  src: string;
};

export type ArticleContentDefault = {
  article_id: number;
  article_title: string;
  article_subtitle?: string;
  article_url?: string;
  article_date: string;
  article_summary: string;
  article_photos: ArticlePhotoType[];
  main_photo: ArticlePhotoType;
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
    embed?: ArticleEmbedType[];
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
  category_decription?: string;
  category_img_info?: {
    path: string;
    w_h: string;
  };
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
  keywords: {
    name: string;
    slug: string;
  }[];
  content: string;
  main_photo: ArticlePhotoType;
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

export const isVideoLiveStream = (
  response: VideoDataDefault | VideoDataLiveStream,
): response is VideoDataLiveStream => {
  return Boolean((response as VideoDataLiveStream)?.response?.data);
};

export const isLiveChannel = (channel: TVChannel | LiveChannel): channel is LiveChannel => {
  return Boolean((channel as LiveChannel).photo);
};

export type ArticleContent = ArticleContentDefault | ArticleContentMedia;

export type ArticleContentResponse = {
  article: ArticleContent;
};

export type ProgramItemType = {
  title: string;
  channel_title: string;
  proc: string;
  time_start: string;
  time_end: string;
  certification?: string;
  record_article_id?: string;
  description?: string;
  is_radio?: 0 | 1;
  allow_lt?: 0 | 1;
  block_all?: 0 | 1;
};

export type SingleDayProgram = {
  channel_id: number;
  title: string;
  prog: ProgramItemType[];
};

export type ProgramResponse = {
  all_programs: {
    days: any;
    [key: string]: SingleDayProgram[];
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
  prog: ProgramItemType[];
};

export type SearchCategorySuggestion = {
  category_id: number;
  category_title: string;
  is_audio: 0 | 1;
  is_video: 0 | 1;
};

export type SearchResponse = {
  page: number;
  q: string;
  total_found: string;
  items: FeedArticle[];
  similar_categories: SearchCategorySuggestion[];
};

export type SlugArticlesResponse = {
  articles: FeedArticle[];
  slug: {
    title: string;
    slug: string;
  };
};

export type OpusPlayListItem = {
  dt: string;
  song: string;
};

export type OpusPlaylistResponse = {
  rds: OpusPlayListItem[];
};

export type DailyQuestionChoice = {
  id: number;
  image?: string;
  name: string;
  percentage: number;
  votes: number;
};

export type DailyQuestionResponse = {
  id: number;
  title: string;
  votes: number;
  choices: DailyQuestionChoice[];
};

export interface LiveFeedResponse {
  'feed-items-left': number;
  'feed-items': LiveFeedItem[];
}
export interface LiveFeedItem {
  date_full: string;
  img_path_prefix?: string;
  article_id?: any;
  feed_item_type: string;
  feed_item_id: number;
  feed_item_content: string;
  time_diff_minutes: number;
  photo_id?: any;
  is_yesterday_date?: any;
  photo_info?: string;
  is_today_date?: any;
  badge_id?: any;
  photo_aspectratio?: any;
  badge_text?: any;
  feed_item_title?: string;
  img_path_postfix: string;
  embed?: string;
  articles?: LiveFeedArticle[];
}
export interface LiveFeedArticle {
  reactions: string;
  url: string;
  id: number;
  subtitle: string;
  badge_text?: string;

  category_url: string;
  category_title: string;
  item_date: string;
  title: string;
}
