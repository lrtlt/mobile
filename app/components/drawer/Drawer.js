import React from 'react';
import {View, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ScalableText from '../scalableText/ScalableText';
import Styles from './styles';
import {setSelectedCategory} from '../../redux/actions';
import DrawerItem from '../drawerItem/DrawerItem';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import {getIconForChannel} from '../../util/UI';
import {selectDrawerData} from '../../redux/selectors';
import {SafeAreaView} from 'react-native-safe-area-context';

const DrawerComponent = (props) => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const data = useSelector(selectDrawerData);

  const handleCategorySelection = (index) => {
    navigation.closeDrawer();
    dispatch(setSelectedCategory(index));
  };

  const renderFooterItems = () => {
    return (
      <View style={Styles.footerContainer}>
        <View style={Styles.line} />
        <DrawerItem
          key={EStyleSheet.value('$upload')}
          text={EStyleSheet.value('$upload')}
          iconComponent={<FeatherIcon name="upload" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => Linking.openURL(EStyleSheet.value('$upload_news_url'))}
        />
        <DrawerItem
          key={EStyleSheet.value('$feeback')}
          text={EStyleSheet.value('$feeback')}
          iconComponent={<FeatherIcon name="x-octagon" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => Linking.openURL(EStyleSheet.value('$feedback_url'))}
        />
        <DrawerItem
          key={EStyleSheet.value('$contacts')}
          text={EStyleSheet.value('$contacts')}
          iconComponent={<FeatherIcon name="phone" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => Linking.openURL(EStyleSheet.value('$contacts_url'))}
        />
        <DrawerItem
          key={EStyleSheet.value('$about')}
          text={EStyleSheet.value('$about')}
          iconComponent={<FeatherIcon name="info" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => Linking.openURL(EStyleSheet.value('$about_url'))}
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
      <View style={Styles.channelContainer}>
        <ScalableText style={Styles.title}>{EStyleSheet.value('$liveChannelTitle')}</ScalableText>
        {channels}
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <DrawerItem
        key={EStyleSheet.value('$search')}
        text={EStyleSheet.value('$search')}
        iconComponent={<FeatherIcon name="search" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => navigation.navigate('Search')}
      />
    );
  };

  const renderProgram = () => {
    return (
      <DrawerItem
        key={'program'}
        text={EStyleSheet.value('$tvProgram')}
        iconComponent={<FeatherIcon name="tv" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => navigation.navigate('Program')}
      />
    );
  };

  const renderHistory = () => {
    return (
      <DrawerItem
        key={'history'}
        text={EStyleSheet.value('$history')}
        iconComponent={<FeatherIcon name="clock" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => navigation.navigate('History')}
      />
    );
  };

  const renderBookmarks = () => {
    return (
      <DrawerItem
        key={'bookmarks'}
        text={EStyleSheet.value('$bookmarks')}
        iconComponent={<FeatherIcon name="bookmark" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => navigation.navigate('Bookmarks')}
      />
    );
  };

  const renderPages = () => {
    const pages = data.pages;

    if (pages && pages.length > 0) {
      const content = pages.map((page) => (
        <DrawerItem
          key={page.key}
          text={page.title}
          iconComponent={<FeatherIcon name="globe" size={22} color={EStyleSheet.value('$primaryLight')} />}
          onPress={() => navigation.navigate('CustomPage', {page})}
        />
      ));

      return (
        <View>
          <View style={Styles.line} />
          {content}
        </View>
      );
    } else {
      return null;
    }
  };

  const content = data.routes.map((route, i) => {
    return <DrawerItem key={route.key} text={route.title} onPress={() => handleCategorySelection(i)} />;
  });

  return (
    <View style={Styles.container}>
      <SafeAreaView style={{flex: 1}} edges={['top', 'left']}>
        <ScrollView style={Styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={Styles.content}>
            <View style={Styles.headerContainer}>
              {renderSearch()}
              {renderBookmarks()}
              {renderHistory()}
              {renderProgram()}
            </View>
            <View style={Styles.line} />
            {renderChannelItems()}

            <View style={Styles.line} />
            <ScalableText style={Styles.title}>{EStyleSheet.value('$drawerMenu')}</ScalableText>
            {content}
            {renderPages()}
            {renderFooterItems()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DrawerComponent;
