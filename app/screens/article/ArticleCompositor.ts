import {
  ArticleContent,
  ArticleContentDefault,
  ArticleContentMedia,
  isDefaultArticle,
  isMediaArticle,
} from '../../api/Types';
import {buildArticleImageUri, IMG_SIZE_S} from '../../util/ImageUtil';

export const TYPE_HEADER = 'content_header';
export const TYPE_MAIN_PHOTO = 'content_main_photo';
export const TYPE_SUMMARY = 'content_summary';
export const TYPE_GALLERY = 'content_gallery';
export const TYPE_KEYWORDS = 'content_keywords';
export const TYPE_PARAGRAPH = 'content_paragraph';
export const TYPE_VIDEO = 'content_video';
export const TYPE_AUDIO = 'content_audio';
export const TYPE_AUDIO_CONTENT = 'content_audio_content';

export type ArticleContentItemType = {
  type:
    | typeof TYPE_HEADER
    | typeof TYPE_MAIN_PHOTO
    | typeof TYPE_SUMMARY
    | typeof TYPE_GALLERY
    | typeof TYPE_KEYWORDS
    | typeof TYPE_PARAGRAPH
    | typeof TYPE_VIDEO
    | typeof TYPE_AUDIO
    | typeof TYPE_AUDIO_CONTENT;
  data: any;
};

export const compose = (article: ArticleContent) => {
  if (isMediaArticle(article)) {
    return composeMedia(article);
  } else {
    return composeDefault(article);
  }
};

const composeDefault = (article: ArticleContentDefault) => {
  const data = [];
  data.push(getHeaderData(article));
  data.push(getMainPhoto(article));

  if (article.article_summary) {
    data.push(getSummary(article));
  }
  if (article.paragraphs) {
    data.push(...getParagraphs(article));
  }
  if (article.article_photos) {
    data.push(getGallery(article));
  }
  if (article.article_keywords && article.article_keywords.length > 0) {
    data.push(getKeywords(article));
  }
  return data;
};

const composeMedia = (article: ArticleContentMedia) => {
  const data = [];
  data.push(getHeaderData(article));
  if (article.is_video === 1 && article.get_playlist_url) {
    data.push(getVideo(article));
  }
  if (article.is_audio === 1) {
    data.push(getAudio(article));
    data.push(getAudioContent(article));
  } else {
    if (article.content) {
      data.push(getContentForMedia(article));
    }
  }
  if (article.keywords && article.keywords.length > 0 && article.is_audio !== 1) {
    data.push(getKeywords(article));
  }

  return data;
};

const getHeaderData = (article: ArticleContent): ArticleContentItemType => {
  let author = null;
  try {
    if (isDefaultArticle(article)) {
      author = article.article_authors?.map((a) => a.name).join(', ');
    } else {
      author = article.authors?.map((a) => a.name).join(', ');
    }
  } catch (e) {
    console.log(e);
  }

  return {
    type: TYPE_HEADER,
    data: {
      category: article.category_title,
      date: isDefaultArticle(article) ? article.article_date : article.date,
      title: isDefaultArticle(article) ? article.article_title : article.title,
      subtitle: isDefaultArticle(article) ? article.article_subtitle : article.subtitle,
      facebookReactions: isDefaultArticle(article) ? article.reactions_count : undefined,
      image: buildArticleImageUri(IMG_SIZE_S, article?.main_photo?.path),
      author: author,
      text2SpeechUrl: isDefaultArticle(article) ? article.text2speech_file_url : undefined,
    },
  };
};

const getMainPhoto = (article: ArticleContent): ArticleContentItemType => {
  return {
    type: TYPE_MAIN_PHOTO,
    data: {
      photo: article.main_photo,
    },
  };
};

const getSummary = (article: ArticleContentDefault): ArticleContentItemType => {
  return {
    type: TYPE_SUMMARY,
    data: {
      text: article.article_summary,
    },
  };
};

const getGallery = (article: ArticleContentDefault): ArticleContentItemType => {
  return {
    type: TYPE_GALLERY,
    data: {
      photos: article.article_photos,
    },
  };
};

const getKeywords = (article: ArticleContentDefault | ArticleContentMedia): ArticleContentItemType => {
  if (isMediaArticle(article)) {
    return {
      type: TYPE_KEYWORDS,
      data: {
        keywords: article.keywords,
      },
    };
  } else {
    return {
      type: TYPE_KEYWORDS,
      data: {
        keywords: article.article_keywords,
      },
    };
  }
};

const getParagraphs = (article: ArticleContentDefault): ArticleContentItemType[] => {
  return article.paragraphs?.map((p) => {
    return {
      type: TYPE_PARAGRAPH,
      data: p,
    };
  });
};

const getContentForMedia = (article: ArticleContentMedia): ArticleContentItemType => {
  return {
    type: TYPE_PARAGRAPH,
    data: {p: article.content},
  };
};

const getAudioContent = (article: ArticleContentMedia): ArticleContentItemType => {
  return {
    type: TYPE_AUDIO_CONTENT,
    data: {
      title: article.title,
      about_episode: article.content,
      about_show: article.category_decription,
      image: article.category_img_info,
      keywords: article.keywords,
    },
  };
};

const getVideo = (article: ArticleContentMedia): ArticleContentItemType => {
  return {
    type: TYPE_VIDEO,
    data: {
      cover: article.main_photo,
      streamUrl: article.get_playlist_url,
    },
  };
};

const getAudio = (article: ArticleContentMedia): ArticleContentItemType => {
  return {
    type: TYPE_AUDIO,
    data: {
      title: article.title,
      cover: article.main_photo,
      streamUri: article.stream_url,
      mediaId: String(article.id),
    },
  };
};
