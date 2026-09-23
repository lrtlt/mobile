import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '../../../../../components';
import {HomeV3Article} from '../../../../../api/Types';

const BADGE_COLORS: Record<string, {background: string; text: string}> = {
  'badge-primary': {background: '#2F357D', text: '#FFFFFF'},
  'badge-info': {background: '#2F357D', text: '#FFFFFF'},
  'badge-danger': {background: '#EE000E', text: '#FFFFFF'},
  'badge-secondary': {background: '#97A2B6', text: '#212529'},
  'badge-warning': {background: '#FFC107', text: '#212529'},
};

interface Props {
  article: HomeV3Article;
  size?: 'small' | 'big';
  style?: ViewStyle;
}

/** Editorial badge like "LRT POKALBIS" or "NUOLAT PILDOMA". */
const ArticleBadge: React.FC<Props> = ({article, size = 'small', style}) => {
  if (!article.badge_title) {
    return null;
  }

  const colors = BADGE_COLORS[article.badge_class ?? ''] ?? BADGE_COLORS['badge-primary'];

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, height: size === 'big' ? 26 : 18},
        style,
      ]}>
      <Text
        style={{...styles.text, color: colors.text}}
        fontFamily="SourceSansPro-SemiBold"
        scalingEnabled={false}
        numberOfLines={1}>
        {article.badge_title}
      </Text>
    </View>
  );
};

export default ArticleBadge;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  text: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
