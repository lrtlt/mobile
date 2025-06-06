import {
  artcilesByCategory,
  articleGet,
  articleRecommendations,
  articlesByGenre,
  articlesByIds,
  articlesGetByTag,
  audiotekaGet,
  carPlaylistCategoryGet,
  carPlaylistLiveGet,
  carPlaylistNewestGet,
  carPlaylistPopularGet,
  carPlaylistRecommendedGet,
  categoryGet,
  categoryHomeGet,
  channelGet,
  counter,
  forecastGet,
  genreGet,
  getDailyQuestion,
  getMediatekaArticlesBySeason,
  getRadiotekaArticleByUrl,
  getRadiotekaArticlesBySeason,
  homeGet,
  liveFeedGet,
  mediatekaGet,
  mediatekaGetV2,
  menuGet,
  newestArticlesGet,
  opusPlaylistGet,
  popularArticlesGet,
  programGet,
  putDailyQuestionVote,
  radiotekaGet,
  searchArticles,
  weatherLocationsGet,
} from './Endpoints';
import {get, put} from './HttpClient';
import {
  ArticleContentResponse,
  ArticleRecommendationsResponse,
  ArticleSearchResponse,
  AudiotekaResponse,
  CarPlayCategoryResponse,
  CarPlaylistItem,
  CategoryArticlesResponse,
  ChannelResponse,
  DailyQuestionResponse,
  ForecastLocation,
  ForecastResponse,
  GenreResponse,
  HomeDataResponse,
  LiveFeedResponse,
  MediatekaDataResponse,
  MediatekaV2DataResponse,
  MenuResponse,
  NewestArticlesResponse,
  OpusPlaylistResponse,
  PopularArticlesResponse,
  ProgramResponse,
  RadiotekaArticle,
  RadiotekaResponse,
  SearchFilter,
  SearchResponse,
  SlugArticlesResponse,
  TVProgramResponse,
  VideoDataDefault,
  VideoDataLiveStream,
} from './Types';

export const fetchMenuItemsApi = () => get<MenuResponse>(menuGet());

export const fetchHomeApi = () => get<HomeDataResponse>(homeGet());

export const fetchMediatekaApi = () => get<MediatekaDataResponse>(mediatekaGet());

export const fetchMediatekaApiV2 = () => get<MediatekaV2DataResponse>(mediatekaGetV2());

export const fetchArticle = (articleId: number | string, isMedia?: boolean) =>
  get<ArticleContentResponse>(articleGet(articleId, isMedia));

export const fetchArticlesByTag = (tag: string, count: number) =>
  get<SlugArticlesResponse>(articlesGetByTag(tag, count));

export const fetchArticleSearch = (q: string, filter: SearchFilter) =>
  get<SearchResponse>(searchArticles(q, filter));

export const fetchArticlesByGenre = (genreId: number | string, count: number) =>
  get<ArticleSearchResponse>(articlesByGenre(genreId, count));

export const fetchVideoData = (streamUrl: string) => get<VideoDataLiveStream | VideoDataDefault>(streamUrl);

export const fetchChannel = (channelId: number | string) => get<ChannelResponse>(channelGet(channelId));

export const fetchProgramApi = () => get<ProgramResponse>(programGet());

export const fetchAudiotekaApi = () => get<AudiotekaResponse>(audiotekaGet());

export const fetchRadiotekaApi = () => get<RadiotekaResponse>(radiotekaGet());

export const fetchNewestApi = (page: number, count: number, date_max?: string, not_id?: string) =>
  get<NewestArticlesResponse>(newestArticlesGet(count, page, date_max, not_id));

export const fetchPopularApi = (page: number, count: number) =>
  get<PopularArticlesResponse>(popularArticlesGet(count, page));

export const fetchCategoryApi = (
  categoryId: number,
  page: number,
  count: number,
  date_max?: string,
  not_id?: string,
) => get<CategoryArticlesResponse>(categoryGet(categoryId, page, count, date_max, not_id));

export const fetchCategoryHome = (id: number) => get<HomeDataResponse>(categoryHomeGet(id));

export const fetchWeatherLocations = () => get<ForecastLocation[]>(weatherLocationsGet());

export const fetchForecast = (cityCode: string) => get<ForecastResponse>(forecastGet(cityCode));

export const fetchOpusPlaylist = () => get<OpusPlaylistResponse>(opusPlaylistGet());

export const fetchLiveFeed = (id: string | number, count: number, order: 'asc' | 'desc') =>
  get<LiveFeedResponse>(liveFeedGet(id, count, order));

export const fetchArticleRecommendations = (articleId: number | string) =>
  get<ArticleRecommendationsResponse>(articleRecommendations(articleId));

export const fetchArticlesByIds = (ids: string[]) => get<ArticleSearchResponse>(articlesByIds(ids));

export const setDailyQuestionVote = (questionId: number | string, choiceId: number | string) =>
  put<any>(putDailyQuestionVote(questionId, choiceId));

export const fetchDailyQuestion = (questionId: number | string) =>
  get<DailyQuestionResponse>(getDailyQuestion(questionId));

export const fetchCarNewestPlaylist = () => get<CarPlaylistItem[]>(carPlaylistNewestGet());

export const fetchCarPopularPlaylist = () => get<CarPlaylistItem[]>(carPlaylistPopularGet());

export const fetchCarRecommendedPlaylist = () => get<CarPlaylistItem[]>(carPlaylistRecommendedGet());

export const fetchartcilesByCategory = (categoryId: string | number, count: number) =>
  get<SearchResponse>(artcilesByCategory(categoryId, count));

export const fetchCategoryPlaylist = (id: string | number) =>
  get<CarPlayCategoryResponse>(carPlaylistCategoryGet(id));

export const fetchCarLivePlaylist = () => get<TVProgramResponse>(carPlaylistLiveGet());

export const fetchRadiotekaSeasonPlaylist = (seasonUrl: string, page: number, count: number) =>
  get<SearchResponse>(getRadiotekaArticlesBySeason(seasonUrl, page, count));

export const fetchMediatekaSeasonPlaylist = (seasonUrl: string, page: number, count: number) =>
  get<SearchResponse>(getMediatekaArticlesBySeason(seasonUrl, page, count));

export const fetchRadiotekaArticleByUrl = (url: string) =>
  get<RadiotekaArticle>(getRadiotekaArticleByUrl(url));

export const fetchGenre = (genreId: number | string) => get<GenreResponse>(genreGet(genreId));

export const fetchCounter = (id: number | string, url: string = 'https://www.lrt.lt', os: string) =>
  get<any>(counter(id, os), {
    headers: {
      Referer: url ?? 'https://www.lrt.lt/',
    },
  });
