import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import Article from '../article/Article';
import {ScrollView} from 'react-native-gesture-handler';

//TODO calculate for bigger screens.
const articleFitCount = 2;

const getArticleType = (articleCount) => {
  if (articleCount === 1) {
    return 'single';
  }

  if (articleCount <= articleFitCount) {
    return 'multi';
  }

  if (articleCount > articleFitCount) {
    return 'scroll';
  }
};

class ArticleRow extends React.PureComponent {
  render() {
    const articles = this.props.data;
    const backgroundColor = this.props.backgroundColor;
    const articleType = getArticleType(articles.length);

    const content = articles.map((a, i) => {
      return (
        <Article
          style={Styles.article}
          data={a}
          onPress={(article) => this.props.onArticlePress(article)}
          type={articleType}
          key={i}
        />
      );
    });

    if (articleType === 'scroll') {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{...Styles.container, backgroundColor}}>{content}</View>
        </ScrollView>
      );
    } else {
      return <View style={{...Styles.container, backgroundColor}}>{content}</View>;
    }
  }
}

export default ArticleRow;
