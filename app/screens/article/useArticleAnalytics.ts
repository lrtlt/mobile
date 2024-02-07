import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ArticleContent, isDefaultArticle} from '../../api/Types';

type Params = {
  article?: ArticleContent;
};

const useArticleAnalytics = ({article}: Params) => {
  const params = articleToTrackingParams(article);
  useNavigationAnalytics(params);
};

const articleToTrackingParams = (article?: ArticleContent): TrackingParams | undefined => {
  if (!article) {
    return undefined;
  }

  if (isDefaultArticle(article)) {
    return {
      viewId: `https://www.lrt.lt${article.article_url}`,
      title: `${article.article_title} - LRT`,
      authors: article.article_authors?.map((author) => author.name) ?? undefined,
      sections: !!article.category_title ? [article.category_title] : undefined,
    };
  } else {
    return {
      viewId: `https://www.lrt.lt${article.url}`,
      title: `${article.title} - LRT`,
      authors: article.authors?.map((author) => author.name) ?? undefined,
      sections: !!article.category_title ? [article.category_title] : undefined,
    };
  }
};

export default useArticleAnalytics;
