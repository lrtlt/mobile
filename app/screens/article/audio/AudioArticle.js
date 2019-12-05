import React from 'react';
import { View, Dimensions } from 'react-native';
import { ProgressiveImage, ArticleParagraphs, AudioPlayer } from '../../../components';
import Header from '../header/Header';
import Styles from './styles';

import { getImageSizeForWidth, buildArticleImageUri, IMG_SIZE_XS } from '../../../util/ImageUtil';

const renderHeader = article => {
  let author = null;
  try {
    author = article.article_authors.map(a => a.name).join(', ');
  } catch (e) {
    //Problem with author...
  }

  return (
    <Header
      category={article.category_title}
      date={article.date}
      title={article.title}
      subtitle={article.subtitle}
      facebookReactions={null}
      author={author}
    />
  );
};

const renderPhoto = photo => {
  if (!photo) {
    return null;
  }

  const imgSize = getImageSizeForWidth(Dimensions.get('window').width);
  const aspectRatio = parseFloat(photo.w_h);

  return (
    <ProgressiveImage
      style={{ ...Styles.photo, aspectRatio }}
      source={{ uri: buildArticleImageUri(imgSize, photo.path) }}
      thumbnailSource={{ uri: buildArticleImageUri(IMG_SIZE_XS, photo.path) }}
      resizeMode={'cover'}
    />
  );
};

const articleComponent = props => {
  const { article } = props;

  const paragraphs = [{ p: article.content }];

  return (
    <View style={Styles.container}>
      {renderHeader(article)}

      {renderPhoto(article.main_photo)}
      <View style={Styles.player}>
        <AudioPlayer
          paused={true}
          controlTimeout={Number.MAX_VALUE}
          disableBack={true}
          source={{ uri: article.stream_url }}
        />
      </View>

      <ArticleParagraphs data={paragraphs} itemSelectHandler={item => props.onItemPress(item)} />
    </View>
  );
};
export default articleComponent;
