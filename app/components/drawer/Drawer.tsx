import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {selectDrawerData} from '../../redux/selectors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../Theme';
import Divider from '../divider/Divider';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {DrawerContentComponentProps, DrawerContentOptions} from '@react-navigation/drawer';
import DrawerBlockProjects from './components/DrawerBlockProjects';
import DrawerBlockChannels from './components/DrawerBlockChannels';
import DrawerBlockNews from './components/DrawerBlockNews';
import DrawerBlockFooter from './components/DrawerBlockFooter';
import DrawerBlockTop from './components/DrawerBlockTop';
import DrawerBlockPages from './components/DrawerBlockPages';

type Props = DrawerContentComponentProps<DrawerContentOptions>;

const DrawerComponent: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const data = useSelector(selectDrawerData, checkEqual);
  const insets = useSafeAreaInsets();

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
          },
        ]}>
        <View style={styles.headerContainer}>
          <DrawerBlockTop navigation={navigation} />
        </View>
        <Divider style={styles.line} />
        <DrawerBlockChannels key="channels" navigation={navigation} channels={data.channels} />
        <Divider style={styles.line} />
        <DrawerBlockNews key="news" navigation={navigation} items={data.routes} />
        <Divider style={styles.line} />
        <DrawerBlockProjects key="projects" navigation={navigation} projects={data.projects} />
        <Divider style={styles.line} />
        <DrawerBlockPages key="pages" navigation={navigation} pages={data.pages} />
        <Divider style={styles.line} />
        <DrawerBlockFooter />
      </ScrollView>
    </View>
  );
};

export default DrawerComponent;

const drawerPadding = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    minHeight: '100%',
  },
  headerContainer: {
    paddingTop: drawerPadding,
    paddingBottom: drawerPadding,
  },
  line: {
    marginStart: drawerPadding * 2,
    marginEnd: drawerPadding * 2,
  },
});
