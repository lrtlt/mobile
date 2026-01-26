import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {CastButton} from 'react-native-google-cast';
import {ICON_SIZE} from '../MediaControls.constants';

const ChromeCastButton: React.FC = () => {
  return <CastButton style={styles.castButton} tintColor="white" />;
};

export default memo(ChromeCastButton);

const styles = StyleSheet.create({
  castButton: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
