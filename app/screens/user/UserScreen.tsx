import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import UserHeader from './components/UserHeader';
import {useTheme} from '../../Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import UserActions from './components/UserActions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const UserScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.user,
    });
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <UserHeader />
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
    gap: 12,
  },
});
