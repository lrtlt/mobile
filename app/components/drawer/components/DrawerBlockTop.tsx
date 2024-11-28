import {DrawerNavigationProp} from '@react-navigation/drawer';
import React from 'react';
import {useCallback} from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../Theme';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconBookmark, IconClock, IconSearch, IconTelevision} from '../../svg';
import {MainStackParamList} from '../../../navigation/MainStack';

interface Props {
  navigation: DrawerNavigationProp<MainStackParamList>;
}

const DrawerBlockTop: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors, strings, dim} = useTheme();

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

  return (
    <View style={{paddingVertical: dim.drawerPadding}}>
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
