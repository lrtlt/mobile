import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {useDispatch} from 'react-redux';
import {MenuItem, MenuItemCategory} from '../../../api/Types';
import {openCategoryForName} from '../../../redux/actions';
import {useTheme} from '../../../Theme';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';

interface Props {
  navigation: DrawerNavigationHelpers;
  items?: (MenuItem | MenuItemCategory)[];
}

const DrawerBlockNews: React.FC<Props> = ({items, navigation}) => {
  const {strings} = useTheme();

  const dispatch = useDispatch();

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
              dispatch(openCategoryForName(route.name));
            }}
          />
        );
      })}
    </DrawerCollapsibleBlock>
  );
};

export default React.memo(DrawerBlockNews, (prev, next) => checkEqual(prev.items, next.items));
