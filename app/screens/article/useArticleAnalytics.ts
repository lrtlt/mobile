import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ArticleContent, isDefaultArticle} from '../../api/Types';

type Params = {
  article?: ArticleContent;
};

const useArticleAnalytics = ({article}: Params) => {
  //Send navigation analytics
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
      sections: !!article.category_title ? ['Naujienos', article.category_title] : ['Naujienos'],
    };
  } else {
    if (article.is_audio === 1) {
      // Radioteka
      return {
        viewId: `https://www.lrt.lt${article.url}`,
        title: `${article.title} - Radioteka - LRT`,
        authors: article.authors?.map((author) => author.name) ?? undefined,
        sections: !!article.category_title ? ['Radioteka', article.category_title] : ['Radioteka'],
      };
    } else {
      // Mediateka
      return {
        viewId: `https://www.lrt.lt${article.url}`,
        title: `${article.title} - Mediateka - LRT`,
        authors: article.authors?.map((author) => author.name) ?? undefined,
        sections: !!article.category_title ? ['Mediateka', article.category_title] : ['Mediateka'],
      };
    }
  }
};

export default useArticleAnalytics;
