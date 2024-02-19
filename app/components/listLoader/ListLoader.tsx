import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';

const ListLoader: React.FC<React.PropsWithChildren<{}>> = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" animating={true} color={colors.primary} />
    </View>
  );
};

export default ListLoader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
