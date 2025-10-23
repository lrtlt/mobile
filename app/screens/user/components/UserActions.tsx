import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';

import {useAuth0} from 'react-native-auth0';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {Text, TouchableDebounce} from '../../../components';
import {
  IcDelete,
  IcLogout,
  IconApplicationSettings,
  IconHeart,
  IconProfileSettings,
  IconStarList,
} from '../../../components/svg';

interface UserActionItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const UserActionItem: React.FC<UserActionItemProps> = ({icon, label, onPress, isDestructive}) => {
  const {colors} = useTheme();
  return (
    <TouchableDebounce
      style={[
        styles.actionItem,
        {borderColor: colors.border},
        isDestructive && {borderColor: colors.textError, borderWidth: 1},
      ]}
      onPress={onPress}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.actionLabel, {color: isDestructive ? colors.textError : colors.text}]}>
        {label}
      </Text>
    </TouchableDebounce>
  );
};

const UserActions: React.FC = () => {
  const {clearSession, user} = useAuth0();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors} = useTheme();

  const handleSave = () => {
    navigation.navigate('Bookmarks');
  };

  const handleFollowedTopics = () => {
    console.log('SEKAMOS TEMOS pressed');
  };

  const handleProfileSettings = () => {
    console.log('PROFILIO NUSTATYMAI pressed');
  };

  const handleAppSettings = () => {
    navigation.navigate('Settings');
  };

  const handleLogout = async () => {
    if (user) {
      await clearSession();
      navigation.pop();
    }
  };

  const handleDeleteAccount = () => {
    console.log('IŠTRINTI LRT PASKYRĄ pressed');
  };

  return (
    <View style={styles.container}>
      <UserActionItem
        icon={<IconHeart size={32} color={colors.text} />}
        label="IŠSAUGOTI"
        onPress={handleSave}
      />
      <UserActionItem
        icon={<IconStarList size={32} color={colors.text} />}
        label="SEKAMOS TEMOS"
        onPress={handleFollowedTopics}
      />
      <UserActionItem
        icon={<IconProfileSettings size={32} color={colors.text} />}
        label="PROFILIO NUSTATYMAI"
        onPress={handleProfileSettings}
      />
      <UserActionItem
        icon={<IconApplicationSettings size={32} color={colors.text} />}
        label="APLIKACIJOS NUSTATYMAI"
        onPress={handleAppSettings}
      />
      <UserActionItem
        icon={<IcLogout size={32} color={colors.text} />}
        label="ATSIJUNGTI"
        onPress={handleLogout}
      />
      <UserActionItem
        icon={<IcDelete size={32} color={colors.text} />}
        label="IŠTRINTI LRT PASKYRĄ"
        onPress={handleDeleteAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserActions;
