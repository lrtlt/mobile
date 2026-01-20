import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import SettingsNotifications from '../settings/SettingsNotifications';
import {Text} from '../../components';
import {useTheme} from '../../Theme';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const NotificationsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.notifications,
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <Text style={styles.label} type="secondary" fontFamily="SourceSansPro-SemiBold">
            {'Pranešimai'}
          </Text>
          <Text style={styles.caption} type="secondary" fontFamily="SourceSansPro-Regular">
            {'Galite prenumeruoti į telefoną siunčiamus pranešimus (push notifications).'}
          </Text>

          <View style={{...styles.card}}>
            <SettingsNotifications />
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  card: {
    borderRadius: 16,
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
