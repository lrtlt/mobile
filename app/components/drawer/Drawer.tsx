import React, {useMemo} from 'react';
import {View, Linking, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DrawerItem from '../drawerItem/DrawerItem';
import {getIconForChannel} from '../../util/UI';
import {selectDrawerData} from '../../redux/selectors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {URL_ABOUT, URL_CONTACTS, URL_FEEDBACK, URL_UPLOAD_NEWS} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import Divider from '../divider/Divider';
import {
  IconBookmark,
  IconClock,
  IconError,
  IconInfo,
  IconLituanica,
  IconPhone,
  IconSearch,
  IconTelevision,
  IconUpload,
} from '../svg';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {openCategoryForName} from '../../redux/actions';
import {DrawerContentComponentProps, DrawerContentOptions} from '@react-navigation/drawer';

const ICON_SIZE = 18;

type Props = DrawerContentComponentProps<DrawerContentOptions>;

const DrawerComponent: React.FC<Props> = (props) => {
  const {navigation} = props;

  const {colors, strings} = useTheme();

  const data = useSelector(selectDrawerData, checkEqual);
  const dispatch = useDispatch();

  const footerItems = useMemo(() => {
    return (
      <View style={styles.footerContainer}>
        <Divider style={styles.line} />
        <DrawerItem
          key={strings.upload}
          text={strings.upload}
          iconComponent={<IconUpload size={ICON_SIZE} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_UPLOAD_NEWS)}
        />
        <DrawerItem
          key={strings.feeback}
          text={strings.feeback}
          iconComponent={<IconError size={ICON_SIZE} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_FEEDBACK)}
        />
        <DrawerItem
          key={strings.contacts}
          text={strings.contacts}
          iconComponent={<IconPhone size={ICON_SIZE} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_CONTACTS)}
        />
        <DrawerItem
          key={strings.about}
          text={strings.about}
          iconComponent={<IconInfo size={ICON_SIZE} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_ABOUT)}
        />
      </View>
    );
  }, [colors.primaryDark, strings.about, strings.contacts, strings.feeback, strings.upload]);

  const channelItems = useMemo(() => {
    return (
      <View style={styles.channelContainer}>
        <TextComponent style={styles.title}>{strings.liveChannelTitle}</TextComponent>
        {data.channels.map((channel) => {
          return (
            <DrawerItem
              key={channel.channel_title}
              text={channel.channel_title}
              iconComponent={getIconForChannel(channel.channel, ICON_SIZE)}
              onPress={() => {
                navigation.navigate('Channel', {channelId: channel.channel_id});
              }}
            />
          );
        })}
      </View>
    );
  }, [data.channels, navigation, strings.liveChannelTitle]);

  const searchItem = useMemo(() => {
    return (
      <DrawerItem
        key={strings.search}
        text={strings.search}
        iconComponent={<IconSearch size={ICON_SIZE} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Search')}
      />
    );
  }, [colors.primaryDark, navigation, strings.search]);

  const programItem = useMemo(() => {
    return (
      <DrawerItem
        key={strings.tvProgram}
        text={strings.tvProgram}
        iconComponent={<IconTelevision size={ICON_SIZE} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Program')}
      />
    );
  }, [colors.primaryDark, navigation, strings.tvProgram]);

  const historyItem = useMemo(() => {
    return (
      <DrawerItem
        key={strings.history}
        text={strings.history}
        iconComponent={<IconClock size={ICON_SIZE} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('History')}
      />
    );
  }, [colors.primaryDark, navigation, strings.history]);

  const bookmarksItem = useMemo(() => {
    return (
      <DrawerItem
        key={strings.bookmarks}
        text={strings.bookmarks}
        iconComponent={<IconBookmark size={ICON_SIZE} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Bookmarks')}
      />
    );
  }, [colors.primaryDark, navigation, strings.bookmarks]);

  const projectItems = useMemo(() => {
    const projects = data.projects;

    if (!projects || !projects.categories || projects.categories.length <= 0) {
      console.log('invalid projects data');
      return null;
    }

    return (
      <View>
        <TextComponent style={styles.title}>{projects.name}</TextComponent>
        {projects.categories.map((project) => (
          <DrawerItem
            key={project.name}
            text={project.name}
            onPress={() =>
              navigation.navigate('WebPage', {
                url: project.url,
                title: project.name,
              })
            }
          />
        ))}
      </View>
    );
  }, [data.projects, navigation]);

  const pageItems = useMemo(() => {
    const pages = data.pages;

    if (pages && pages.length > 0) {
      return (
        <View>
          {pages.map((page) => (
            <DrawerItem
              key={page.name}
              text={page.name}
              iconComponent={<IconLituanica size={ICON_SIZE} />}
              onPress={() => navigation.navigate('Page', {page})}
            />
          ))}
        </View>
      );
    } else {
      return null;
    }
  }, [data.pages, navigation]);

  const content = data.routes.map((route) => {
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
  });

  return (
    <View style={{...styles.container, backgroundColor: colors.card}}>
      <SafeAreaView edges={['top', 'left']}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              {searchItem}
              {bookmarksItem}
              {historyItem}
              {programItem}
            </View>
            <Divider style={styles.line} />
            {channelItems}
            <Divider style={styles.line} />
            {projectItems}
            <Divider style={styles.line} />
            {pageItems}
            <Divider style={styles.line} />
            <TextComponent style={styles.title}>{strings.drawerMenu}</TextComponent>
            {content}
            {footerItems}
          </View>
        </ScrollView>
      </SafeAreaView>
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
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    padding: drawerPadding * 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  channelContainer: {
    paddingBottom: drawerPadding,
  },
  headerContainer: {
    paddingTop: drawerPadding,
    paddingBottom: drawerPadding,
  },
  footerContainer: {
    paddingBottom: drawerPadding,
  },
  line: {
    marginStart: drawerPadding * 2,
    marginEnd: drawerPadding * 2,
  },
});
