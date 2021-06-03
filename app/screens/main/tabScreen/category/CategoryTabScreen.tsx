import React, {useCallback, useEffect, useRef} from 'react';
import {View, RefreshControl, Button, StyleSheet, FlatList} from 'react-native';
import {ArticleRow, ListLoader, DefaultSectionHeader, ScreenLoader, Text} from '../../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCategory, refreshCategory} from '../../../../redux/actions';
import {ARTICLES_PER_PAGE_COUNT, GEMIUS_VIEW_SCRIPT_ID, EVENT_LOGO_PRESS} from '../../../../constants';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {selectCategoryScreenState} from '../../../../redux/selectors';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../navigation/MainStack';

interface Props {
  categoryId: number;
  categoryTitle: string;
  isCurrent?: boolean;
  showTitle?: boolean;
}

const CategoryTabScreen: React.FC<Props> = ({categoryId, categoryTitle, isCurrent, showTitle}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors, strings} = useTheme();
  const listRef = useRef<FlatList>(null);

  const category = useSelector(selectCategoryScreenState(categoryId, categoryTitle));
  const {isError, articles, isFetching, isRefreshing, title, nextPage} = category;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'category',
      categoryId: categoryId.toString(),
    });

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        refresh();
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  });

  const refresh = useCallback(() => {
    listRef.current?.scrollToOffset({offset: 0});
    dispatch(refreshCategory(categoryId, ARTICLES_PER_PAGE_COUNT));
  }, [categoryId, dispatch]);

  const callApi = useCallback(() => {
    dispatch(fetchCategory(categoryId, ARTICLES_PER_PAGE_COUNT, nextPage));
  }, [categoryId, dispatch, nextPage]);

  const onListEndReachedHandler = useCallback(() => {
    //When nextPage === null the end is reached.
    if (isFetching === false && nextPage !== null) {
      callApi();
    }
  }, [callApi, isFetching, nextPage]);

  const keyExtractor = useCallback((item, index) => String(index) + String(item), []);

  if (isError === true) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={() => callApi()} />
      </View>
    );
  }

  if (isFetching === true && articles.length === 0) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        data={articles}
        ListHeaderComponent={showTitle ? <DefaultSectionHeader title={title} /> : undefined}
        windowSize={4}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetching ? <ListLoader /> : null}
        onEndReached={onListEndReachedHandler}
        renderItem={(item) => {
          return (
            <ArticleRow
              data={item.item}
              onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
            />
          );
        }}
        refreshControl={<RefreshControl refreshing={isRefreshing === true} onRefresh={refresh} />}
        removeClippedSubviews={false}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default CategoryTabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
