import React from 'react';
import {View, StyleSheet} from 'react-native';

import {themeDark, themeLight} from '../../Theme';
import {Logo} from '../../components';
import {useSettingsStore} from '../../state/settings';

const SplashViewComponent: React.FC<React.PropsWithChildren<{}>> = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const colors = isDarkMode ? themeDark.colors : themeLight.colors;

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <Logo width={120} height={120} />
    </View>
  );
};

export default SplashViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  loader: {
    position: 'absolute',
    bottom: '20%',
  },
  errorText: {
    marginTop: 40,

    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 24,
    width: '50%',
  },
});
