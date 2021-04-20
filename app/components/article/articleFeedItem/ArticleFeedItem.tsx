import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../Types';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  article: Article;
  onPress: () => void;
}

const ArticleFeedItem: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  const {article, onPress} = props;

  return (
    <TouchableDebounce onPress={onPress} debounceTime={500} activeOpacity={0.4}>
      <View style={{...styles.container, backgroundColor: colors.slugBackground}}>
        <TextComponent style={styles.title}>{article.title}</TextComponent>
        <TextComponent style={styles.timeText} type="secondary">
          {article.item_time}
        </TextComponent>
      </View>
    </TouchableDebounce>
  );
};

export default React.memo(ArticleFeedItem, (prevProps, nextProps) => {
  return prevProps.article.title === nextProps.article.title;
});

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
