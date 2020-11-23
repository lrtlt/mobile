import React from 'react';
import {View, StyleSheet} from 'react-native';
import Article from '../article/Article';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../Theme';

//TODO calculate for bigger screens.
const articleFitCount = 2;

const getArticleType = (articleCount: number): string => {
  if (articleCount === 1) {
    return 'single';
  } else if (articleCount <= articleFitCount) {
    return 'multi';
  } else {
    return 'scroll';
  }
};

interface Props {
  data: any[];
  isSlug?: boolean;
  onArticlePress: (article: any) => void;
}

const ArticleRow: React.FC<Props> = (props) => {
  const {colors} = useTheme();

  const articles = props.data;

  const backgroundColor = props.isSlug ? colors.slugBackground : null;

  const articleType = getArticleType(articles.length);

  const content = articles.map((a, i) => {
    return (
      <Article
        style={styles.article}
        data={a}
        onPress={(article: any) => props.onArticlePress(article)}
        type={articleType}
        key={i}
      />
    );
  });

  if (articleType === 'scroll') {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{...styles.container, backgroundColor}}>{content}</View>
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