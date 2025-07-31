import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {AIUserEventViewItem, ArticleContent, isDefaultArticle} from '../../api/Types';
import {debounce} from 'lodash';
import {sendSearchUserEvent} from '../../api';
import {useEffect} from 'react';

const _sendUserEventDebounce = debounce((e: AIUserEventViewItem) => sendSearchUserEvent(e), 500);

type Params = {
  article?: ArticleContent;
};

const useArticleAnalytics = ({article}: Params) => {
  //Send user event if needed
  useEffect(() => {
    const event = articleToUserEvent(article);
    if (!event) {
      return;
    }
    _sendUserEventDebounce(event);
  }, [article]);

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

const articleToUserEvent = (article?: ArticleContent): AIUserEventViewItem | undefined => {
  if (!article) {
    return undefined;
  }

  if (isDefaultArticle(article)) {
    return {
      type: 'view-item',
      data: {
        documentId: article.article_id?.toString(),
        attributes: {
          source: 'mobile_app',
          category: article.category_title,
        },
      },
    };
  } else {
    return {
      type: 'view-item',
      data: {
        documentId: article.id?.toString(),
        attributes: {
          source: 'mobile_app',
          category: article.category_title,
        },
      },
    };
  }
};

export default useArticleAnalytics;
