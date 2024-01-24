import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../Types';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  article: Article;
  onPress: (article: Article) => void;
}

const ArticleFeedItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();
  const {article, onPress} = props;

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  return (
    <TouchableDebounce onPress={onPressHandler} debounceTime={500} activeOpacity={0.4}>
      <View style={{...styles.container, backgroundColor: colors.slugBackground}}>
        <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
          {article.title}
        </TextComponent>
        <TextComponent style={styles.timeText} type="secondary" fontFamily="SourceSansPro-SemiBold">
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
    fontSize: 17,
  },
  timeText: {
    marginTop: 4,
    fontSize: 13,
  },
});
