import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useSettings} from '../../settings/useSettings';
import {themeDark, themeLight} from '../../Theme';

interface Props {
  style?: ViewStyle;
}

const AppBackground: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const settings = useSettings();
  const theme = settings.isDarkMode ? themeDark : themeLight;

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>{props.children}</View>
  );
};

export default AppBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
