import React from 'react';
import {View, StyleSheet, ColorValue} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  backgroundColor?: ColorValue;
  onPress: () => void;
}

const MoreArticlesButton: React.FC<Props> = ({backgroundColor, onPress}) => {
  const {colors, strings} = useTheme();

  const extraPadding = backgroundColor ? 8 : 0;

  return (
    <View style={{backgroundColor: backgroundColor}}>
      <TouchableDebounce debounceTime={500} onPress={onPress}>
        <View style={{...styles.container, padding: extraPadding, backgroundColor: colors.greyBackground}}>
          <TextComponent style={styles.title}>{strings.moreButtonText}</TextComponent>
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
    fontFamily: 'SourceSansPro-Regular',
    padding: 8,
    fontSize: 16,
  },
});
