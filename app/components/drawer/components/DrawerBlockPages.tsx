import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {MenuItemPage} from '../../../api/Types';
import {useTheme} from '../../../Theme';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconLituanica} from '../../svg';

interface Props {
  navigation: DrawerNavigationHelpers;
  pages?: MenuItemPage[];
}

const DrawerBlockPages: React.FC<Props> = ({navigation, pages}) => {
  const {dim} = useTheme();

  if (!pages || pages.length <= 0) {
    console.log('invalid pages data');
    return null;
  }

  return (
    <>
      {pages.map((page) => (
        <DrawerItem
          key={page.name}
          text={page.name}
          iconComponent={<IconLituanica size={dim.drawerIconSize} />}
          onPress={() => navigation.navigate('Page', {page})}
        />
      ))}
    </>
  );
};

export default React.memo(DrawerBlockPages);
