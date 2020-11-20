import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {useSettings} from '../../settings/useSettings';

const FacebookReactions = (props) => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  return (
    <View style={{...styles.root, ...props.style}}>
      <View style={{...styles.container, borderColor: colors.buttonBorder}}>
        <Icon style={styles.icon} name="facebook" size={20 + textSizeMultiplier} color={colors.facebook} />
        <TextComponent style={{...styles.countText, color: colors.facebook}}>{props.count}</TextComponent>
      </View>
    </View>
  );
};

export default FacebookReactions;

const styles = StyleSheet.create({
  root: {
    alignSelf: 'baseline',
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
  countText: {
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13.5,
  },
});
