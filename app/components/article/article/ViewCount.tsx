import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Article} from '../../../../Types';
import {ARTICLE_TYPE_VIDEO} from '../../../constants';
import {useTheme} from '../../../Theme';
import {IconView} from '../../svg';
import TextComponent from '../../text/Text';

interface ViewCountProps {
  style?: ViewStyle;
  visible?: boolean;
  article: Article;
}

const ViewCount: React.FC<ViewCountProps> = ({style, visible = true, article}) => {
  const {colors} = useTheme();

  if ((article.is_video || article.article_type === ARTICLE_TYPE_VIDEO) && visible) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.lightGreyBackground,
          },
          style,
        ]}>
        <IconView size={16} color={colors.darkIcon} />
        <TextComponent style={{...styles.countText, color: colors.darkIcon}} importantForAccessibility="no">
          {article.read_count}
        </TextComponent>
      </View>
    );
  } else {
    return null;
  }
};

export default ViewCount;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  countText: {
    paddingStart: 4,

    fontSize: 14,
  },
});
