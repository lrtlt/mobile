import {Article as FeedArticle} from '../../Types';

export const MENU_TYPE_HOME = 'home';
export const MENU_TYPE_SEARCH = 'search';
export const MENU_TYPE_SETTINGS = 'settings';
export const MENU_TYPE_BOOKMARKS = 'bookmarks';
export const MENU_TYPE_HISTORY = 'history';
export const MENU_TYPE_MEDIATEKA = 'mediateka';
export const MENU_TYPE_RADIOTEKA = 'radioteka';
export const MENU_TYPE_PROGRAM = 'program';
export const MENU_TYPE_WEATHER = 'weather';
export const MENU_TYPE_CHANNELS = 'channels';
export const MENU_TYPE_CATEGORY = 'category';
export const MENU_TYPE_SLUG = 'slug';
export const MENU_TYPE_PAGE = 'page';
export const MENU_TYPE_WEBPAGE = 'webpage';
export const MENU_TYPE_SIMPLE = 'simple';
export const MENU_TYPE_EXPANDABLE = 'expandable';
export const MENU_TYPE_GROUP = 'group';

// Extra menu types, that are not included in menu API
export const MENU_TYPE_NEWEST = 'newest';
export const MENU_TYPE_POPULAR = 'popular';

export const SEARCH_TYPE_ALL = 0;
export const SEARCH_TYPE_NEWS = 1;
export const SEARCH_TYPE_AUDIO = 2;
export const SEARCH_TYPE_VIDEO = 3;
export const SEARCH_TYPE_VIDEO_SUBTITLES = 4;

export type Menu2Response = {items: Menu2Item[]};

export type Menu2Item =
  | Menu2ItemHome
  | Menu2ItemSearch
  | Menu2ItemSettings
  | Menu2ItemBookmarks
  | Menu2ItemHistory
  | Menu2ItemChannels
  | Menu2ItemMediateka
  | Menu2ItemRadioteka
  | Menu2ItemProgram
  | Menu2ItemWeather
  | Menu2ItemWebpage
  | Menu2ItemCategory
  | Menu2ItemSlug
  | Menu2ItemPage
  | Menu2ItemNewest
  | Menu2ItemPopular
  | Menu2ItemExpandable
  | Menu2ItemSimple
  | Menu2ItemGroup;

export type Menu2ItemHome = {
  type: typeof MENU_TYPE_HOME;
  title: string;
  url: string;
};

export type Menu2ItemSearch = {
  type: typeof MENU_TYPE_SEARCH;
  title: string;
  url: string;
};

export type Menu2ItemSettings = {
  type: typeof MENU_TYPE_SETTINGS;
  title: string;
};

export type Menu2ItemChannels = {
  type: typeof MENU_TYPE_CHANNELS;
  title: string;
};

export type Menu2ItemBookmarks = {
  type: typeof MENU_TYPE_BOOKMARKS;
  title: string;
};

export type Menu2ItemPopular = {
  type: typeof MENU_TYPE_POPULAR;
  title: string;
};

export type Menu2ItemNewest = {
  type: typeof MENU_TYPE_NEWEST;
  title: string;
};

export type Menu2ItemHistory = {
  type: typeof MENU_TYPE_HISTORY;
  title: string;
};

export type Menu2ItemMediateka = {
  type: typeof MENU_TYPE_MEDIATEKA;
  title: string;
  url: string;
};

export type Menu2ItemRadioteka = {
  type: typeof MENU_TYPE_RADIOTEKA;
  title: string;
  url: string;
};

export type Menu2ItemProgram = {
  type: typeof MENU_TYPE_PROGRAM;
  title: string;
  url: string;
};

export type Menu2ItemWeather = {
  type: typeof MENU_TYPE_WEATHER;
  title: string;
  url: string;
};

export type Menu2ItemWebpage = {
  type: typeof MENU_TYPE_WEBPAGE;
  title: string;
  url: string;
};

export type Menu2ItemSimple = {
  type: typeof MENU_TYPE_SIMPLE;
  title: string;
  url: string;
};

export type Menu2ItemCategory = {
  type: typeof MENU_TYPE_CATEGORY;
  title: string;
  url: string;
  category_id: number;
  hasHome?: boolean;
};

export type Menu2ItemSlug = {
  type: typeof MENU_TYPE_SLUG;
  title: string;
  url: string;
  slug: string;
};

export type Menu2ItemPage = {
  type: typeof MENU_TYPE_PAGE;
  title: string;
  url: string;
  categories: {
    id: number;
    name: string;
  }[];
};

export type Menu2ItemExpandable = {
  type: typeof MENU_TYPE_EXPANDABLE;
  title: string;
  items: Menu2Item[];
};

export type Menu2ItemGroup = {
  type: typeof MENU_TYPE_GROUP;
  title: string;
  items: Menu2Item[];
};

export type MenuItem = {
  type:
    | typeof MENU_TYPE_HOME
    | typeof MENU_TYPE_NEWEST
    | typeof MENU_TYPE_POPULAR
    | typeof MENU_TYPE_MEDIATEKA
    | typeof MENU_TYPE_RADIOTEKA;
  name: string;
};

export type MenuItemCategory = {
  type: typeof MENU_TYPE_CATEGORY;
  name: string;
  id: number;
  url: string;
  has_home_blocks?: boolean;
};

export type MenuItemProjects = {
  type: typeof MENU_TYPE_WEBPAGE;
  name: string;
  categories: {
    name: string;
    url: string;
  }[];
};

export type MenuItemPage = {
  type: typeof MENU_TYPE_PAGE;
  name: string;
  categories: {
    name: string;
    id: number;
  }[];
};

export type MenuItemChannels = {
  type: typeof MENU_TYPE_CHANNELS;
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

export type TVProgramResponse = {
  tvprog: {
    has_tvprog?: 0 | 1;
    items: TVProgramChannel[];
    live_items?: TVProgramChannel[];
  };
};

export type TVProgramChannel = Omit<TVChannel, 'certification' | 'get_streams_url'> & {
  description?: string;
  stream_url: string;
  app_logo: string;
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
  stream_embed?: string;
  get_streams_url: string;
  is_radio?: 0 | 1;
  block_all?: 0 | 1;
  allow_lt?: 0 | 1;
};

export type LiveChannel = {
  channel_id: number;
  channel: string;
  channel_title?: string;
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

export type HomeBlockVideoList = {
  type: 'vertical_video_list';
  template_id: number;
  data: {
    category_title?: string;
    slug_title?: string;
    category_id: number;
    articles_list: FeedArticle[];
  };
};

export type HomeBlockChannels = {
  type: 'channels';
  data: HomeChannels;
};

export type HomeBlockArticlesBlock = {
  type: 'articles_block';
  data: {
    articles_list: FeedArticle[];
    articles_list2: FeedArticle[];
  };
  template_id: 29;
};

export type HomeBlockEpikaBlock = {
  type: 'banner';
  template: 'epika_banner';
  data: {
    background_image: string;
    cta_title: string;
    cta_url: string;
    list: {
      href: string;
      image: string;
    }[];
  };
};

export type HomeBlockTopFeedBlock = {
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

export type HomeBlockArticlesByDate = {
  type: 'articles_list_by_date';
  template_id: number;
  articles_list: FeedArticle[];
};

export type HomeBlockType =
  | HomeBlockArticle
  | HomeBlockTopArticles
  | HomeBlockChannels
  | HomeBlockVideoList
  | HomeBlockEmbed
  | HomeBlockCategory
  | HomeBlockSlug
  | HomeBlockArticlesBlock
  | HomeBlockTopFeedBlock
  | HomeBlockDailyQuestion
  | HomeBlockEpikaBlock
  | AudiotekaTopUrlList
  | HomeBlockArticlesByDate;

export type HomeDataResponse = {
  homepage_data: HomeBlockType[];
};

export type MediatekaDataResponse = HomeBlockType[];

export type MediatekaBlockWidget = {
  widget_name: string;

  tmpl_id: 7;
  //24 - hero widget,
  //25 - horizontal list newest,
  //26 - horizontal list popular,
  widget_id: 24 | 25 | 26;
  'widget-data': {
    articles_list: FeedArticle[];
  };
};

export const isMediatekaBlockWidget = (data?: MediatekaBlockType): data is MediatekaBlockWidget => {
  const a = data as MediatekaBlockWidget | undefined;
  return a?.tmpl_id === 7;
};

export type MediatekaBlockBanner = {
  template_id: 6;
  html_embed_mobile: HomeBlockEpikaBlock;
};

export const isMediatekaBlockBanner = (data?: MediatekaBlockType): data is MediatekaBlockBanner => {
  const a = data as MediatekaBlockBanner | undefined;
  return a?.template_id === 6;
};

export type MediatekaBlockSlug = {
  is_slug_block: 1;
  slug_url: string;
  template_id: 53;
  slug_title: string;
  articles_list: FeedArticle[];
  select_opts: {
    slug: string;
    slug_id: number;
  };
};

export const isMediatekaBlockSlug = (data?: MediatekaBlockType): data is MediatekaBlockSlug => {
  const a = data as MediatekaBlockSlug | undefined;
  return a?.template_id === 53;
};

export type MediatekaBlockCategory = {
  // 22 - vertical short videos, 52 - horizontal list
  template_id: 52 | 22;
  category_id: number;
  category_url: string;
  category_title: string;
  articles_list: FeedArticle[];
};

export const isMediatekaBlockCategory = (data?: MediatekaBlockType): data is MediatekaBlockCategory => {
  const a = data as MediatekaBlockCategory | undefined;
  return a?.template_id === 52 || a?.template_id === 22;
};

export type MediatekaBlockType =
  | MediatekaBlockWidget
  | MediatekaBlockBanner
  | MediatekaBlockSlug
  | MediatekaBlockCategory;

export type MediatekaV2DataResponse = {
  homeblocks: MediatekaBlockType[];
};

export type SearchFilterTypes =
  | typeof SEARCH_TYPE_ALL
  | typeof SEARCH_TYPE_NEWS
  | typeof SEARCH_TYPE_AUDIO
  | typeof SEARCH_TYPE_VIDEO
  | typeof SEARCH_TYPE_VIDEO_SUBTITLES;

export type SearchOrderBy = 'NEW_FIRST' | 'OLD_FIRST';

export type SearchFilter = {
  type: SearchFilterTypes;
  section: string;
  orderBy?: SearchOrderBy;
  days: '' | '1' | '7' | '30';
  searchExactPhrase: boolean;
  searchOnlyHeritage: boolean;
};

export type VideoDataLiveStream = {
  response: {
    data: {
      content: string;
      content2?: string;
      audio?: string;
      restriction?: string;
    };
  };
};

export type VideoTextTrack = {
  src: string;
  srclang: string;
  kind: string;
  label: string;
  default: boolean;
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
    tracks?: VideoTextTrack[];
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

export type RadiotekaResponse = RadiotekaTemplate[];

export type RadiotekaTemplate =
  | RadiotekaTopArticlesBlock
  | RadiotekaSlugArticlesBlock
  | RadiotekaCategoryCollectionBlock
  | RadiotekaCategoryBlock
  | RadiotekaGenresBlock
  | RadiotekaPlaylistBlock;

export type RadiotekaTopArticlesBlock = {
  widget_id: 21;
  widget_name: string;
  type: 'articles_block';
  template_id: 7;
  data: {
    articles_list: FeedArticle[];
  };
};

export type RadiotekaCategoryBlock = {
  template_id: 25 | 42 | 43; // 25 - hero style, 42, 43 - horizontal list
  type: 'category';
  data: {
    category_id: number;
    category_url: string;
    category_title: string;
    articles_list: FeedArticle[];
  };
};

export type RadiotekaSlugArticlesBlock = {
  type: 'slug';
  template_id: 20;
  data: {
    template_id: 20;
    slug_url: string;
    articles_list: FeedArticle[];
    slug_title: string;
  };
};

export type RadiotekaPlaylistBlock = {
  type: 'audio_playlist';
  template_id: 38;
  data: {
    is_audio_playlist: 1;
    playlist_template_id: 38;
    playlist_items: FeedArticle[];
    playlist_article: RadiotekaCategoryDescription;
  };
};

export type RadiotekaGenresBlock = {
  type: 'audio_genre_collection';
  template_id: 51;
  data: {
    genre_list: Genre[];
    genres_collection_description: {
      article_id: number;
      article_type: number;
      article_title: string;
      category_id: number;
      category_url: string;
      category_title: string;
      article_authors: Author[];
      paragraphs: {p: string}[];
    };
  };
};

export type RadiotekaCategoryCollectionBlock = {
  type: 'audio_category_collection';
  template_id: 44 | 45 | 46;
  data: {
    description: RadiotekaCategoryDescription;
    category_list: RadiotekaCategory[];
  };
};

export type Genre = {
  genre_id: number;
  genre_url: string;
  genre_title: string;
  genre_slug?: string;
  slug?: string;
};

export type Author = {
  author_id: number;
  name: string;
  slug: string;
  author_photo: {
    title: string;
    w_h: string;
    path: string;
  };
};

export type RadiotekaCategoryDescription = {
  article_is_photogallery: 1 | 0 | null;
  badge_id: any;
  category_title: string;
  article_authors: Author[];
  article_date: string;
  article_url: string;
  article_summary: string;
  article_template: number;
  is_audio_category_collection?: 1 | 0 | null;
  article_type: number;
  article_title_formated?: 1 | 0 | null;
  category_id: number;
  badge_class: any;
  article_title: string;
  badges_html: any;
  paragraphs: {p: string}[];
  article_keywords: Keyword[];
  read_count: any;
  article_id: number;
  badge_title: any;
  category_url: string;
  main_photo: ArticlePhotoType;
  text2speech_file_url?: null | string;
};

export type RadiotekaCategory = {
  id: number;
  lrt_id: number;
  branch_info_ary?: {
    branch_term: string;
    branch_id: number;
    branch_title: string;
  }[];
  main_title: null;
  is_children_category: null;
  term: string;
  related_channel_id: any;
  lrt_description: string;
  lrt_season_id: any;
  lrt_code: string;
  category_images?: {
    img1?: {
      img_path_postfix: string;
      img_path: string;
      img_path_prefix: string;
      w_h: string;
    };
    img2?: {
      img_path_postfix: string;
      img_path: string;
      img_path_prefix: string;
      w_h: string;
    };
  };
  main_category_id: any;
  branch_info?: {
    branch_level2?: {
      branch_term: string;
      branch_id: number;
      branch_title: string;
    };
    branch_level1?: {
      branch_term: string;
      branch_id: number;
      branch_title: string;
    };
  };
  season_info: ArticleSeasonInfo[];
  lrt_show_id: number;
  title: string;
  LATEST_ITEM: ArticleContentMedia;
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
  | ArticleEmbedTimelineType
  | ArticleEmbedDailyQuestionType;

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

export type ArticleEmbedDailyQuestionType = {
  embed_type: 'daily_question';
  question_id: number;
  is_daily_question: 0 | 1;
};

export type CarPlaylistItem = {
  title: string;
  content: string;
  cover: string;
  streamUrl: string;
};

export type CarPlayPodcastsResponse = {
  total_found: number;
  items: CarPlayPodcastItem[];
};

export type CarPlayPodcastItem = {
  id: number;
  title: string;
};

export type CarPlayCategoryResponse = {
  articles: FeedArticle[];
  category_info: any;
  page: number;
  next_page: number | null;
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
  article_authors: Author[];
  article_keywords: Keyword[];
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
  age_restriction?: string | null;
  is_video?: 0 | 1;
  read_count?: number;
};

export type ArticleContentMedia = {
  id: number;
  title: string;
  subtitle?: string;
  article_is_heritage?: 0 | 1;
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
  age_restriction?: string | null;
  url?: string;
  authors: Author[];
  keywords: Keyword[];
  content: string;
  main_photo: ArticlePhotoType;
  'n-18'?: 0 | 1;
  is_video?: 0 | 1;
  is_audio?: 0 | 1;
  read_count?: number;
  media_duration: string;
  lrt_season_id?: string;
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
  category_info?: ArticleCategoryInfo;
};

export type ArticleCategoryInfo = {
  season_info: ArticleSeasonInfo[];
  genre_info?: Genre[];
  lrt_show_id: number;
  category_id: number;
  term: string;
  branch_info?: {
    branch_level2?: {
      branch_term: string;
      branch_id: number;
      branch_title: string;
    };
    branch_level1?: {
      branch_term: string;
      branch_id: number;
      branch_title: string;
    };
  };
};

export type ArticleSeasonInfo = {
  lrt_season_id: string;
  season_title: string;
  season_url: string;
  lrt_season_count: string;
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
  channel_id?: number;
  id?: number;
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
    channel_url: string;
    channel: string;
    title: string;
    get_streams_url: string;
    stream_embed: string;
    player_background_image: string;
    is_permanent?: 0 | 1;
    is_radio?: 0 | 1;
    daily_question?: string | number;
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
  can_vote: boolean;
  is_ended: boolean;
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

export type Keyword = {
  name: string;
  slug: string;
};

export type ArticleRecommendationsResponse = {
  result?: {
    items?: {
      id: string;
      score: number;
    }[];
    id: string;
  };
};

export type ArticleSearchItem = {
  id_pos: number;
  age_restriction?: string;
  title: string;
  year_interval: number;
  is_epika: 0 | 1;
  is_series: 0 | 1;
  is_video: 0 | 1;
  is_audio: 0 | 1;
  badges_html?: string;
  subtitle?: string;
  id: number;
  date: string;
  epika_valid_days?: string;
  season_url: string;
  photo: string;
  article_category_id: number;
  img_w_h: string;
  category_id: number;
  category_title: string;
  is_movie: 0 | 1;
  photo_id: number;
  url: string;
};

export type ArticleSearchResponse = {
  items: ArticleSearchItem[];
};

export type GenreResponse = {
  id: number;
  title: string;
  url: string;
  shows: GenreArticle[];
  related: {
    id: number;
    title: string;
    url: string;
  }[];
};

export type GenreArticle = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image: {
    prefix: string;
    postfix: string;
    title: string;
  };
  category: {
    title: string;
    url: string;
    id: number;
  };
};

export type RadiotekaArticle = {
  id: number;
  title: string;
  type: number;
  content: string;
  category_id: number;
  heritage: null;
  date: string;
  offset: number;
  tags: any[];
  url: string;
  full_url: string;
  playlist_item: {
    file: string;
    title: string;
    category: string;
    category_term?: string;
    image: string;
    mediaid: number;
    main_id: number;
    tracks?: [
      {
        src: string;
        kind: string;
        label: string;
        default: true;
      },
    ];
  };
};

export type AISearchResponse = {
  nextPageToken?: string;
  totalSize: number;
  results: AISearchResultItem[];
  summary: {
    summarySkippedReasons: any[];
    summaryText: string;
    safetyAttributes: any;
    summaryWithMetadata: any;
  };
  queryExpansionInfo: {
    expandedQuery: boolean;
    pinnedResultCount: string;
  };
  aiSummary: {
    text: string;
    citations: any[];
    state: string;
    answerQueryToken: string;
  };
};

export type VertexAIMediaType =
  | 'movie'
  | 'show'
  | 'concert'
  | 'event'
  | 'live-event'
  | 'broadcast'
  | 'tv-series'
  | 'episode'
  | 'video-game'
  | 'clip'
  | 'vlog'
  | 'audio'
  | 'audio-book'
  | 'music'
  | 'album'
  | 'articles'
  | 'news'
  | 'radio'
  | 'podcast'
  | 'book'
  | 'sports-game';

export type AISearchResultItem = {
  id: string;
  document: {
    id: string;
    name: string;
    uri: string;
    structData: {
      title: string;
      description: string;
      uri: string;
      content_rating: string[];
      in_languages: string[];
      categories: string[];
      country_of_origin: string;
      available_time: string;
      media_type: VertexAIMediaType;
      images: {
        name: string;
        uri: string;
        author: string;
      }[];
      persons: {
        role: string;
        name: string;
        uri: string;
        rank: number;
      }[];
    };
  };
};

export type AISummaryResponse = {
  query: string;
  overview: {
    summary: string;
    generatedAt: string;
  };
};

export type AIAutomcompleteResponse = {
  originalQuery: string;
  totalSuggestions: number;
  querySuggestions: {
    suggestion: string;
  }[];
};

export type AIUserEventType = 'view-item' | 'view-home-page' | 'media-play' | 'media-complete';

type ViewItemData = {
  documentId: string;
  attributes?: {
    source: string;
    category?: string;
  };
};

type ViewHomePageData = {
  attributes?: {
    source: string;
  };
};

type MediaPlayData = ViewItemData;
type MediaCompleteData = MediaPlayData;

export interface AIUserEventViewItem {
  type: 'view-item';
  data: ViewItemData;
}

export interface AIUserEventViewHomePage {
  type: 'view-home-page';
  data: ViewHomePageData;
}

export interface AIUserEventMediaPlay {
  type: 'media-play';
  data: MediaPlayData;
}

export interface AIUserEventMediaComplete {
  type: 'media-complete';
  data: MediaCompleteData;
}

export type AIUserEvent =
  | AIUserEventViewItem
  | AIUserEventViewHomePage
  | AIUserEventMediaPlay
  | AIUserEventMediaComplete;

export type AIUserEventResponse = {
  eventType: string;
  eventTime: string;
  userInfo: {
    userId: string;
    userAgent: string;
  };
  documents: {
    id: string;
    name: string;
    uri: string;
    quantity: number;
    promotionIds: string[];
  }[];
  searchInfo: {
    searchQuery: string;
    orderIds: string[];
  };
};

export type UserArticleHistoryResponse = {
  articles: {
    articleId: number;
    added_at: string;
  }[];
};
