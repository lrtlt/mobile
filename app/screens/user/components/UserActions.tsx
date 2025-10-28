import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {strings, useTheme} from '../../../Theme';

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
} from '../../../components/svg';
import {useDeleteCurrentUser} from '../../../api/hooks/useUser';
import ConfirmModal from '../../weather/ConfirmModal';
import queryClient from '../../../../AppQueryClient';

interface UserActionItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const UserActionItem: React.FC<UserActionItemProps> = ({icon, label, onPress, isDestructive}) => {
  const {colors} = useTheme();
  return (
    <TouchableDebounce
      style={[
        styles.actionItem,
        {borderColor: colors.border, opacity: onPress ? 1 : 0.4},
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
  const [deleteAccountConfirmVisible, setDeleteAccountConfirmVisible] = useState(false);
  const {mutateAsync: deleteUser} = useDeleteCurrentUser();

  const handleFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleProfileSettings = () => {
    navigation.navigate('UserPersonalSettings');
  };

  const handleAppSettings = () => {
    navigation.navigate('Settings');
  };

  const handleLogout = async () => {
    if (user) {
      await clearSession();
      queryClient.removeQueries();
      queryClient.invalidateQueries();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      queryClient.removeQueries();
      await clearSession();
      navigation.pop();
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };

  return (
    <View style={styles.container}>
      <UserActionItem
        icon={<IconHeart size={32} color={colors.text} />}
        label={strings.favorites}
        onPress={user ? handleFavorites : undefined}
      />
      {/* <UserActionItem
        icon={<IconStarList size={32} color={colors.text} />}
        label="SEKAMOS TEMOS"
        onPress={handleFollowedTopics}
      /> */}
      <UserActionItem
        icon={<IconProfileSettings size={32} color={colors.text} />}
        label="PROFILIO NUSTATYMAI"
        onPress={user ? handleProfileSettings : undefined}
      />
      <UserActionItem
        icon={<IconApplicationSettings size={32} color={colors.text} />}
        label="APLIKACIJOS NUSTATYMAI"
        onPress={handleAppSettings}
      />
      <UserActionItem
        icon={<IcLogout size={32} color={colors.text} />}
        label="ATSIJUNGTI"
        onPress={user ? handleLogout : undefined}
      />
      <UserActionItem
        icon={<IcDelete size={32} color={colors.text} />}
        label="IŠTRINTI LRT PASKYRĄ"
        onPress={user ? () => setDeleteAccountConfirmVisible(true) : undefined}
      />
      <ConfirmModal
        title="Ar tikrai norite ištrinti paskyrą?"
        visible={deleteAccountConfirmVisible}
        onCancel={() => setDeleteAccountConfirmVisible(false)}
        onConfirm={() => {
          handleDeleteAccount();
          setDeleteAccountConfirmVisible(false);
        }}
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
