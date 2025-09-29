import React, {useEffect} from 'react';
import {useCallback} from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {View} from 'react-native';
import {useTheme} from '../../../Theme';
import DrawerItem from '../../drawerItem/DrawerItem';
import {MainStackParamList} from '../../../navigation/MainStack';
import {IconBookmark, IconClock, IconSearch, IconTelevision, IconUser} from '../../svg';
import {useAuth0} from 'react-native-auth0';

interface Props {
  navigation: DrawerNavigationProp<MainStackParamList>;
}

const DrawerBlockTop: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors, strings, dim} = useTheme();
  const {authorize, clearSession, user, getCredentials} = useAuth0();

  const handleSearchClick = useCallback(
    () =>
      navigation.navigate('Search', {
        screen: 'SearchScreen',
        params: {},
      }),
    [navigation],
  );
  const handleHistoryClick = useCallback(() => navigation.navigate('History'), [navigation]);
  const handleBookmarksClick = useCallback(() => navigation.navigate('Bookmarks'), [navigation]);
  const handleProgramClick = useCallback(() => navigation.navigate('Program'), [navigation]);

  useEffect(() => {
    getCredentials()
      .then((credentials) => {
        console.log('user', user);
        console.log('getCredentials', credentials);
      })
      .catch((error) => {
        console.warn('getCredentials error', error);
      });
  }, [user]);

  return (
    <View style={{paddingVertical: dim.drawerPadding}}>
      <DrawerItem
        key={user ? strings.logout : strings.login}
        text={user ? strings.logout : strings.login}
        iconComponent={<IconUser size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={async () => {
          if (user) {
            await clearSession();
          } else {
            await authorize();
          }
        }}
      />
      <DrawerItem
        key={strings.search}
        text={strings.search}
        iconComponent={<IconSearch size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleSearchClick}
      />
      <DrawerItem
        key={strings.history}
        text={strings.history}
        iconComponent={<IconClock size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleHistoryClick}
      />
      <DrawerItem
        key={strings.bookmarks}
        text={strings.bookmarks}
        iconComponent={<IconBookmark size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleBookmarksClick}
      />
      <DrawerItem
        key={strings.tvProgram}
        text={strings.tvProgram}
        iconComponent={<IconTelevision size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleProgramClick}
      />
    </View>
  );
};

export default React.memo(DrawerBlockTop);
