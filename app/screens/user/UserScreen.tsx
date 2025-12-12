import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import UserHeader from './components/UserHeader';
import {useTheme} from '../../Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import UserActions from './components/UserActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import UserHistory from './components/UserHistory';
import {RouteProp} from '@react-navigation/native';
import useLogin from './useLogin';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
  route: RouteProp<MainStackParamList, 'User'>;
};

const UserScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {strings} = useTheme();
  const {login} = useLogin();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.user,
    });
  }, []);

  useEffect(() => {
    if (route.params?.instantLogin) {
      login();
    }
  }, [route]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <UserHeader />
          {/* <UserSettings /> */}
          <UserHistory />
          <UserActions />
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
});
