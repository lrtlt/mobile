import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Article} from '../../../../Types';
import {ARTICLE_TYPE_AUDIO} from '../../../constants';
import {useTheme} from '../../../Theme';
import {IconAudioReadCount} from '../../svg';
import TextComponent from '../../text/Text';

interface ListenCountProps {
  style?: ViewStyle;
  visible?: boolean;
  article: Article;
  count?: number;
}

const ListenCount: React.FC<ListenCountProps> = ({style, visible = true, article, count}) => {
  const {colors} = useTheme();

  if ((count || article.is_audio || article.article_type === ARTICLE_TYPE_AUDIO) && visible) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.lightGreyBackground,
          },
          style,
        ]}>
        <IconAudioReadCount size={16} color={colors.darkIcon} />
        <TextComponent style={{...styles.countText, color: colors.darkIcon}} importantForAccessibility="no">
          {count ?? article.read_count}
        </TextComponent>
      </View>
    );
  } else {
    return null;
  }
};

export default ListenCount;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  countText: {
    paddingStart: 4,

    fontSize: 14,
  },
});
