import React from 'react';
import {View, Linking} from 'react-native';
import {connect} from 'react-redux';
import ScalableText from '../scalableText/ScalableText';
import Styles from './styles';
import {setSelectedCategory} from '../../redux/actions';
import DrawerItem from '../drawerItem/DrawerItem';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import {getIconForChannel} from '../../util/UI';

class Drawer extends React.PureComponent {
  handleCategorySelection = (index) => {
    this.props.navigation.closeDrawer();
    this.props.dispatch(setSelectedCategory(index));
  };

  handleAboutPress = () => {
    Linking.openURL(EStyleSheet.value('$about_url'));
  };

  handleContactsPress = () => {
    Linking.openURL(EStyleSheet.value('$contacts_url'));
  };

  handleUploadPress = () => {
    Linking.openURL(EStyleSheet.value('$upload_news_url'));
  };

  handlePagePress = (page) => {
    this.props.navigation.push('customPage', {page});
  };

  handleSearchPress = () => {
    this.props.navigation.navigate('search');
  };

  handleFeedbackPress = () => {
    Linking.openURL(EStyleSheet.value('$feedback_url'));
  };

  onChannelPressHandler = (channelId) => {
    this.props.navigation.push('channel', {channelId: channelId});
  };

  onProgramPressHandler = () => {
    this.props.navigation.navigate('program');
  };

  onHistoryPressHandler = () => {
    this.props.navigation.navigate('history');
  };

  onBookmarksPressHandler = () => {
    this.props.navigation.navigate('bookmarks');
  };

  renderFooterItems() {
    return (
      <View style={Styles.footerContainer}>
        <View style={Styles.line} />
        <DrawerItem
          key={EStyleSheet.value('$upload')}
          text={EStyleSheet.value('$upload')}
          iconComponent={<FeatherIcon name="upload" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => this.handleUploadPress()}
        />
        <DrawerItem
          key={EStyleSheet.value('$feeback')}
          text={EStyleSheet.value('$feeback')}
          iconComponent={<FeatherIcon name="x-octagon" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => this.handleFeedbackPress()}
        />
        <DrawerItem
          key={EStyleSheet.value('$contacts')}
          text={EStyleSheet.value('$contacts')}
          iconComponent={<FeatherIcon name="phone" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => this.handleContactsPress()}
        />
        <DrawerItem
          key={EStyleSheet.value('$about')}
          text={EStyleSheet.value('$about')}
          iconComponent={<FeatherIcon name="info" size={22} color={EStyleSheet.value('$primaryDark')} />}
          onPress={() => this.handleAboutPress()}
        />
      </View>
    );
  }

  renderChannelItems = (props) => {
    const channels = props.channels.map((channel) => {
      return (
        <DrawerItem
          key={channel.channel_title}
          text={channel.channel_title}
          iconComponent={getIconForChannel(channel.channel, 22)}
          onPress={() => this.onChannelPressHandler(channel.channel_id)}
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

  renderSearch = () => {
    return (
      <DrawerItem
        key={EStyleSheet.value('$search')}
        text={EStyleSheet.value('$search')}
        iconComponent={<FeatherIcon name="search" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => this.handleSearchPress()}
      />
    );
  };

  renderProgram = () => {
    return (
      <DrawerItem
        key={'program'}
        text={EStyleSheet.value('$tvProgram')}
        iconComponent={<FeatherIcon name="tv" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => this.onProgramPressHandler()}
      />
    );
  };

  renderHistory = () => {
    return (
      <DrawerItem
        key={'history'}
        text={EStyleSheet.value('$history')}
        iconComponent={<FeatherIcon name="clock" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => this.onHistoryPressHandler()}
      />
    );
  };

  renderBookmarks = () => {
    return (
      <DrawerItem
        key={'bookmarks'}
        text={EStyleSheet.value('$bookmarks')}
        iconComponent={<FeatherIcon name="bookmark" size={22} color={EStyleSheet.value('$primaryDark')} />}
        onPress={() => this.onBookmarksPressHandler()}
      />
    );
  };

  renderPages = () => {
    const pages = this.props.pages;

    if (pages && pages.length > 0) {
      const content = this.props.pages.map((page) => (
        <DrawerItem
          key={page.key}
          text={page.title}
          iconComponent={<FeatherIcon name="globe" size={22} color={EStyleSheet.value('$primaryLight')} />}
          onPress={() => this.handlePagePress(page)}
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

  render() {
    const content = this.props.routes.map((route, i) => {
      return (
        <DrawerItem key={route.key} text={route.title} onPress={() => this.handleCategorySelection(i)} />
      );
    });

    return (
      <View style={Styles.container}>
        <ScrollView style={Styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={Styles.content}>
            <View style={Styles.headerContainer}>
              {this.renderSearch()}
              {this.renderBookmarks()}
              {this.renderHistory()}
              {this.renderProgram()}
            </View>
            <View style={Styles.line} />
            {this.renderChannelItems(this.props)}

            <View style={Styles.line} />
            <ScalableText style={Styles.title}>{EStyleSheet.value('$drawerMenu')}</ScalableText>
            {content}
            {this.renderPages()}
            {this.renderFooterItems()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    routes: state.navigation.routes,
    pages: state.navigation.pages,
    channels: state.articles.tvprog.items,
  };
};

export default connect(mapStateToProps)(Drawer);
