import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import SubscriptionsSettings from './SubscriptionsSettings';
import {Text} from '../../components';
import {useTheme} from '../../Theme';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const SubscriptionsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.subscriptoions,
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <Text style={styles.label} type="secondary" fontFamily="SourceSansPro-SemiBold">
            {'Prenumeratos'}
          </Text>
          <Text style={styles.caption} type="secondary" fontFamily="SourceSansPro-Regular">
            {'Pasirinkite laidą, apie kurią norite gauti pranešimus.'}
          </Text>

          <View style={{...styles.card}}>
            <SubscriptionsSettings />
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    minHeight: '100%',
  },
  card: {
    flex: 1,
    margin: 12,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    padding: 12,
    paddingTop: 24,
    paddingHorizontal: 12,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
