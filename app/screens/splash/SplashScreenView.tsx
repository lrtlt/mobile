import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Logo} from '../../components/svg';

import {themeDark, themeLight} from '../../Theme';
import {useSettings} from '../../settings/useSettings';

const SplashViewComponent: React.FC = () => {
  const {isDarkMode} = useSettings();
  const colors = isDarkMode ? themeDark.colors : themeLight.colors;

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <Logo size={100} />
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
