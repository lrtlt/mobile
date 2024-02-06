import {
  articleGet,
  articlesGetByTag,
  audiotekaGet,
  categoryGet,
  channelGet,
  forecastGet,
  homeGet,
  liveFeedGet,
  mediatekaGet,
  menuGet,
  newestArticlesGet,
  opusPlaylistGet,
  popularArticlesGet,
  programGet,
  searchArticles,
  weatherLocationsGet,
} from './Endpoints';
import {get} from './HttpClient';
import {
  ArticleContentResponse,
  AudiotekaResponse,
  CategoryArticlesResponse,
  ChannelResponse,
  ForecastLocation,
  ForecastResponse,
  HomeDataResponse,
  LiveFeedResponse,
  MediatekaDataResponse,
  MenuResponse,
  NewestArticlesResponse,
  OpusPlaylistResponse,
  PopularArticlesResponse,
  ProgramResponse,
  SearchFilter,
  SearchResponse,
  SlugArticlesResponse,
  VideoDataDefault,
  VideoDataLiveStream,
} from './Types';

export const fetchMenuItemsApi = () => get<MenuResponse>(menuGet());

export const fetchHomeApi = () => get<HomeDataResponse>(homeGet());

export const fetchMediatekaApi = () => get<MediatekaDataResponse>(mediatekaGet());

export const fetchArticle = (articleId: number | string) =>
  get<ArticleContentResponse>(articleGet(articleId));

export const fetchArticlesByTag = (tag: string, count: number) =>
  get<SlugArticlesResponse>(articlesGetByTag(tag, count));

export const fetchArticleSearch = (q: string, filter: SearchFilter) =>
  get<SearchResponse>(searchArticles(q, filter));

export const fetchVideoData = (streamUrl: string) => get<VideoDataLiveStream | VideoDataDefault>(streamUrl);

export const fetchChannel = (channelId: number | string) => get<ChannelResponse>(channelGet(channelId));

export const fetchProgramApi = () => get<ProgramResponse>(programGet());

export const fetchAudiotekaApi = () => get<AudiotekaResponse>(audiotekaGet());

export const fetchNewestApi = (page: number, count: number, date_max?: string, not_id?: string) =>
  get<NewestArticlesResponse>(newestArticlesGet(count, page, date_max, not_id));

export const fetchPopularApi = (page: number, count: number, date_max?: string, not_id?: string) =>
  get<PopularArticlesResponse>(popularArticlesGet(count, page, date_max, not_id));

export const fetchCategoryApi = (
  categoryId: number,
  count: number,
  page: number,
  date_max?: string,
  not_id?: string,
) => get<CategoryArticlesResponse>(categoryGet(categoryId, count, page, date_max, not_id));

export const fetchWeatherLocations = () => get<ForecastLocation[]>(weatherLocationsGet());

export const fetchForecast = (cityCode: string) => get<ForecastResponse>(forecastGet(cityCode));

export const fetchOpusPlaylist = () => get<OpusPlaylistResponse>(opusPlaylistGet());

export const fetchLiveFeed = (id: string | number, count: number, order: 'asc' | 'desc') =>
  get<LiveFeedResponse>(liveFeedGet(id, count, order));
