import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ArticleContent, Author, Keyword, isDefaultArticle} from '../../api/Types';
import {sectionsFromPath} from '../../util/smartocto';

type Params = {
  article?: ArticleContent;
  /** Set to false for articles rendered but not on screen, e.g. neighbour pages of a pager. */
  enabled?: boolean;
};

const useArticleAnalytics = ({article, enabled = true}: Params) => {
  //Send navigation analytics
  const params = enabled ? articleToTrackingParams(article) : undefined;
  useNavigationAnalytics(params);
};

// lrt.lt lists only the author name, without the affiliation: "Jūratė Skėrytė, BNS" → "Jūratė Skėrytė"
const formatAuthors = (authors?: Author[]) =>
  authors?.map((author) => author.name.split(',')[0].trim()).join(', ');

const formatTags = (keywords?: Keyword[]) => keywords?.map((keyword) => keyword.name).join(', ');

export const articleToTrackingParams = (article?: ArticleContent): TrackingParams | undefined => {
  if (!article) {
    return undefined;
  }

  if (isDefaultArticle(article)) {
    const url = `https://www.lrt.lt${article.article_url}`;
    return {
      viewId: url,
      title: `${article.article_title} - LRT`,
      smartocto: {
        url,
        pageType: 'article',
        postId: String(article.article_id),
        title: article.article_title,
        authors: formatAuthors(article.article_authors),
        sections: sectionsFromPath(article.category_url ?? ''),
        tags: formatTags(article.article_keywords),
        pubdate: article.item_date_iso8601,
        articleType: 'news',
      },
    };
  } else {
    // Radioteka or Mediateka
    const section = article.is_audio === 1 ? 'Radioteka' : 'Mediateka';
    const url = `https://www.lrt.lt${article.url}`;
    return {
      viewId: url,
      title: `${article.title} - ${section} - LRT`,
      smartocto: {
        url,
        pageType: 'article',
        postId: String(article.id),
        title: article.title,
        authors: formatAuthors(article.authors),
        sections: `${section}>${article.category_title}`,
        tags: formatTags(article.keywords),
        // Mediateka web app formats the date with Date.toISOString()
        pubdate: article.item_date_iso8601 ? new Date(article.item_date_iso8601).toISOString() : undefined,
        articleType: article.is_audio === 1 ? 'audio' : 'video',
      },
    };
  }
};

export default useArticleAnalytics;
