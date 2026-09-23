import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text, TouchableDebounce} from '../../../../../components';
import {IconChevronLeft} from '../../../../../components/svg';
import useHomeColors from './useHomeColors';

interface Props {
  title: string;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

/** Uppercase block title with a trailing chevron, e.g. "LIETUVOJE >". */
const SectionTitle: React.FC<Props> = ({title, color, style, onPress}) => {
  const colors = useHomeColors();
  const textColor = color ?? colors.text;

  const content = (
    <View style={styles.container}>
      <Text style={{...styles.title, color: textColor}} fontFamily="SourceSansPro-SemiBold">
        {title}
      </Text>
      {onPress ? <IconChevronLeft size={14} color={textColor} style={styles.chevron} /> : null}
    </View>
  );

  if (!onPress) {
    return <View style={style}>{content}</View>;
  }

  return (
    <TouchableDebounce
      style={[styles.touchable, style]}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={title}
      accessibilityHint="Atidaryti kategoriją">
      {content}
    </TouchableDebounce>
  );
};

export default SectionTitle;

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    textTransform: 'uppercase',
  },
  chevron: {
    marginStart: 6,
  },
});
