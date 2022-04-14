import React, {useEffect} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList} from '../../components';
import {useSelector} from 'react-redux';
import {selectBookmarksScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {SavedArticle} from '../../redux/reducers/articleStorage';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Bookmarks'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Bookmarks'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const BookmarksScreen: React.FC<Props> = ({navigation}) => {
  const state = useSelector(selectBookmarksScreenState);
  const {articles} = state;

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.bookmarks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={item.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MyFlatList
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
