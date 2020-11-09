import React from 'react';
import {View, SectionList, RefreshControl} from 'react-native';
import {
  ArticleRow,
  ScrollingChannels,
  ArticleFeedItem,
  SectionHeader,
  MoreArticlesButton,
  ScreenLoader,
} from '../../../../components';
import Styles from './styles';
import {connect} from 'react-redux';
import {fetchArticles, fetchMediateka, openCategoryForName} from '../../../../redux/actions/index';
import EStyleSheet from 'react-native-extended-stylesheet';
import {getOrientation} from '../../../../util/UI';
import {
  ARTICLE_LIST_TYPE_MEDIA,
  ARTICLE_EXPIRE_DURATION,
  GEMIUS_VIEW_SCRIPT_ID,
  LIST_DATA_TYPE_ARTICLES,
  LIST_DATA_TYPE_TVPROG,
  LIST_DATA_TYPE_ARTICLES_FEED,
  LIST_DATA_TYPE_MORE_FOOTER,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';

class HomeScreen extends React.Component {
  _onRefresh = () => {
    this.callApi();
  };

  componentDidMount() {
    const pageName = this.props.type === ARTICLE_LIST_TYPE_MEDIA ? 'mediateka' : 'home';

    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: pageName,
    });

    if (Date.now() - this.props.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
      this.callApi();
    }

    this.listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      this.handleLogoPress();
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.refreshing !== nextProps.refreshing || this.props.lastFetchTime !== nextProps.lastFetchTime
    );
  }

  handleLogoPress() {
    if (this.props.isCurrent) {
      if (this.scrollY > 100) {
        this.sectionList.scrollToLocation({
          animated: true,
          sectionIndex: 0,
          itemIndex: 0,
        });
      } else {
        this._onRefresh();
      }
    }
  }

  callApi() {
    if (this.props.type === ARTICLE_LIST_TYPE_MEDIA) {
      this.props.dispatch(fetchMediateka());
    } else {
      this.props.dispatch(fetchArticles());
    }
  }

  onArticlePressHandler = (article) => {
    this.props.navigation.push('article', {articleId: article.id});
  };

  onChannelPressHandler = (channel) => {
    const {channel_id} = channel.payload;
    this.props.navigation.push('channel', {channelId: channel_id});
  };

  onCategoryPressHandler = (category) => {
    console.log('CategoryPressed', category);

    let name = category.name;
    if (name === 'Naujienų srautas') {
      //TODO update this hardcode later
      name = 'Naujausi';
    }

    if (category.is_slug_block === 1) {
      this.props.navigation.push('slug', {category: category});
    } else {
      this.props.dispatch(openCategoryForName(name));
    }
  };

  renderItem = (val) => {
    switch (val.item.type) {
      case LIST_DATA_TYPE_ARTICLES: {
        return (
          <ArticleRow
            data={val.item.data}
            onArticlePress={(article) => this.onArticlePressHandler(article)}
            backgroundColor={val.section.backgroundColor}
          />
        );
      }
      case LIST_DATA_TYPE_TVPROG: {
        return (
          <ScrollingChannels
            data={val.item.data}
            onChannelPress={(channel) => this.onChannelPressHandler(channel)}
          />
        );
      }
      case LIST_DATA_TYPE_ARTICLES_FEED: {
        return (
          <ArticleFeedItem
            article={val.item.data[0]}
            onArticlePress={(article) => this.onArticlePressHandler(article)}
            backgroundColor={val.section.backgroundColor}
          />
        );
      }
      case LIST_DATA_TYPE_MORE_FOOTER: {
        return (
          <MoreArticlesButton
            category={val.item.data}
            onPress={() => this.onCategoryPressHandler(val.item.data)}
          />
        );
      }
      default: {
        console.warn('Uknown list item type: ' + val.item.type);
        return <View />;
      }
    }
  };

  renderSectionHeader = ({section}) =>
    section.index !== 0 ? (
      <SectionHeader
        category={section.category}
        onPress={(category) => this.onCategoryPressHandler(category)}
      />
    ) : null;

  renderSeparator = () => <View style={Styles.separator} />;

  renderLoading = () => <ScreenLoader style={Styles.loadingContainer} />;

  render() {
    const {sections, lastFetchTime, refreshing} = this.props;

    if (sections.length === 0) {
      return this.renderLoading();
    }

    return (
      <View style={Styles.container}>
        <SectionList
          showsVerticalScrollIndicator={false}
          style={Styles.container}
          ref={(ref) => (this.sectionList = ref)}
          extraData={{
            orientation: getOrientation(),
            lastFetchTime: lastFetchTime,
          }}
          renderItem={this.renderItem}
          onScroll={(event) => (this.scrollY = event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={500}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />}
          renderSectionHeader={this.renderSectionHeader}
          sections={sections}
          removeClippedSubviews={false}
          windowSize={12}
          updateCellsBatchingPeriod={20}
          maxToRenderPerBatch={4}
          initialNumToRender={8}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    );
  }
}

const mapSections = (items) => {
  return items.map((block, i) => {
    return {
      index: i,
      category: block.category,
      data: block.items,
      backgroundColor: EStyleSheet.value(block.category.backgroundColor),
    };
  });
};

const mapStateToProps = (state, ownProps) => {
  const block = ownProps.type === ARTICLE_LIST_TYPE_MEDIA ? state.articles.mediateka : state.articles.home;

  return {
    refreshing: block.isFetching && block.items.length !== 0,
    lastFetchTime: block.lastFetchTime,
    sections: mapSections(block.items),
  };
};

export default connect(mapStateToProps)(HomeScreen);
