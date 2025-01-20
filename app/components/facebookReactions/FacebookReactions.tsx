import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {IconFacebook} from '../svg';
import {useSettingsStore} from '../../state/settings_store';

interface Props {
  style?: ViewStyle;
  count?: number | string;
}

const FacebookReactions: React.FC<React.PropsWithChildren<Props>> = ({style, count}) => {
  const {colors} = useTheme();
  const textSizeMultiplier = useSettingsStore((state) => state.textSizeMultiplier);

  return (
    <View style={{...styles.root, ...style}} importantForAccessibility="no">
      <View style={{...styles.container, borderColor: colors.buttonBorder}}>
        <View style={styles.iconHolder}>
          <IconFacebook size={16 + textSizeMultiplier} color={colors.facebook} />
        </View>
        <TextComponent style={{...styles.countText, color: colors.facebook}} importantForAccessibility="no">
          {count}
        </TextComponent>
      </View>
    </View>
  );
};

export default FacebookReactions;

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingStart: 4,
    paddingTop: 1,
    paddingBottom: 1,
    paddingEnd: 4,
    borderRadius: 4,
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
