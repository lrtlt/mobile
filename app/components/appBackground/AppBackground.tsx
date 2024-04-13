import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useSettings} from '../../settings/useSettings';
import {themeDark, themeLight, useTheme} from '../../Theme';

interface Props {
  style?: ViewStyle;
}

const AppBackground: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  return <View style={{...styles.container, backgroundColor: colors.background}}>{props.children}</View>;
};

export default AppBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
