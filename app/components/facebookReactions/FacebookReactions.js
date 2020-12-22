import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {useSettings} from '../../settings/useSettings';
import {IconFacebook} from '../svg';

const FacebookReactions = (props) => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  return (
    <View style={{...styles.root, ...props.style}}>
      <View style={{...styles.container, borderColor: colors.buttonBorder}}>
        <View style={styles.iconHolder}>
          <IconFacebook size={16 + textSizeMultiplier} color={colors.facebook} />
        </View>
        <TextComponent style={{...styles.countText, color: colors.facebook}}>{props.count}</TextComponent>
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
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13.5,
  },
});
