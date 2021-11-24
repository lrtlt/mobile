import React from 'react';
import {View, StyleSheet, ColorValue} from 'react-native';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  backgroundColor?: ColorValue;
  customText?: string;
  onPress: () => void;
}

const MoreArticlesButton: React.FC<Props> = ({backgroundColor, customText, onPress}) => {
  const {colors, strings} = useTheme();

  const extraPadding = backgroundColor ? 8 : 0;

  return (
    <View style={{backgroundColor: backgroundColor}}>
      <TouchableDebounce debounceTime={500} onPress={onPress}>
        <View style={{...styles.container, padding: extraPadding, backgroundColor: colors.greyBackground}}>
          <TextComponent style={styles.title}>{customText ?? strings.moreButtonText}</TextComponent>
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default MoreArticlesButton;

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  title: {
    padding: 8,
    fontSize: 16,
  },
});
