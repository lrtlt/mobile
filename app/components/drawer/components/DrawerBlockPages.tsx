import {DrawerNavigationProp} from '@react-navigation/drawer';
import React from 'react';
import {MenuItemPage} from '../../../api/Types';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconLituanica} from '../../svg';
import {MainStackParamList} from '../../../navigation/MainStack';
import {View} from 'react-native';

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
        <View key={page.name} accessibilityLabel={`${page.name} polapis`}>
          <DrawerItem
            // text={page.name}
            iconComponent={<IconLituanica width={120} />}
            onPress={() => navigation.navigate('Page', {page})}
          />
        </View>
      ))}
    </>
  );
};

export default React.memo(DrawerBlockPages);
