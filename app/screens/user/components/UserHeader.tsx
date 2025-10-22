import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import {useAuth0} from 'react-native-auth0';
import UserAvatar from './UserAvatar';

const UserHeader: React.FC = () => {
  const {user} = useAuth0();
  const userEmail = user?.email || 'Not logged in';

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
    gap: 16,
  },
  emailText: {
    fontSize: 16,
  },
});
