import React from 'react';
import { View, Dimensions } from 'react-native';
import {
  ScalableText,
  ArticlePhoto,
  ArticleParagraphs,
  ArticleGallery,
  TouchableDebounce,
} from '../../components';
import Styles from './styles';
import Header from './header/Header';
import EStyleSheet from 'react-native-extended-stylesheet';

const getContentWidth = () => {
  return Dimensions.get('window').width - EStyleSheet.value('$contentPadding') * 2;
};

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
      date={article.article_date}
      title={article.article_title}
      subtitle={article.article_subtitle}
      facebookReactions={article.reactions_count}
      author={author}
    />
  );
};

const renderMainPhoto = (photo, onPress) => {
  return (
    <View>
      <TouchableDebounce onPress={onPress}>
        <ArticlePhoto
          style={Styles.photo}
          photo={photo}
          progressive={true}
          imageAspectRatio={1.5}
          expectedWidth={getContentWidth()}
        />
      </TouchableDebounce>
    </View>
  );
};

const articleComponent = props => {
  const { article } = props;

  return (
    <View style={Styles.container}>
      {renderHeader(article)}

      {renderMainPhoto(article.main_photo, () => {
        props.onItemPress({
          type: 'photo',
          item: article.main_photo,
        });
      })}

      <ScalableText style={Styles.summaryText} selectable={true}>
        {article.article_summary}
      </ScalableText>

      <ArticleParagraphs data={article.paragraphs} itemSelectHandler={item => props.onItemPress(item)} />

      <ArticleGallery
        data={article.article_photos}
        expectedWidth={getContentWidth()}
        itemSelectHandler={item => props.onItemPress(item)}
      />
    </View>
  );
};
export default articleComponent;
