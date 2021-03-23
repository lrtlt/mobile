import {
  ArticleContent,
  ArticleContentDefault,
  ArticleContentMedia,
  isDefaultArticle,
  isMediaArticle,
} from '../../api/Types';

export const TYPE_HEADER = 'content_header';
export const TYPE_MAIN_PHOTO = 'content_main_photo';
export const TYPE_SUMMARY = 'content_summary';
export const TYPE_GALLERY = 'content_gallery';
export const TYPE_PARAGRAPH = 'content_paragraph';
export const TYPE_VIDEO = 'content_video';
export const TYPE_AUDIO = 'content_audio';
export const TYPE_TEXT_TO_SPEECH = 'content_text2speech';

export type ArticleContentItem = {
  type:
    | typeof TYPE_HEADER
    | typeof TYPE_MAIN_PHOTO
    | typeof TYPE_SUMMARY
    | typeof TYPE_GALLERY
    | typeof TYPE_PARAGRAPH
    | typeof TYPE_VIDEO
    | typeof TYPE_AUDIO
    | typeof TYPE_TEXT_TO_SPEECH;
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
  if (article.text2speech_file_url) {
    data.push(getTextToSpeech(article));
  }
  if (article.article_summary) {
    data.push(getSummary(article));
  }
  if (article.paragraphs) {
    data.push(...getParagraphs(article));
  }
  if (article.article_photos) {
    data.push(getGallery(article));
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
  }
  if (article.content) {
    data.push(getContentForMedia(article));
  }

  return data;
};

const getHeaderData = (article: ArticleContent): ArticleContentItem => {
  let author = null;
  try {
    if (isDefaultArticle(article)) {
      author = article.article_authors.map((a) => a.name).join(', ');
    } else {
      author = article.authors.map((a) => a.name).join(', ');
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
      author: author,
      text2SpeechEnabled: isDefaultArticle(article) ? Boolean(article.text2speech_file_url) : false,
    },
  };
};

const getMainPhoto = (article: ArticleContent): ArticleContentItem => {
  return {
    type: TYPE_MAIN_PHOTO,
    data: {
      photo: article.main_photo,
    },
  };
};

const getSummary = (article: ArticleContentDefault): ArticleContentItem => {
  return {
    type: TYPE_SUMMARY,
    data: {
      text: article.article_summary,
    },
  };
};

const getGallery = (article: ArticleContentDefault): ArticleContentItem => {
  return {
    type: TYPE_GALLERY,
    data: {
      photos: article.article_photos,
    },
  };
};

const getParagraphs = (article: ArticleContentDefault): ArticleContentItem[] => {
  return article.paragraphs.map((p) => {
    return {
      type: TYPE_PARAGRAPH,
      data: p,
    };
  });
};

const getContentForMedia = (article: ArticleContentMedia): ArticleContentItem => {
  return {
    type: TYPE_PARAGRAPH,
    data: {p: article.content},
  };
};

const getVideo = (article: ArticleContentMedia): ArticleContentItem => {
  return {
    type: TYPE_VIDEO,
    data: {
      cover: article.main_photo,
      streamUrl: article.get_playlist_url,
    },
  };
};

const getAudio = (article: ArticleContentMedia): ArticleContentItem => {
  return {
    type: TYPE_AUDIO,
    data: {
      cover: article.main_photo,
      streamUri: article.stream_url,
      mediaId: article.stream_url,
    },
  };
};

const getTextToSpeech = (article: ArticleContentDefault): ArticleContentItem => {
  return {
    type: TYPE_TEXT_TO_SPEECH,
    data: {
      cover: article.main_photo,
      streamUri: article.text2speech_file_url,
      mediaId: article.text2speech_file_url,
    },
  };
};
