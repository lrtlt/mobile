import React from 'react';
import {View, Linking, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import DrawerItem from '../drawerItem/DrawerItem';
import {ScrollView} from 'react-native-gesture-handler';
import {getIconForChannel} from '../../util/UI';
import {selectDrawerData} from '../../redux/selectors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  EVENT_SELECT_CATEGORY_INDEX,
  URL_ABOUT,
  URL_CONTACTS,
  URL_FEEDBACK,
  URL_UPLOAD_NEWS,
} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import Divider from '../divider/Divider';
import {EventRegister} from 'react-native-event-listeners';
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

const DrawerComponent = (props) => {
  const {navigation} = props;

  const {colors, strings} = useTheme();

  const data = useSelector(selectDrawerData);

  const handleCategorySelection = (index) => {
    navigation.closeDrawer();
    EventRegister.emit(EVENT_SELECT_CATEGORY_INDEX, {index});
  };

  const renderFooterItems = () => {
    return (
      <View style={styles.footerContainer}>
        <Divider style={styles.line} />
        <DrawerItem
          key={strings.upload}
          text={strings.upload}
          iconComponent={<IconUpload size={22} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_UPLOAD_NEWS)}
        />
        <DrawerItem
          key={strings.feeback}
          text={strings.feeback}
          iconComponent={<IconError size={22} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_FEEDBACK)}
        />
        <DrawerItem
          key={strings.contacts}
          text={strings.contacts}
          iconComponent={<IconPhone size={22} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_CONTACTS)}
        />
        <DrawerItem
          key={strings.about}
          text={strings.about}
          iconComponent={<IconInfo size={22} color={colors.primaryDark} />}
          onPress={() => Linking.openURL(URL_ABOUT)}
        />
      </View>
    );
  };

  const renderChannelItems = () => {
    const channels = data.channels.map((channel) => {
      return (
        <DrawerItem
          key={channel.channel_title}
          text={channel.channel_title}
          iconComponent={getIconForChannel(channel.channel, 22)}
          onPress={() => {
            navigation.navigate('Channel', {channelId: channel.channel_id});
          }}
        />
      );
    });
    return (
      <View style={styles.channelContainer}>
        <TextComponent style={styles.title}>{strings.liveChannelTitle}</TextComponent>
        {channels}
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <DrawerItem
        key={strings.search}
        text={strings.search}
        iconComponent={<IconSearch size={22} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Search')}
      />
    );
  };

  const renderProgram = () => {
    return (
      <DrawerItem
        key={strings.tvProgram}
        text={strings.tvProgram}
        iconComponent={<IconTelevision size={22} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Program')}
      />
    );
  };

  const renderHistory = () => {
    return (
      <DrawerItem
        key={strings.history}
        text={strings.history}
        iconComponent={<IconClock size={22} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('History')}
      />
    );
  };

  const renderBookmarks = () => {
    return (
      <DrawerItem
        key={strings.bookmarks}
        text={strings.bookmarks}
        iconComponent={<IconBookmark size={22} color={colors.primaryDark} />}
        onPress={() => navigation.navigate('Bookmarks')}
      />
    );
  };

  const renderProjects = () => {
    const projects = data.projects;
    if (!projects || !projects.routes || projects.routes.length <= 0) {
      console.log('invalid projects data');
      return null;
    }

    const content = projects.routes.map((project) => (
      <DrawerItem
        key={project.key}
        text={project.title}
        onPress={() =>
          navigation.navigate('WebPage', {
            url: project.url,
            title: project.title,
          })
        }
      />
    ));

    return (
      <View>
        <TextComponent style={styles.title}>{projects.title}</TextComponent>
        {content}
      </View>
    );
  };

  const renderPages = () => {
    const pages = data.pages;

    if (pages && pages.length > 0) {
      const content = pages.map((page) => (
        <DrawerItem
          key={page.key}
          text={page.title}
          iconComponent={<IconLituanica size={22} color={colors.primaryLight} />}
          onPress={() => navigation.navigate('CustomPage', {page})}
        />
      ));

      return <View>{content}</View>;
    } else {
      return null;
    }
  };

  const content = data.routes.map((route, i) => {
    return <DrawerItem key={route.key} text={route.title} onPress={() => handleCategorySelection(i)} />;
  });

  return (
    <View style={{...styles.container, backgroundColor: colors.card}}>
      <SafeAreaView style={{flex: 1}} edges={['top', 'left']}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              {renderSearch()}
              {renderBookmarks()}
              {renderHistory()}
              {renderProgram()}
            </View>
            <Divider style={styles.line} />
            {renderChannelItems()}
            <Divider style={styles.line} />
            {renderProjects()}
            <Divider style={styles.line} />
            {renderPages()}
            <Divider style={styles.line} />
            <TextComponent style={styles.title}>{strings.drawerMenu}</TextComponent>
            {content}
            {renderFooterItems()}
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
