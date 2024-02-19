import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useSettings} from '../../settings/useSettings';
import {useTheme} from '../../Theme';
import {IconPhotoCamera} from '../svg';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  count?: number | string;
}

const PhotoCount: React.FC<React.PropsWithChildren<Props>> = ({style, count}) => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  return (
    <View style={{...styles.container, backgroundColor: colors.lightGreyBackground, ...style}}>
      <View style={styles.iconHolder}>
        <IconPhotoCamera size={18 + textSizeMultiplier} color={colors.darkIcon} />
      </View>
      <TextComponent style={{...styles.countText, color: colors.darkIcon}}>{count}</TextComponent>
    </View>
  );
};

export default PhotoCount;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    paddingStart: 6,
    paddingEnd: 6,
  },
  iconHolder: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    paddingStart: 4,

    fontSize: 13.5,
  },
});
