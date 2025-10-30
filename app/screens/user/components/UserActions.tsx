import React from 'react';
import {View, StyleSheet} from 'react-native';
import {strings, useTheme} from '../../../Theme';

import {useAuth0} from 'react-native-auth0';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {IconApplicationSettings, IconBell, IconBookmarkNew} from '../../../components/svg';
import UserActionItem from './UserActionItem';

const UserActions: React.FC = () => {
  const {user} = useAuth0();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors} = useTheme();

  const handleFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleAppSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <UserActionItem
        icon={<IconBookmarkNew size={32} color={colors.iconInactive} />}
        label={strings.bookmarks}
        onPress={user ? handleFavorites : undefined}
      />
      <UserActionItem
        icon={<IconBell size={32} color={colors.iconInactive} />}
        label={'PRANEŠIMAI'}
        onPress={handleNotifications}
      />

      <UserActionItem
        icon={<IconApplicationSettings size={32} color={colors.iconInactive} />}
        label="PROGRAMĖLĖS NUSTATYMAI"
        onPress={handleAppSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 12,
  },
});

export default UserActions;
