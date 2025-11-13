import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useAuth0} from 'react-native-auth0';
import UserAvatar from './UserAvatar';
import {IconSettings2, IconUserNew} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import Config from 'react-native-config';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';

const UserHeader: React.FC = () => {
  const {user, authorize, saveCredentials} = useAuth0();
  const {colors} = useTheme();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const userEmail = user?.email || '-';

  const handleProfileSettings = () => {
    navigation.navigate('UserPersonalSettings');
  };

  if (!user) {
    return (
      <TouchableDebounce
        onPress={() =>
          authorize({
            //"openid profile email" are default scopes
            //"offline_access" is needed to get refresh token
            scope: 'openid profile email offline_access',
            audience: Config.AUTH0_AUDIENCE,
          })
            .then(saveCredentials)
            .then(() => logEvent(getAnalytics(), 'app_lrt_lt_user_signed_in'))
        }>
        <View style={styles.container}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconUserNew size={24} color={colors.onPrimary} />
          </View>
          <Text style={styles.headerText}>PRISIJUNGTI</Text>
        </View>
      </TouchableDebounce>
    );
  }

  return (
    <TouchableDebounce onPress={handleProfileSettings}>
      <View style={[styles.container, {borderColor: colors.border}]}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16}}>
          <UserAvatar size={40} />
          <View>
            <Text style={[styles.emailText, {}]} fontFamily="SourceSansPro-SemiBold">
              {user?.name}
            </Text>
            <Text style={[styles.emailText]} type="secondary">
              {userEmail}
            </Text>
          </View>
        </View>
        <IconSettings2 size={18} color={colors.iconInactive} />
      </View>
    </TouchableDebounce>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 73,
    gap: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emailText: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
