import React from 'react';
import {useCallback} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {URL_ABOUT, URL_CONTACTS, URL_FEEDBACK, URL_UPLOAD_NEWS} from '../../../constants';
import {useTheme} from '../../../Theme';
import DrawerItem from '../../drawerItem/DrawerItem';
import {IconError, IconInfo, IconPhone, IconUpload} from '../../svg';

interface Props {}

const DrawerBlockFooter: React.FC<React.PropsWithChildren<Props>> = () => {
  const {colors, strings, dim} = useTheme();

  const handleUploadNewsClick = useCallback(() => Linking.openURL(URL_UPLOAD_NEWS), []);
  const handleFeedbackClick = useCallback(() => Linking.openURL(URL_FEEDBACK), []);
  const handleContactsClick = useCallback(() => Linking.openURL(URL_CONTACTS), []);
  const handleAboutClick = useCallback(() => Linking.openURL(URL_ABOUT), []);

  return (
    <View style={styles.container}>
      <DrawerItem
        key={strings.upload}
        text={strings.upload}
        iconComponent={<IconUpload size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleUploadNewsClick}
      />
      <DrawerItem
        key={strings.feeback}
        text={strings.feeback}
        iconComponent={<IconError size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleFeedbackClick}
      />
      <DrawerItem
        key={strings.contacts}
        text={strings.contacts}
        iconComponent={<IconPhone size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleContactsClick}
      />
      <DrawerItem
        key={strings.about}
        text={strings.about}
        iconComponent={<IconInfo size={dim.drawerIconSize} color={colors.textSecondary} />}
        onPress={handleAboutClick}
      />
    </View>
  );
};

export default React.memo(DrawerBlockFooter);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
