import React from 'react';
import { View } from 'react-native';
import Styles from './styles';
import { ArticleRow } from '../../components';
import { connect } from 'react-redux';
import { getOrientation } from '../../util/UI';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';
import { formatArticles } from '../../util/articleFormatters';
import Gemius from 'react-native-gemius-plugin';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

class HistoryScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: EStyleSheet.value('$history'),
    };
  };

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'history',
    });
  }

  onArticlePressHandler = article => {
    this.props.navigation.push('article', { articleId: article.id });
  };

  renderItem = val => {
    return <ArticleRow data={val.item} onArticlePress={article => this.onArticlePressHandler(article)} />;
  };

  render() {
    const { articles } = this.props;

    return (
      <SafeAreaView style={Styles.root} forceInset={{ bottom: 'never' }}>
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { history } = state.articleStorage;
  return { articles: formatArticles(-1, history, false) };
};

export default connect(mapStateToProps)(HistoryScreen);
