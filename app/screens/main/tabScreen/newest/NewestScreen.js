import React from 'react';
import { View, RefreshControl, Text, Button } from 'react-native';
import { ArticleRow, DefaultSectionHeader, ScreenLoader } from '../../../../components';
import Styles from './styles';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchNewest, refreshNewest } from '../../../../redux/actions';
import { FlatList } from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  ARTICLE_LIST_TYPE_NEWEST,
  ARTICLES_PER_PAGE_COUNT,
  GEMIUS_VIEW_SCRIPT_ID,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import { ListLoader } from '../../../../components';
import { getOrientation } from '../../../../util/UI';
import Gemius from 'react-native-gemius-plugin';
import { EventRegister } from 'react-native-event-listeners';

class NewestScreen extends React.Component {
  componentDidMount() {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'newest',
    });

    const { articles } = this.props;
    if (articles.length === 0) {
      this.callApi();
    }

    this.listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, data => {
      this.handleLogoPress();
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isError !== nextProps.isError ||
      this.props.isRefreshing !== nextProps.isRefreshing ||
      this.props.lastFetchTime !== nextProps.lastFetchTime
    );
  }

  _onRefresh = () => {
    this.props.dispatch(refreshNewest(ARTICLES_PER_PAGE_COUNT));
  };

  callApi() {
    const page = this.props.page + 1;
    this.props.dispatch(fetchNewest(page, ARTICLES_PER_PAGE_COUNT));
  }

  onArticlePressHandler = article => {
    this.props.navigation.push('article', { articleId: article.id });
  };

  handleLogoPress() {
    if (this.props.isCurrent) {
      if (this.scrollY > 100) {
        this.list.scrollToOffset({ offset: 0 });
      } else {
        this._onRefresh();
      }
    }
  }

  renderItem = val => (
    <ArticleRow data={val.item} onArticlePress={article => this.onArticlePressHandler(article)} />
  );

  renderLoading = () => <ScreenLoader style={Styles.loadingContainer} />;

  renderError = () => (
    <View style={Styles.errorContainer}>
      <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
      <Button
        title={EStyleSheet.value('$tryAgain')}
        color={EStyleSheet.value('$primary')}
        onPress={() => this.callApi()}
      />
    </View>
  );

  onListEndReached = () => {
    if (this.props.isFetching === false) {
      this.callApi();
    }
  };

  renderFooter = isFetching => {
    if (isFetching === true) {
      return <ListLoader />;
    } else {
      return null;
    }
  };

  render() {
    const { isError, articles, isFetching, isRefreshing, lastFetchTime, title } = this.props;

    if (isError === true) {
      return this.renderError();
    }

    if (articles.length === 0) {
      return this.renderLoading();
    }

    return (
      <View style={Styles.container}>
        <FlatList
          ref={ref => (this.list = ref)}
          onScroll={event => (this.scrollY = event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={500}
          showsVerticalScrollIndicator={false}
          style={Styles.container}
          data={articles}
          ListHeaderComponent={<DefaultSectionHeader title={title} />}
          windowSize={4}
          onEndReachedThreshold={0.2}
          ListFooterComponent={this.renderFooter(isFetching)}
          onEndReached={() => this.onListEndReached()}
          extraData={{
            orientation: getOrientation(),
            lastFetchTime,
          }}
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
  const { newest } = state.articles;

  const newestRoute = state.navigation.routes.find(r => r.type === ARTICLE_LIST_TYPE_NEWEST);
  const title = newestRoute && newestRoute.title;

  return {
    ...newest,
    title,
  };
};

export default connect(mapStateToProps)(withNavigation(NewestScreen));
