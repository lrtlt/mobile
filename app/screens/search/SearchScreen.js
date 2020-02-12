import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { resetSearchFilter, addArticleToHistory } from '../../redux/actions';
import { Article } from '../../components';
import Styles from './styles';
import { getOrientation } from '../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import { searchArticles } from '../../api';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { isEqual } from 'lodash';

const initialState = {
  query: '',
  isFetching: false,
  isError: false,
  articles: [],
  filter: null,
};

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    const parentNavigation = props.navigation.dangerouslyGetParent();
    if (parentNavigation) {
      parentNavigation.setParams({
        searchInputHandler: this.handleInputChange,
        searchHandler: this.handleSearchPress,
      });
    }

    this.state = initialState;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props.filter, nextProps.filter) ||
      this.state.isFetching !== nextState.isFetching ||
      this.state.isError !== nextState.isError ||
      this.state.articles !== nextState.articles
    );
  }

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'search',
    });
  }

  componentDidUpdate() {
    if (!isEqual(this.props.filter, this.state.filter)) {
      this.updateFilterAndRunSearch(this.props.filter);
    }
  }

  updateFilterAndRunSearch = filter => {
    this.setState({ ...this.state, filter }, () => {
      this.search();
    });
  };

  componentWillUnmount() {
    this.props.dispatch(resetSearchFilter());
  }

  handleSearchPress = () => {
    this.search();
  };

  search = () => {
    this.setState({ ...this.state, isFetching: true, isError: false });
    this.callApi()
      .then(response => {
        this.setState({
          ...this.state,
          isFetching: false,
          isError: false,
          articles: response.items,
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
    const response = await fetch(searchArticles(this.state.query, this.state.filter));
    const result = await response.json();
    console.log('SEARCH ARTICLES RESPONSE', result);
    return result;
  }

  onArticlePressHandler = article => {
    this.props.navigation.push('article', { articleId: article.id });
    this.props.dispatch(addArticleToHistory(article));
  };

  handleInputChange = text => {
    this.setState({ ...this.state, query: text });

    const parentNavigation = this.props.navigation.dangerouslyGetParent();
    if (parentNavigation) {
      parentNavigation.setParams({ q: text });
    }
  };

  renderItem = val => {
    return (
      <Article
        style={Styles.article}
        data={val.item}
        onPress={article => this.onArticlePressHandler(article)}
        type={'multi'}
      />
    );
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
          onPress={() => this.search()}
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
          statusBarHeight={0}
          data={articles}
          windowSize={4}
          numColumns={2}
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

const mapStateToProps = state => {
  return { filter: state.navigation.filter };
};

export default connect(mapStateToProps)(SearchScreen);
