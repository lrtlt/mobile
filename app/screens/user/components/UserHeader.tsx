import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useAuth0} from 'react-native-auth0';
import UserAvatar from './UserAvatar';
import {IconUserNew} from '../../../components/svg';
import {useTheme} from '../../../Theme';

const UserHeader: React.FC = () => {
  const {user, authorize} = useAuth0();
  const {colors} = useTheme();

  const userEmail = user?.email || '-';

  if (!user) {
    return (
      <TouchableDebounce onPress={authorize}>
        <View style={styles.container}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.buttonBorder,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconUserNew size={24} color={colors.text} />
          </View>
          <Text style={{fontSize: 16, color: colors.tertiary}}>Prisijungti / Registruotis</Text>
        </View>
      </TouchableDebounce>
    );
  }

  return (
    <View style={styles.container}>
      <UserAvatar size={60} />
      <View>
        <Text style={[styles.emailText, {}]} fontFamily="SourceSansPro-SemiBold">
          {user?.name}
        </Text>
        <Text style={[styles.emailText]} type="secondary">
          {userEmail}
        </Text>
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 73,
    gap: 16,
  },
  emailText: {
    fontSize: 16,
  },
});
