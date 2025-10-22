import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TouchableDebounce} from '../../components';
import {useAuth0} from 'react-native-auth0';
import * as HttpClient from '../../api/HttpClient';
import {useTheme} from '../../Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const UserScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {authorize, clearSession, user, getCredentials} = useAuth0();
  const {colors, strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.user,
    });
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    getCredentials()
      .then((credentials) => {
        if (credentials?.idToken) {
          // HttpClient.get('https://www.lrt.lt/servisai/authrz/user/me', {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //   },
          // }).catch((_) => {
          //   console.warn('me GET error');
          // });
          // HttpClient.get('https://www.lrt.lt/servisai/authrz/user/history/1', {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // }).catch((_) => {
          //   console.warn('history GET error');
          // });
          // HttpClient.put('https://www.lrt.lt/servisai/authrz/user/history/1234567', undefined, {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // }).catch((error) => {
          //   console.warn('history PUT error');
          // });
          // HttpClient.put('https://www.lrt.lt/servisai/authrz/user/articles/1234567', undefined, {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // }).catch((error) => {
          //   console.warn('articles PUT error');
          // });
          // HttpClient.get('https://www.lrt.lt/servisai/authrz/user/articles', {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // }).catch((_) => {
          //   console.warn('articles GET error');
          // });
          // HttpClient.del('https://www.lrt.lt/servisai/authrz/user/articles/123456', {
          //   headers: {
          //     Authorization: `Bearer ${credentials?.idToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // }).catch((_) => {
          //   console.warn('articles DELETE error');
          // });
          // HttpClient.put(
          //   'https://www.lrt.lt/servisai/authrz/user/set-onboarding-completed/1',
          //   {
          //     onboardingCompleted: true,
          //   },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${credentials?.idToken}`,
          //       'Content-Type': 'application/json',
          //     },
          //   },
          // ).catch((error) => {
          //   console.warn('onboarding PUT error');
          // });
        }
      })
      .catch((error) => {
        console.warn('getCredentials error', error);
      });
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user ? `Logged in as ${user.name}` : 'Not logged in'}</Text>
      <TouchableDebounce style={styles.button}>
        <Text
          style={styles.text}
          onPress={async () => {
            if (user) {
              await clearSession();
            } else {
              await authorize();
            }
          }}>
          {user ? strings.logout : strings.login}
        </Text>
      </TouchableDebounce>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 12,
    backgroundColor: '#DDD',
  },
  text: {
    fontSize: 18,
  },
});
