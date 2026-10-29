import {ArticleContent, isDefaultArticle} from '../api/Types';

// Article, vodcast and podcast urls (the deep links in app/navigation/index.tsx) end with the article id and a title slug
const ARTICLE_URL_ID_PATTERN =
  /^(?:https?:\/\/(?:www\.)?lrt\.lt)?\/(?:naujienos\/[^/]+\/.+|mediateka\/irasas|radioteka\/irasas)\/(\d+)\/[^/?#]+\/?(?:[?#].*)?$/;

/**
 * Article id for analytics. lrt.lt reports the id in the article url, which may differ from the id
 * the API returns for the article, so the url id is used whenever the url has one.
 */
export const analyticsArticleId = (article: ArticleContent): string => {
  const [url, id] = isDefaultArticle(article)
    ? [article.article_url, article.article_id]
    : [article.url, article.id];
  return url?.match(ARTICLE_URL_ID_PATTERN)?.[1] ?? String(id);
};
