import React from 'react';
import {View, StyleSheet} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const PhotoCount = (props) => {
  const {colors} = useTheme();

  return (
    <View style={{...styles.container, backgroundColor: colors.lightGreyBackground, ...props.style}}>
      <Icon
        name="photo-camera"
        size={18 + EStyleSheet.value('$textSizeMultiplier')}
        color={colors.darkIcon}
      />
      <TextComponent style={{...styles.countText, color: colors.darkIcon}}>{props.count}</TextComponent>
    </View>
  );
};

export default PhotoCount;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingStart: 6,
    paddingEnd: 6,
  },
  countText: {
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13.5,
  },
});
