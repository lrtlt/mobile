import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text, TouchableDebounce} from '../../../../../components';
import useHomeColors from './useHomeColors';

interface Props {
  title?: string;
  variant?: 'light' | 'dark';
  style?: ViewStyle;
  onPress: () => void;
}

/** Full width "DAUGIAU" button closing a block. */
const MoreButton: React.FC<Props> = ({title = 'Daugiau', variant = 'dark', style, onPress}) => {
  const colors = useHomeColors();
  const isDark = variant === 'dark';

  return (
    <TouchableDebounce onPress={onPress} style={style} accessibilityRole="button" accessibilityLabel={title}>
      <View style={{...styles.container, backgroundColor: isDark ? colors.darkButton : colors.lightButton}}>
        <Text style={{...styles.text, color: isDark ? '#FFFFFF' : colors.text}} scalingEnabled={false}>
          {title}
        </Text>
      </View>
    </TouchableDebounce>
  );
};

export default MoreButton;

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
