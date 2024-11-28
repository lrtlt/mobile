import {DrawerNavigationProp} from '@react-navigation/drawer';
import React from 'react';
import {MenuItemPage} from '../../../api/Types';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconLituanica} from '../../svg';
import {MainStackParamList} from '../../../navigation/MainStack';

interface Props {
  navigation: DrawerNavigationProp<MainStackParamList>;
  pages?: MenuItemPage[];
}

const DrawerBlockPages: React.FC<React.PropsWithChildren<Props>> = ({navigation, pages}) => {
  if (!pages || pages.length <= 0) {
    console.log('invalid pages data');
    return null;
  }

  return (
    <>
      {pages.map((page) => (
        <DrawerItem
          key={page.name}
          // text={page.name}
          iconComponent={<IconLituanica width={120} />}
          onPress={() => navigation.navigate('Page', {page})}
        />
      ))}
    </>
  );
};

export default React.memo(DrawerBlockPages);
