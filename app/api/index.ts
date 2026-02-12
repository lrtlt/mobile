import {
  artcilesByCategory,
  articleGet,
  articlesByGenre,
  carPlaylistCategoryGet,
  carPlaylistNewestGet,
  carPlaylistPopularGet,
  carPlaylistRecommendedGet,
  categoryGet,
  categoryHomeGet,
  counter,
  genreGet,
  getDailyQuestion,
  getMediatekaArticlesBySeason,
  getRadiotekaArticleByUrl,
  getRadiotekaArticlesBySeason,
  homeGet,
  liveFeedGet,
  mediatekaGetV2,
  menuGet,
  newestArticlesGet,
  popularArticlesGet,
  putDailyQuestionVote,
  radiotekaGet,
} from './Endpoints';
import {get, put} from './HttpClient';
import {
  ArticleContentResponse,
  ArticleSearchResponse,
  CarPlayCategoryResponse,
  CarPlaylistItem,
  CategoryArticlesResponse,
  DailyQuestionResponse,
  GenreResponse,
  HomeDataResponse,
  LiveFeedResponse,
  MediatekaV2DataResponse,
  Menu2Response,
  MenuResponse,
  NewestArticlesResponse,
  PopularArticlesResponse,
  RadiotekaArticle,
  RadiotekaResponse,
  SearchResponse,
} from './Types';

import {getFirestore} from '@react-native-firebase/firestore';

export const fetchMenuItemsApi = () => get<MenuResponse>(menuGet());

export const fetchHomeApi = () => get<HomeDataResponse>(homeGet());

export const fetchMediatekaApiV2 = () => get<MediatekaV2DataResponse>(mediatekaGetV2());

export const fetchArticle = (articleId: number | string, isMedia?: boolean) =>
  get<ArticleContentResponse>(articleGet(articleId, isMedia));

export const fetchArticlesByGenre = (genreId: number | string, count: number) =>
  get<ArticleSearchResponse>(articlesByGenre(genreId, count));

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

export const fetchLiveFeed = (id: string | number, count: number, order: 'asc' | 'desc') =>
  get<LiveFeedResponse>(liveFeedGet(id, count, order));

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

export const fetchMenuItemsV2 = async (): Promise<Menu2Response> => {
  const snapshot = await getFirestore().collection('internal').doc('app-menu-v2').get({source: 'server'});
  if (snapshot.exists()) {
    return snapshot.data() as Menu2Response;
  } else {
    throw new Error('Menu document not found');
  }
};
