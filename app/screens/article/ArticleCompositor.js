export const TYPE_HEADER = 'content_header';
export const TYPE_MAIN_PHOTO = 'content_main_photo';
export const TYPE_SUMMARY = 'content_summary';
export const TYPE_GALLERY = 'content_gallery';
export const TYPE_PARAGRAPH = 'content_paragraph';
export const TYPE_VIDEO = 'content_video';
export const TYPE_AUDIO = 'content_audio';
export const TYPE_TEXT_TO_SPEECH = 'content_text2speech';

export const compose = (article) => {
  const data = [];
  data.push(getHeaderData(article));

  if (article.is_video !== 1 && article.is_audio !== 1) {
    data.push(getMainPhoto(article));
  }

  if (article.text2speech_file_url) {
    data.push(getTextToSpeech(article));
  }

  if (article.article_summary) {
    data.push(getSummary(article));
  }

  if (article.paragraphs) {
    data.push(...getParagraphs(article));
  }

  if (article.is_video === 1) {
    if (article.get_playlist_url) {
      data.push(getVideo(article));
    }

    if (article.content) {
      data.push(getContentForMedia(article));
    }
  }

  if (article.is_audio === 1) {
    data.push(getAudio(article));

    if (article.content) {
      data.push(getContentForMedia(article));
    }
  }

  if (article.article_photos) {
    data.push(getGallery(article));
  }
  return data;
};

const getHeaderData = (article) => {
  let author = null;
  try {
    const authors = article.article_authors || article.authors;
    author = authors.map((a) => a.name).join(', ');
  } catch (e) {
    //Problem with author...
  }

  return {
    type: TYPE_HEADER,
    data: {
      category: article.category_title,
      date: article.article_date || article.date,
      title: article.article_title || article.title,
      subtitle: article.article_subtitle || article.subtitle,
      facebookReactions: article.reactions_count,
      author: author,
      text2SpeechEnabled: Boolean(article.text2speech_file_url),
    },
  };
};

const getMainPhoto = (article) => {
  return {
    type: TYPE_MAIN_PHOTO,
    data: {
      photo: article.main_photo,
    },
  };
};

const getSummary = (article) => {
  return {
    type: TYPE_SUMMARY,
    data: {
      text: article.article_summary,
    },
  };
};

const getGallery = (article) => {
  return {
    type: TYPE_GALLERY,
    data: {
      photos: article.article_photos,
    },
  };
};

const getParagraphs = (article) => {
  return article.paragraphs.map((p) => {
    return {
      type: TYPE_PARAGRAPH,
      data: p,
    };
  });
};

const getContentForMedia = (article) => {
  return {
    type: TYPE_PARAGRAPH,
    data: {p: article.content},
  };
};

const getVideo = (article) => {
  return {
    type: TYPE_VIDEO,
    data: {
      cover: article.main_photo,
      streamUrl: article.get_playlist_url,
    },
  };
};

const getAudio = (article) => {
  return {
    type: TYPE_AUDIO,
    data: {
      cover: article.main_photo,
      streamUri: article.stream_url,
    },
  };
};

const getTextToSpeech = (article) => {
  console.log('file: ', article.text2speech_file_url);
  return {
    type: TYPE_TEXT_TO_SPEECH,
    data: {
      cover: article.main_photo,
      streamUri: article.text2speech_file_url,
      mediaId: article.text2speech_file_url,
    },
  };
};
