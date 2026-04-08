import React, {useEffect, useState} from 'react';
import {AppState, Linking, Platform, StyleSheet, View} from 'react-native';
import {checkNotifications} from 'react-native-permissions';
import {Text, TouchableDebounce} from '../../../components';
import {IconChevronLeft} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import notifee from '@notifee/react-native';

const NotificationBanner: React.FC = () => {
  const {colors} = useTheme();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await checkNotifications();
      setDenied(result.status !== 'granted');
    };
    check();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        check();
      }
    });
    return () => subscription.remove();
  }, []);

  if (!denied) {
    return null;
  }

  const handlePress = Platform.select({
    ios: () => Linking.openURL('app-settings:'),
    android: () => notifee.openNotificationSettings(),
  });

  return (
    <View style={styles.wrapper}>
      <TouchableDebounce onPress={handlePress} style={[styles.container]}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: '#E7792B'}]} fontFamily="SourceSansPro-Regular">
            Dėmesio!
          </Text>
          <Text style={[styles.message]}>
            Prenumeratų pranešimai šiuo metu išjungti. Įjunkite juos nustatymuose, kad gautumėte naujienas
          </Text>
        </View>
        <IconChevronLeft size={24} color={colors.text} />
      </TouchableDebounce>
    </View>
  );
};

export default NotificationBanner;

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    paddingBottom: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderLeftColor: '#FFC107DA',
    borderLeftWidth: 2,
    backgroundColor: '#FFC1070F',
  },

  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
