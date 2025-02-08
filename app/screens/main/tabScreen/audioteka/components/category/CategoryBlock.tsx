import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../../../../Types';
import {AudiotekaCategory, AudiotekaSlug} from '../../../../../../api/Types';
import {
  ArticleComponent,
  ArticleRow,
  MoreArticlesButton,
  Text,
  TouchableDebounce,
} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import BlockTitle from '../BlockTitle';

interface Props {
  data: AudiotekaCategory | AudiotekaSlug;
}

const CategoryBlock: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const title = data.template === 'slug' ? data.slug_title : data.category_title;

  const onArticlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Podcast', {articleId: article.id});
    },
    [navigation],
  );

  const openCategoryHandler = useCallback(() => {
    if (data.template === 'category') {
      navigation.navigate('Category', {
        id: data.category_id,
        name: data.category_title,
        url: data.category_url,
      });
    } else {
      navigation.navigate('Slug', {
        name: data.slug_title,
        slugUrl: data.slug_url,
      });
    }
  }, [data, navigation]);

  return (
    <View style={styles.container}>
      <TouchableDebounce debounceTime={500} onPress={openCategoryHandler}>
        <BlockTitle style={styles.title} text={title} />
        {data.template === 'slug' && (
          <View style={styles.slugTitleContainer}>
            <Text style={styles.slugTitle}>{`#${title}`}</Text>
          </View>
        )}
      </TouchableDebounce>
      {data.articles_list[0] && (
        <ArticleComponent
          style={styles.articleSingle}
          article={data.articles_list[0]}
          styleType={'single'}
          onPress={onArticlePressHandler}
        />
      )}
      {data.articles_list[1] && data.articles_list[2] && (
        <ArticleRow
          data={[data.articles_list[1], data.articles_list[2]]}
          onArticlePress={onArticlePressHandler}
        />
      )}
      <MoreArticlesButton onPress={openCategoryHandler} />
    </View>
  );
};

export default CategoryBlock;

const styles = StyleSheet.create({
  container: {},
  title: {
    paddingHorizontal: 8,
  },
  articleSingle: {
    padding: 8,
  },
  slugTitleContainer: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  slugTitle: {
    fontSize: 14,
  },
});
