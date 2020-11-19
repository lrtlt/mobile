import React from 'react';
import {View, StyleSheet} from 'react-native';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  article: any;
  backgroundColor: string;
  onArticlePress: (article: any) => void;
}

const ArticleFeedItem: React.FC<Props> = (props) => {
  const article = props.article;
  const backgroundColor = props.backgroundColor;

  return (
    <TouchableDebounce
      onPress={() => props.onArticlePress(props.article)}
      debounceTime={500}
      activeOpacity={0.4}>
      <View style={{...styles.container, backgroundColor}}>
        <TextComponent style={styles.title}>{article.title}</TextComponent>
        <TextComponent style={styles.timeText} type="secondary">
          {article.item_time}
        </TextComponent>
      </View>
    </TouchableDebounce>
  );
};

export default ArticleFeedItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 17,
  },
  timeText: {
    fontFamily: 'SourceSansPro-SemiBold',
    marginTop: 4,
    fontSize: 13,
  },
});
