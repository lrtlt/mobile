import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {useCallback} from 'react';
import {useTheme} from '../../../Theme';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconBookmark, IconClock, IconSearch, IconTelevision} from '../../svg';

interface Props {
  navigation: DrawerNavigationHelpers;
}

const DrawerBlockTop: React.FC<Props> = ({navigation}) => {
  const {colors, strings, dim} = useTheme();

  const handleSearchClick = useCallback(() => navigation.navigate('Search'), [navigation]);
  const handleHistoryClick = useCallback(() => navigation.navigate('History'), [navigation]);
  const handleBookmarksClick = useCallback(() => navigation.navigate('Bookmarks'), [navigation]);
  const handleProgramClick = useCallback(() => navigation.navigate('Program'), [navigation]);

  return (
    <>
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
    </>
  );
};

export default React.memo(DrawerBlockTop);
