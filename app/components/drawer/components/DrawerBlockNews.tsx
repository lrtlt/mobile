import {DrawerNavigationProp} from '@react-navigation/drawer';
import React from 'react';
import {MenuItem, MenuItemCategory} from '../../../api/Types';
import {useTheme} from '../../../Theme';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';
import {useNavigationStore} from '../../../state/navigation_store';
import {MainStackParamList} from '../../../navigation/MainStack';

interface Props {
  navigation: DrawerNavigationProp<MainStackParamList>;
  items?: (MenuItem | MenuItemCategory)[];
}

const DrawerBlockNews: React.FC<React.PropsWithChildren<Props>> = ({items, navigation}) => {
  const {strings} = useTheme();

  if (!items || items.length <= 0) {
    console.log('invalid news data');
    return null;
  }

  return (
    <DrawerCollapsibleBlock title={strings.drawerMenu}>
      {items.map((route) => {
        return (
          <DrawerItem
            key={route.name}
            text={route.name}
            onPress={() => {
              navigation.closeDrawer();
              useNavigationStore.getState().openCategoryByName(route.name);
            }}
          />
        );
      })}
    </DrawerCollapsibleBlock>
  );
};

export default React.memo(DrawerBlockNews, (prev, next) => checkEqual(prev.items, next.items));
