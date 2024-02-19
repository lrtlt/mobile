import React from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';

interface Props {
  style?: ViewStyle;
}

const ScreenLoader: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, props.style]}>
      <ActivityIndicator size="large" animating={true} color={colors.buttonContent} />
    </View>
  );
};

export default ScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
