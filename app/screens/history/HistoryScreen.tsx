import React, {useEffect} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {ArticleRow, MyFlatList} from '../../components';
import {useSelector} from 'react-redux';
import {selectHistoryScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SavedArticle} from '../../redux/reducers/articleStorage';

type ScreenRouteProp = RouteProp<MainStackParamList, 'History'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'History'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const HistoryScreen: React.FC<Props> = ({navigation}) => {
  const {strings} = useTheme();
  const state = useSelector(selectHistoryScreenState);
  const {articles} = state;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.history,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (val: ListRenderItemInfo<SavedArticle[]>) => {
    return (
      <ArticleRow
        data={val.item}
        onArticlePress={(article) => navigation.push('Article', {articleId: article.id})}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MyFlatList
        shouldActivateOnStart
        showsVerticalScrollIndicator={false}
        data={articles}
        windowSize={4}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => `${index}-${item.map((i) => i.id)}`}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
