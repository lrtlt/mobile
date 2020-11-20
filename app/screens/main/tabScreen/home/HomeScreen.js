import React, {useEffect, useRef} from 'react';
import {View, SectionList, RefreshControl, StyleSheet} from 'react-native';
import {
  ArticleRow,
  ScrollingChannels,
  ArticleFeedItem,
  SectionHeader,
  MoreArticlesButton,
  ScreenLoader,
} from '../../../../components';
import {fetchArticles, fetchMediateka, openCategoryForName} from '../../../../redux/actions/index';
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
import {useDispatch, useSelector} from 'react-redux';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {selectHomeScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = (props) => {
  const {isCurrent, type} = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listRef = useRef(null);
  const state = useSelector(selectHomeScreenState(type));

  const {sections, lastFetchTime, refreshing} = state;

  useEffect(() => {
    const pageName = type === ARTICLE_LIST_TYPE_MEDIA ? 'mediateka' : 'home';

    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: pageName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      listRef.current?.scrollToLocation({
        animated: true,
        sectionIndex: 0,
        itemIndex: 0,
      });
      callApi();
    });

    return () => EventRegister.removeEventListener(listener);
  });

  useEffect(() => {
    if (isCurrent) {
      if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        console.log('Home data expired!');
        callApi();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent, refreshing, state.lastFetchTime]);

  const callApi = () => {
    if (type === ARTICLE_LIST_TYPE_MEDIA) {
      dispatch(fetchMediateka());
    } else {
      dispatch(fetchArticles());
    }
  };

  const onArticlePressHandler = (article) => {
    navigation.navigate('Article', {articleId: article.id});
  };

  const onChannelPressHandler = (channel) => {
    const {channel_id} = channel.payload;
    navigation.navigate('Channel', {channelId: channel_id});
  };

  const onCategoryPressHandler = (category) => {
    console.log('CategoryPressed', category);

    let name = category.name;
    if (name === 'Naujienų srautas') {
      //TODO update this hardcode later
      name = 'Naujausi';
    }

    if (category.is_slug_block === 1) {
      navigation.navigate('Slug', {category: category});
    } else {
      dispatch(openCategoryForName(name));
    }
  };

  const renderItem = (val) => {
    switch (val.item.type) {
      case LIST_DATA_TYPE_ARTICLES: {
        const {category} = val.section;
        return (
          <ArticleRow
            data={val.item.data}
            onArticlePress={(article) => onArticlePressHandler(article)}
            isSlug={category.is_slug_block}
          />
        );
      }
      case LIST_DATA_TYPE_TVPROG: {
        return (
          <ScrollingChannels
            data={val.item.data}
            onChannelPress={(channel) => onChannelPressHandler(channel)}
          />
        );
      }
      case LIST_DATA_TYPE_ARTICLES_FEED: {
        return (
          <ArticleFeedItem
            article={val.item.data[0]}
            onArticlePress={(article) => onArticlePressHandler(article)}
          />
        );
      }
      case LIST_DATA_TYPE_MORE_FOOTER: {
        return (
          <MoreArticlesButton
            category={val.item.data}
            onPress={() => onCategoryPressHandler(val.item.data)}
          />
        );
      }
      default: {
        console.warn('Uknown list item type: ' + val.item.type);
        return <View />;
      }
    }
  };

  const renderSectionHeader = ({section}) =>
    section.index !== 0 ? (
      <SectionHeader category={section.category} onPress={(category) => onCategoryPressHandler(category)} />
    ) : null;

  const renderLoading = () => <ScreenLoader style={styles.loadingContainer} />;

  if (sections.length === 0) {
    return renderLoading();
  }

  return (
    <View style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        style={styles.container}
        ref={listRef}
        extraData={{
          orientation: getOrientation(),
          lastFetchTime: lastFetchTime,
        }}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => callApi()} />}
        renderSectionHeader={renderSectionHeader}
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
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
