import React from 'react';
import {View, RefreshControl, Text, Button} from 'react-native';
import {ArticleRow, ListLoader, DefaultSectionHeader, ScreenLoader} from '../../../../components';
import Styles from './styles';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import {fetchCategory, refreshCategory} from '../../../../redux/actions';
import {FlatList} from 'react-native-gesture-handler';
import {getOrientation} from '../../../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  ARTICLES_PER_PAGE_COUNT,
  ARTICLE_EXPIRE_DURATION,
  GEMIUS_VIEW_SCRIPT_ID,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';

class CategoryScreen extends React.Component {
  componentDidMount() {
    const {category} = this.props;

    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'category',
      categoryId: category.id.toString(),
    });

    this.listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      this.handleLogoPress();
    });

    if (category.page === 0) {
      this.callApi();
    } else {
      if (Date.now() - category.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        this._onRefresh();
      }
    }
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const category = this.props.category;
    const nextCategory = nextProps.category;

    return (
      category.isError !== nextCategory.isError ||
      category.isRefreshing !== nextCategory.isRefreshing ||
      category.isFetching !== nextCategory.isFetching ||
      category.lastFetchTime !== nextCategory.lastFetchTime
    );
  }

  _onRefresh = () => {
    const {id} = this.props.category;
    this.props.dispatch(refreshCategory(id, ARTICLES_PER_PAGE_COUNT));
  };

  callApi() {
    const {id, nextPage} = this.props.category;
    this.props.dispatch(fetchCategory(id, ARTICLES_PER_PAGE_COUNT, nextPage));
  }

  handleLogoPress() {
    if (this.props.isCurrent) {
      if (this.scrollY > 100) {
        this.list.scrollToOffset({offset: 0});
      } else {
        this._onRefresh();
      }
    }
  }

  onArticlePressHandler = (article) => {
    this.props.navigation.push('article', {articleId: article.id});
  };

  renderItem = (val) => {
    return <ArticleRow data={val.item} onArticlePress={(article) => this.onArticlePressHandler(article)} />;
  };

  renderLoading = () => {
    return <ScreenLoader style={Styles.loadingContainer} />;
  };

  renderError = () => {
    return (
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
        <Button
          title={EStyleSheet.value('$tryAgain')}
          color={EStyleSheet.value('$primary')}
          onPress={() => this.callApi()}
        />
      </View>
    );
  };

  renderFooter = (isFetching) => {
    if (isFetching === true) {
      return <ListLoader />;
    } else {
      return null;
    }
  };

  onListEndReached = () => {
    const {isFetching, nextPage} = this.props.category;

    //When nextPage === null the end is reached.
    if (isFetching === false && nextPage !== null) {
      this.callApi();
    }
  };

  render() {
    const {isFetching, isError, isRefreshing, lastFetchTime, articles, title} = this.props.category;

    if (isError === true) {
      return this.renderError();
    }

    if (isFetching === true && articles.length === 0) {
      return this.renderLoading();
    }

    return (
      <View style={Styles.container}>
        <FlatList
          ref={(ref) => (this.list = ref)}
          onScroll={(event) => (this.scrollY = event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={500}
          showsVerticalScrollIndicator={false}
          style={Styles.container}
          data={articles}
          ListHeaderComponent={<DefaultSectionHeader title={title} />}
          windowSize={4}
          extraData={{
            orientation: getOrientation(),
            lastFetchTime,
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={this.renderFooter(isFetching)}
          onEndReached={() => this.onListEndReached()}
          renderItem={this.renderItem}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this._onRefresh} />}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const category = state.articles.categories.find((val) => {
    return val.id === ownProps.route.categoryId;
  });

  return {
    category,
  };
};

export default connect(mapStateToProps)(withNavigation(CategoryScreen));
