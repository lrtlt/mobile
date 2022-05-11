import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet, ListRenderItemInfo, Button, RefreshControl} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {Article} from '../../../../Types';
import {
  ArticleRow,
  DefaultSectionHeader,
  ListLoader,
  MyFlatList,
  ScreenLoader,
  Text,
  TouchableDebounce,
} from '../../../components';
import {IconArrowLeft} from '../../../components/svg';
import {EVENT_SELECT_CATEGORY_INDEX} from '../../../constants';
import {MainStackParamList} from '../../../navigation/MainStack';
import {PagingState} from '../../../redux/reducers/articles';
import {useTheme} from '../../../Theme';

interface Props {
  data: PagingState;
  showTitle: boolean;
  showBackToHome?: boolean;
  requestNextPage: () => void;
  requestRefresh: () => void;
}

const TabScreenContent: React.FC<Props> = ({
  data,
  showTitle,
  showBackToHome,
  requestNextPage,
  requestRefresh,
}) => {
  const {isError, articles, isFetching, isRefreshing, title} = data;
  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const listRef = useRef<MyFlatList>(null);

  useEffect(() => {
    //Scroll to top when it's finished refreshing
    if (!isRefreshing) {
      listRef.current?.scrollToOffset({animated: true, offset: 0});
    }
  }, [isRefreshing]);

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

  const renderTitle = useCallback(() => {
    return (
      <View>
        {showBackToHome && (
          <TouchableDebounce
            style={styles.backContainer}
            onPress={() => {
              EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index: 0});
            }}>
            <IconArrowLeft color={colors.primary} size={16} />
            <Text style={{color: colors.primary, ...styles.backText}}>Atgal į pagrindinį</Text>
          </TouchableDebounce>
        )}
        <DefaultSectionHeader title={title} />
      </View>
    );
  }, [colors.primary, showBackToHome, title]);

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
      <MyFlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        data={articles}
        ListHeaderComponent={showTitle ? renderTitle() : null}
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
    marginBottom: 20,
    fontSize: 20,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 24,
  },
  backText: {
    marginLeft: 6,
  },
});
