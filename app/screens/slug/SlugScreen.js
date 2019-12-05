import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import Styles from './styles';
import { ArticleRow } from '../../components';

import { getOrientation } from '../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import { articleGetByTag } from '../../api';
import { formatArticles } from '../../util/articleFormatters';
import { ARTICLES_PER_PAGE_COUNT, GEMIUS_VIEW_SCRIPT_ID } from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

const initialState = {
  isFetching: true,
  isError: false,
  articles: [],
};

class SlugScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', null),
    };
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleBackPress() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    const { category } = this.props.navigation.state.params;

    this.props.navigation.setParams({ title: '#' + category.name });

    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'slug',
      slugUrl: category.slug_url,
    });

    this.startLoading();
  }

  startLoading = () => {
    this.setState({ ...this.state, isFetching: true, isError: false });
    this.callApi()
      .then(response => {
        const formattedArticles = formatArticles(-1, response.articles);
        this.setState({
          isFetching: false,
          isError: false,
          articles: formattedArticles,
        });
      })
      .catch(error => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: true,
        });
      });
  };

  async callApi() {
    const { category } = this.props.navigation.state.params;
    const urlSegments = category.slug_url.split('/');
    const tag = urlSegments[urlSegments.length - 1];
    const response = await fetch(articleGetByTag(tag, ARTICLES_PER_PAGE_COUNT));
    const result = await response.json();
    //console.log('ARTICLES BY TAG API RESPONSE', result);
    return result;
  }

  onArticlePressHandler = article => {
    this.props.navigation.push('article', { articleId: article.id });
  };

  renderItem = val => {
    return <ArticleRow data={val.item} onArticlePress={article => this.onArticlePressHandler(article)} />;
  };

  renderLoading = () => {
    return (
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size={'small'} animating={this.state.isFetching} />
      </View>
    );
  };

  renderError = () => {
    return (
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
        <Button
          title={EStyleSheet.value('$tryAgain')}
          color={EStyleSheet.value('$primary')}
          onPress={() => this.startLoading()}
        />
      </View>
    );
  };

  render() {
    const { isFetching, isError, articles } = this.state;

    let content;
    if (isError === true) {
      content = this.renderError();
    } else if (isFetching === true) {
      content = this.renderLoading();
    } else {
      content = (
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
      );
    }

    return (
      <SafeAreaView style={Styles.root} forceInset={{ bottom: 'never' }}>
        <View style={Styles.container}>{content}</View>
      </SafeAreaView>
    );
  }
}

export default SlugScreen;
