import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ArticleEmbedArticleType} from '../../../../api/Types';
import {ArticleSelectableItem} from '../../../../screens/article/ArticleContentComponent';
import {useTheme} from '../../../../Theme';
import TextComponent from '../../../text/Text';
import TouchableDebounce from '../../../touchableDebounce/TouchableDebounce';

interface Props {
  data: ArticleEmbedArticleType[];
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const EmbedArticles: React.FC<Props> = ({data, itemPressHandler}) => {
  const {colors, strings} = useTheme();

  const content = data.map(
    useCallback(
      (item, i) => {
        const pressHandler = () => {
          itemPressHandler({type: 'article', item: item.el});
        };

        return (
          <View style={styles.embededArticleContainer} key={i}>
            <TouchableDebounce onPress={pressHandler}>
              <TextComponent style={styles.embededArticleText} type="secondary">
                {item.el.title}
              </TextComponent>
            </TouchableDebounce>
          </View>
        );
      },
      [itemPressHandler],
    ),
  );

  return (
    <View style={styles.container}>
      <View style={{...styles.line, backgroundColor: colors.primary}} />
      <View style={styles.container}>
        <TextComponent style={styles.articleTitle}>{strings.embedArticleHeader}</TextComponent>
        {content}
      </View>
      <View style={{...styles.line, backgroundColor: colors.primary}} />
    </View>
  );
};

export default EmbedArticles;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
  },
  line: {
    width: '100%',
    height: 1,
  },
  embededArticleContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  articleTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  embededArticleText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
  },
});
