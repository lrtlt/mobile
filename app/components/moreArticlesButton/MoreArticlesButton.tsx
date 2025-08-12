import React from 'react';
import {View, StyleSheet, ColorValue} from 'react-native';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  backgroundColor?: ColorValue;
  foregroundColor?: ColorValue;
  customText?: string;
  onPress: () => void;
}

const MoreArticlesButton: React.FC<React.PropsWithChildren<Props>> = ({
  backgroundColor,
  foregroundColor,
  customText,
  onPress,
}) => {
  const {colors, strings} = useTheme();

  return (
    <TouchableDebounce debounceTime={500} onPress={onPress}>
      <View
        style={{
          ...styles.container,
          backgroundColor: backgroundColor ?? colors.greyBackground,
        }}>
        <TextComponent style={{...styles.title, color: foregroundColor}}>
          {customText ?? strings.moreButtonText}
        </TextComponent>
      </View>
    </TouchableDebounce>
  );
};

export default MoreArticlesButton;

const styles = StyleSheet.create({
  container: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
  },
});
