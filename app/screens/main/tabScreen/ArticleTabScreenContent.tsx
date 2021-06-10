import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, Button, RefreshControl} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {Article} from '../../../../Types';
import {ArticleRow, DefaultSectionHeader, ListLoader, ScreenLoader, Text} from '../../../components';
import {EVENT_LOGO_PRESS} from '../../../constants';
import {MainStackParamList} from '../../../navigation/MainStack';
import {PagingState} from '../../../redux/reducers/articles';
import {useTheme} from '../../../Theme';

interface Props {
  data: PagingState;
  showTitle: boolean;
  isCurrent: boolean;
  requestNextPage: () => void;
  requestRefresh: () => void;
}

const TabScreenContent: React.FC<Props> = ({data, showTitle, isCurrent, requestNextPage, requestRefresh}) => {
  const {isError, articles, isFetching, isRefreshing, title} = data;
  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (_data) => {
      if (isCurrent) {
        listRef.current?.scrollToOffset({offset: 0});
        requestRefresh();
      }
    });

    if (typeof listener === 'string') {
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }
  }, [isCurrent, requestRefresh]);

  const openArticleHandler = useCallback(
    (article: Article) => navigation.push('Article', {articleId: article.id}),
    [navigation],
  );

  const renderItem = useCallback(
    (val: ListRenderItemInfo<Article[]>) => (
      <ArticleRow data={val.item} onArticlePress={openArticleHandler} />
    ),
    [openArticleHandler],
  );

  const keyExtractor = useCallback((item, index) => String(index) + String(item), []);

  const onListEndReached = useCallback(() => {
    if (isFetching === false) {
      requestNextPage();
    }
  }, [isFetching, requestNextPage]);

  //Handle error state
  if (isError === true) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={requestRefresh} />
      </View>
    );
  }

  //Handle loading state
  if (isFetching === true && articles.length === 0) {
    return <ScreenLoader />;
  }

  //Handle article data
  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        data={articles}
        ListHeaderComponent={showTitle ? <DefaultSectionHeader title={title} /> : null}
        windowSize={4}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetching ? <ListLoader /> : null}
        onEndReached={onListEndReached}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={Boolean(isRefreshing)} onRefresh={requestRefresh} />}
        removeClippedSubviews={false}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default TabScreenContent;

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
