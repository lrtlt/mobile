import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import ArticleComponent, {ArticleStyleType} from '../article/ArticleComponent';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../Theme';
import {Article} from '../../../../Types';
import {SavedArticle} from '../../../redux/reducers/articleStorage';

//TODO calculate for bigger screens.
const articleFitCount = 2;

const getArticleStyleType = (articleCount: number): ArticleStyleType => {
  if (articleCount === 1) {
    return 'single';
  } else if (articleCount <= articleFitCount) {
    return 'multi';
  } else {
    return 'scroll';
  }
};

interface Props {
  data: (Article | SavedArticle)[];
  isSlug?: boolean;
  onArticlePress: (article: Article) => void;
}

const ArticleRow: React.FC<Props> = (props) => {
  const {data, isSlug, onArticlePress} = props;
  const {colors} = useTheme();

  const backgroundColor = isSlug ? colors.slugBackground : undefined;
  const articleStyleType = getArticleStyleType(data.length);

  const content = useMemo(
    () =>
      data.map((a, i) => {
        return (
          <ArticleComponent
            style={styles.article}
            article={a as Article}
            onPress={onArticlePress}
            styleType={articleStyleType}
            key={i}
          />
        );
      }),
    [data],
  );

  if (articleStyleType === 'scroll') {
    return (
      <ScrollView style={{backgroundColor}} horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{...styles.container}}>{content}</View>
      </ScrollView>
    );
  } else {
    return <View style={{...styles.container, backgroundColor}}>{content}</View>;
  }
};

export default ArticleRow;

const styles = StyleSheet.create({
  article: {
    padding: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
  },
});
