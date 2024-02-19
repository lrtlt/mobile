import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import ArticleComponent, {ArticleStyleType} from '../article/ArticleComponent';
import {Article} from '../../../../Types';
import {SavedArticle} from '../../../redux/reducers/articleStorage';
import MyScrollView from '../../MyScrollView/MyScrollView';

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
  articleStyle?: ViewStyle;
  data: (Article | SavedArticle)[];
  backgroundColor?: string;
  onArticlePress: (article: Article) => void;
}

const ArticleRow: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {data, onArticlePress} = props;

  const articleStyleType = getArticleStyleType(data.length);

  const content = useMemo(
    () =>
      data.map((a, i) => {
        return (
          <ArticleComponent
            style={{...styles.article, ...props.articleStyle}}
            article={a as Article}
            onPress={onArticlePress}
            styleType={articleStyleType}
            key={i}
          />
        );
      }),
    [articleStyleType, data, onArticlePress, props.articleStyle],
  );

  if (articleStyleType === 'scroll') {
    return (
      <MyScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>{content}</View>
      </MyScrollView>
    );
  } else {
    return <View style={styles.container}>{content}</View>;
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
