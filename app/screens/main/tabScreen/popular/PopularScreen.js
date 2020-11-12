import React, {useEffect, useRef} from 'react';
import {View, RefreshControl, Text, Button} from 'react-native';
import {ArticleRow, DefaultSectionHeader, ScreenLoader} from '../../../../components';
import Styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPopular, refreshPopular} from '../../../../redux/actions';
import {FlatList} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  ARTICLE_LIST_TYPE_POPULAR,
  ARTICLES_PER_PAGE_COUNT,
  GEMIUS_VIEW_SCRIPT_ID,
  EVENT_LOGO_PRESS,
} from '../../../../constants';
import {ListLoader} from '../../../../components';
import {getOrientation} from '../../../../util/UI';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {selectPopularArticlesScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';

const PopularScreen = (props) => {
  const state = useSelector(selectPopularArticlesScreenState);
  const {isError, articles, isFetching, isRefreshing, lastFetchTime, title, page} = state;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const listRef = useRef(null);

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: ARTICLE_LIST_TYPE_POPULAR,
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
    dispatch(refreshPopular(ARTICLES_PER_PAGE_COUNT));
  };

  const callApi = () => {
    dispatch(fetchPopular(page + 1, ARTICLES_PER_PAGE_COUNT));
  };

  const renderItem = (val) => (
    <ArticleRow
      data={val.item}
      onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
    />
  );

  const renderLoading = () => <ScreenLoader style={Styles.loadingContainer} />;

  const renderError = () => (
    <View style={Styles.errorContainer}>
      <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
      <Button
        title={EStyleSheet.value('$tryAgain')}
        color={EStyleSheet.value('$primary')}
        onPress={() => callApi()}
      />
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
    <View style={Styles.container}>
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        style={Styles.container}
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

export default PopularScreen;
