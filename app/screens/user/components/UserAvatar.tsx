import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import {useAuth0} from 'react-native-auth0';
import {useTheme} from '../../../Theme';
import FastImage from '@d11/react-native-fast-image';

interface Props {
  size: number;
}

const UserAvatar: React.FC<Props> = ({size}) => {
  const {user} = useAuth0();
  const {colors} = useTheme();

  const getInitials = (name: string | undefined) => {
    if (!name) {
      return '??';
    }
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      }}>
      {user?.picture ? (
        <FastImage
          source={{uri: user.picture}}
          style={{...styles.avatarContainer, width: size, height: size}}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[styles.avatarContainer, {backgroundColor: colors.primaryDark, width: size, height: size}]}>
          <Text style={[styles.avatarText, {color: colors.onPrimary}]}>{userInitials}</Text>
        </View>
      )}
    </View>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
