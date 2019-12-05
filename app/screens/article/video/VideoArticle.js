import React from 'react';
import { View } from 'react-native';
import Styles from './styles';
import { withNavigation } from 'react-navigation';
import { ArticleParagraphs, VideoContainer } from '../../../components';
import Header from '../header/Header';

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

const articleComponent = props => {
  const { article } = props;

  const paragraphs = [{ p: article.content }];

  return (
    <View style={Styles.container}>
      {renderHeader(article)}
      <View style={Styles.playerContainer}>
        <VideoContainer
          style={Styles.player}
          cover={article.main_photo}
          isLiveStream={false}
          autoPlay={false}
          videoUrl={article.get_playlist_url}
        />
      </View>

      <ArticleParagraphs data={paragraphs} itemSelectHandler={item => props.onItemPress(item)} />
    </View>
  );
};
export default withNavigation(articleComponent);
