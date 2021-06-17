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
import {useCallback} from 'react';
import useOnDrawerClose from './useOnDrawerClose';
import {useRef} from 'react';

type Props = DrawerContentComponentProps<DrawerContentOptions>;

const DrawerComponent: React.FC<Props> = ({navigation}) => {
  const {colors, dim} = useTheme();
  const data = useSelector(selectDrawerData, checkEqual);
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);

  const Line = useCallback(() => <Divider style={{marginHorizontal: dim.drawerPadding * 2}} />, [
    dim.drawerPadding,
  ]);

  useOnDrawerClose(
    useCallback(() => {
      scrollRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }, []),
  );

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <ScrollView
        ref={scrollRef}
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
        <DrawerBlockTop navigation={navigation} />
        <Line />
        <DrawerBlockChannels key="channels" navigation={navigation} channels={data.channels} />
        <Line />
        <DrawerBlockNews key="news" navigation={navigation} items={data.routes} />
        <DrawerBlockProjects key="projects" navigation={navigation} projectBlocks={data.webPageProjects} />
        <Line />
        <DrawerBlockPages key="pages" navigation={navigation} pages={data.pages} />
        <Line />
        <DrawerBlockFooter />
      </ScrollView>
    </View>
  );
};

export default DrawerComponent;

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
});
