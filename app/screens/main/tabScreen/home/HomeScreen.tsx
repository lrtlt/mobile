import React, {useCallback, useEffect, useRef} from 'react';
import {View, SectionList, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {
  ArticleRow,
  ScrollingChannels,
  ArticleFeedItem,
  SectionHeader,
  MoreArticlesButton,
  ScreenLoader,
  Forecast,
  TouchableDebounce,
} from '../../../../components';
import {fetchHome, fetchMediateka, openCategoryForName} from '../../../../redux/actions/index';
import {getOrientation} from '../../../../util/UI';
import {
  ARTICLE_EXPIRE_DURATION,
  GEMIUS_VIEW_SCRIPT_ID,
  LIST_DATA_TYPE_ARTICLES,
  LIST_DATA_TYPE_CHANNELS,
  LIST_DATA_TYPE_ARTICLES_FEED,
  LIST_DATA_TYPE_MORE_FOOTER,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {selectHomeScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {ROUTE_TYPE_HOME, ROUTE_TYPE_MEDIA} from '../../../../api/Types';
import {Category} from '../../../../redux/reducers/articles';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';

interface Props {
  isCurrent: boolean;
  type: typeof ROUTE_TYPE_HOME | typeof ROUTE_TYPE_MEDIA;
}

const HomeScreen: React.FC<Props> = ({isCurrent, type}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<SectionList>(null);
  const state = useSelector(selectHomeScreenState(type), (l, r) => l.lastFetchTime === r.lastFetchTime);

  const {colors, dark} = useTheme();

  const {sections, lastFetchTime, refreshing} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      if (isCurrent) {
        listRef.current?.scrollToLocation({
          animated: true,
          sectionIndex: 0,
          itemIndex: 0,
        });
        callApi();
      }
    });

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  });

  useEffect(() => {
    if (isCurrent) {
      if (!refreshing && Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        console.log(`${type} data expired!`);
        callApi();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent, refreshing, state.lastFetchTime]);

  const callApi = useCallback(() => {
    if (type === ROUTE_TYPE_MEDIA) {
      dispatch(fetchMediateka());
    } else {
      dispatch(fetchHome());
    }
  }, [type]);

  const onCategoryPressHandler = useCallback((category: Category) => {
    console.log('CategoryPressed', category);

    if (category.is_slug_block === 1) {
      navigation.navigate('Slug', {
        name: category.name,
        slugUrl: category.slug_url,
      });
    } else {
      //TODO update this hardcode later
      if (category.name === 'Naujienų srautas') {
        //TODO update this hardcode later
        dispatch(openCategoryForName('Naujausi'));
      } else {
        dispatch(openCategoryForName(category.name));
      }
    }
  }, []);

  const renderItem = (val: any) => {
    switch (val.item.type) {
      case LIST_DATA_TYPE_ARTICLES: {
        const {category} = val.section;

        return (
          <ArticleRow
            data={val.item.data}
            onArticlePress={(article) => navigation.navigate('Article', {articleId: article.id})}
            isSlug={category.is_slug_block}
          />
        );
      }
      case LIST_DATA_TYPE_CHANNELS: {
        return (
          <ScrollingChannels
            onChannelPress={(channel) =>
              navigation.navigate('Channel', {channelId: channel.payload.channel_id})
            }
          />
        );
      }
      case LIST_DATA_TYPE_ARTICLES_FEED: {
        const article = val.item.data[0];
        return (
          <ArticleFeedItem
            article={article}
            onPress={() => navigation.navigate('Article', {articleId: article.id})}
          />
        );
      }
      case LIST_DATA_TYPE_MORE_FOOTER: {
        const category = val.item.data as Category;
        return (
          <MoreArticlesButton
            backgroundColor={
              category.is_slug_block || category.template_id === 999 ? colors.slugBackground : undefined
            }
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

  const renderForecast = () => {
    if (type === ROUTE_TYPE_MEDIA) {
      return null;
    } else {
      return (
        <TouchableDebounce debounceTime={500} onPress={() => navigation.navigate('Weather')}>
          <Forecast style={styles.forecast} />
        </TouchableDebounce>
      );
    }
  };

  if (sections.length === 0) {
    return <ScreenLoader style={styles.loadingContainer} />;
  }

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        translucent={false}
        backgroundColor={colors.statusBar}
      />
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={callApi} />}
          renderSectionHeader={({section}) => {
            const {category} = section;
            return category.id === 0 ? (
              renderForecast()
            ) : (
              <SectionHeader category={category} onPress={() => onCategoryPressHandler(category)} />
            );
          }}
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
    </>
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
  forecast: {
    margin: 8,
  },
});
