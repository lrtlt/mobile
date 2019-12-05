import React from 'react';
import { View } from 'react-native';
import ScalableText from '../../scalableText/ScalableText';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import Styles from './styles';

const articleFeedItem = props => {
  const article = props.article;
  const backgroundColor = props.backgroundColor;

  return (
    <TouchableDebounce
      onPress={() => props.onArticlePress(props.article)}
      debounceTime={500}
      activeOpacity={0.4}
    >
      <View style={{ ...Styles.container, backgroundColor }}>
        <ScalableText style={Styles.title}>{article.title}</ScalableText>
        <ScalableText style={Styles.timeText}>{article.item_time}</ScalableText>
      </View>
    </TouchableDebounce>
  );
};

export default React.memo(articleFeedItem);
