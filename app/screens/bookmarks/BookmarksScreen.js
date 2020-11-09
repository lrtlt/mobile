import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import {ArticleRow} from '../../components';
import {connect} from 'react-redux';
import {getOrientation} from '../../util/UI';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {formatArticles} from '../../util/articleFormatters';
import Gemius from 'react-native-gemius-plugin';
import {FlatList} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';

class BookmarksScreen extends React.PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: EStyleSheet.value('$bookmarks'),
    };
  };

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'bookmarks',
    });
  }

  onArticlePressHandler = (article) => {
    this.props.navigation.push('article', {articleId: article.id});
  };

  renderItem = (val) => {
    return <ArticleRow data={val.item} onArticlePress={(article) => this.onArticlePressHandler(article)} />;
  };

  render() {
    const {articles} = this.props;

    return (
      <View style={Styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={articles}
          windowSize={4}
          extraData={{
            orientation: getOrientation(),
          }}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {savedArticles} = state.articleStorage;
  return {articles: formatArticles(-1, savedArticles, false)};
};

export default connect(mapStateToProps)(BookmarksScreen);
