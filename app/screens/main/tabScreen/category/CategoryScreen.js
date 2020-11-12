import React, {useEffect, useRef} from 'react';
import {View, RefreshControl, Text, Button} from 'react-native';
import {ArticleRow, ListLoader, DefaultSectionHeader, ScreenLoader} from '../../../../components';
import Styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
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
import {selectCategoryScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';

const CategoryScreen = (props) => {
  const {categoryId} = props.route;
  const state = useSelector(selectCategoryScreenState(categoryId));
  const {isError, articles, isFetching, isRefreshing, lastFetchTime, title, page, nextPage} = state.category;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const listRef = useRef(null);

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'category',
      categoryId: categoryId.toString(),
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
    dispatch(refreshCategory(categoryId, ARTICLES_PER_PAGE_COUNT));
  };

  const callApi = () => {
    dispatch(fetchCategory(categoryId, ARTICLES_PER_PAGE_COUNT, nextPage));
  };

  const renderItem = (val) => {
    return (
      <ArticleRow
        data={val.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
  };

  const renderLoading = () => {
    return <ScreenLoader style={Styles.loadingContainer} />;
  };

  const renderError = () => {
    return (
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
        <Button
          title={EStyleSheet.value('$tryAgain')}
          color={EStyleSheet.value('$primary')}
          onPress={() => callApi()}
        />
      </View>
    );
  };

  const onListEndReached = () => {
    //When nextPage === null the end is reached.
    if (isFetching === false && nextPage !== null) {
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
        extraData={{
          orientation: getOrientation(),
          lastFetchTime,
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={isFetching ? <ListLoader /> : null}
        onEndReached={() => onListEndReached()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default CategoryScreen;
