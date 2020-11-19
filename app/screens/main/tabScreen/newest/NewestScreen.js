import React, {useEffect, useRef} from 'react';
import {View, RefreshControl, Button, StyleSheet} from 'react-native';
import {ArticleRow, DefaultSectionHeader, ScreenLoader, Text} from '../../../../components';
import {useSelector, useDispatch} from 'react-redux';
import {fetchNewest, refreshNewest} from '../../../../redux/actions';
import {FlatList} from 'react-native-gesture-handler';
import {
  ARTICLE_LIST_TYPE_NEWEST,
  ARTICLES_PER_PAGE_COUNT,
  GEMIUS_VIEW_SCRIPT_ID,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import {ListLoader} from '../../../../components';
import {getOrientation} from '../../../../util/UI';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';
import {selectNewestArticlesScreenState} from '../../../../redux/selectors';
import {useTheme} from '../../../../Theme';

const NewestScreen = (props) => {
  const state = useSelector(selectNewestArticlesScreenState);
  const {isError, articles, isFetching, isRefreshing, lastFetchTime, title, page} = state;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {colors, strings} = useTheme();

  const listRef = useRef(null);

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: ARTICLE_LIST_TYPE_NEWEST,
    });
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      if (props.isCurrent) {
        refresh();
      }
    });
    return () => EventRegister.removeEventListener(listener);
  });

  const refresh = () => {
    listRef.current?.scrollToOffset({offset: 0});
    dispatch(refreshNewest(ARTICLES_PER_PAGE_COUNT));
  };

  const callApi = () => {
    dispatch(fetchNewest(page + 1, ARTICLES_PER_PAGE_COUNT));
  };

  const renderItem = (val) => (
    <ArticleRow
      data={val.item}
      onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
    />
  );

  const renderLoading = () => <ScreenLoader style={styles.loadingContainer} />;

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText} type="error">
        {strings.error_no_connection}
      </Text>
      <Button title={strings.tryAgain} color={colors.primary} onPress={() => callApi()} />
    </View>
  );

  const onListEndReached = () => {
    if (isFetching === false) {
      callApi();
    }
  };

  if (isError === true) {
    return renderError();
  }

  if (isFetching === true && articles.length === 0) {
    return renderLoading();
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        data={articles}
        ListHeaderComponent={<DefaultSectionHeader title={title} />}
        windowSize={4}
        onEndReachedThreshold={0.2}
        ListFooterComponent={isFetching ? <ListLoader /> : null}
        onEndReached={() => onListEndReached()}
        extraData={{
          orientation: getOrientation(),
          lastFetchTime,
        }}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default NewestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 20,
  },
});
