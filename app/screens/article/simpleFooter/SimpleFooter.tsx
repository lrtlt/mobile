import {StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../navigation/MainStack';
import {useCallback} from 'react';
import SimpleDisclaimer from './SimpleDisclaimer';

const SimpleFooter: React.FC<React.PropsWithChildren> = () => {
  const {dark, colors} = useTheme();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const onPressHandler = useCallback(() => {
    navigation.navigate('Simple', undefined, {
      pop: true,
    });
  }, [navigation]);

  return (
    <View style={{...styles.container, backgroundColor: colors.greyBackground}}>
      <View style={{padding: 24}}>
        <SimpleDisclaimer />
      </View>
      <TouchableDebounce
        style={{...styles.button, backgroundColor: dark ? colors.slugBackground : colors.primary}}
        onPress={onPressHandler}>
        <Text style={{...styles.buttonText, color: colors.onPrimary}}>DAUGIAU</Text>
      </TouchableDebounce>
    </View>
  );
};

export default SimpleFooter;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 32,
    borderRadius: 6,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 14,
  },
  button: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
