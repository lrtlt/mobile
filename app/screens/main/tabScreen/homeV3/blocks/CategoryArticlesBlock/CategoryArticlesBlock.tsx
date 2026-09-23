import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeV3BlockCategory, HomeV3BlockSlug} from '../../../../../../api/Types';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {IMG_SIZE_L} from '../../../../../../util/ImageUtil';
import ArticleHero from '../../components/ArticleHero';
import ArticleListItem from '../../components/ArticleListItem';
import SectionTitle from '../../components/SectionTitle';
import useHomeColors from '../../components/useHomeColors';

interface CategoryArticlesBlockProps {
  block: HomeV3BlockCategory | HomeV3BlockSlug;
}

/** Category or topic list (templates 9 and 24): a hero article and text-only rows. */
const CategoryArticlesBlock: React.FC<CategoryArticlesBlockProps> = ({block}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const colors = useHomeColors();

  const title = block.type === 'slug' ? block.data.slug_title : block.data.category_title;
  const articles = block.data.articles_list;

  const onHeaderPress = useCallback(() => {
    if (block.type === 'slug') {
      navigation.navigate('Slug', {name: block.data.slug_title, slugUrl: block.data.slug_url});
    } else {
      useNavigationStore.getState().openCategoryById(block.data.category_id, block.data.category_title);
    }
  }, [block, navigation]);

  if (!articles?.length) {
    return null;
  }

  const [hero, ...rest] = articles;

  return (
    <View style={styles.root}>
      <SectionTitle style={styles.title} title={title} onPress={onHeaderPress} />
      <ArticleHero article={hero} titleSize="medium" imageSize={IMG_SIZE_L} showCategory={false} />
      {rest.map((article) => (
        <ArticleListItem
          key={article.id}
          article={article}
          showCategory={false}
          style={{...styles.item, borderColor: colors.separator}}
        />
      ))}
    </View>
  );
};

export default CategoryArticlesBlock;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 8,
  },
  title: {
    marginBottom: 16,
  },
  item: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});
