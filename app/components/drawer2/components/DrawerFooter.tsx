import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';
import {IconAbout, IconContacts, IconNewsletter, IconShop, IconWeather} from '../../svg';
import {Menu2Item} from '../../../api/Types';
import DrawerSubItem from './DrawerSubItem';
import Text from '../../text/Text';

interface Props {
  onPress: (item: Menu2Item) => void;
}

const DrawerFooter: React.FC<React.PropsWithChildren<Props>> = ({onPress}) => {
  const {colors, strings, dim} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text fontFamily="SourceSansPro-SemiBold" style={{...styles.text, color: '#97A2B6'}}>
          {'DAUGIAU'}
        </Text>
      </View>
      <DrawerSubItem
        key={strings.menu_weather}
        item={{type: 'weather', title: strings.menu_weather, url: 'https://www.lrt.lt/orai/'}}
        onPress={onPress}
        icon={<IconWeather size={dim.drawerIconSize} color={colors.text} />}
      />

      <DrawerSubItem
        key={strings.menu_shop}
        item={{
          type: 'webpage',
          title: strings.menu_shop,
          url: 'https://archyvai-parduotuve.lrt.lt/?_gl=1*pidahl*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
        }}
        onPress={onPress}
        icon={<IconShop size={dim.drawerIconSize} color={colors.text} />}
      />
      <DrawerSubItem
        key={strings.menu_newsletter}
        item={{
          type: 'webpage',
          title: strings.menu_newsletter,
          url: 'https://naujienlaiskis.lrt.lt/?_gl=1*pidahl*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
        }}
        onPress={onPress}
        icon={<IconNewsletter size={dim.drawerIconSize} color={colors.text} />}
      />
      <DrawerSubItem
        key={strings.menu_contacts}
        item={{
          type: 'webpage',
          title: strings.menu_contacts,
          url: 'https://apie.lrt.lt/kontaktai/rasykite-mums?_gl=1*64pwe6*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
        }}
        onPress={onPress}
        icon={<IconContacts size={dim.drawerIconSize} color={colors.text} />}
      />
      <DrawerSubItem
        key={strings.menu_about}
        item={{
          type: 'webpage',
          title: strings.menu_about,
          url: 'https://apie.lrt.lt/?_gl=1*64pwe6*_gcl_au*MTM5MDA2ODE3My4xNzU1NzYxNjA2',
        }}
        onPress={onPress}
        icon={<IconAbout size={dim.drawerIconSize} color={colors.text} />}
      />
    </View>
  );
};

export default React.memo(DrawerFooter);

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    height: 52,
    justifyContent: 'center',
    paddingLeft: 32,
  },
  text: {
    fontSize: 15,
  },
});
