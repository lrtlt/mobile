import React from 'react';
import {View, Dimensions} from 'react-native';
import {withNavigation} from 'react-navigation';
import {TabView} from 'react-native-tab-view';
import Styles from './styles';
import TabBar from '../main/tabBar/TabBar';
import CategoryScreen from '../main/tabScreen/category/CategoryScreen';
import TestScreen from '../testScreen/TestScreen';
import Gemius from 'react-native-gemius-plugin';

import {ARTICLE_LIST_TYPE_CATEGORY, GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {SafeAreaView} from 'react-navigation';

class CustomPageScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', null),
    };
  };

  constructor(props) {
    super(props);

    const emptyPage = {
      key: '-',
      title: '-',
      type: 'page',
      routes: [],
    };

    const page = props.navigation.getParam('page', emptyPage);

    this.state = {
      index: 0,
      routes: page.routes,
      title: page.title,
    };
  }

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'page',
      page: this.state.title,
    });

    this.props.navigation.setParams({title: this.state.title});
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      index: index,
    });
  };

  renderTabBar = (props) => <TabBar {...props} />;

  renderScene = (props) => {
    //Render only 1 screen on each side
    const routeIndex = this.state.routes.indexOf(props.route);
    if (Math.abs(this.state.index - routeIndex) > 1) {
      return <View />;
    }

    const {type} = props.route;

    switch (type) {
      case ARTICLE_LIST_TYPE_CATEGORY:
        return <CategoryScreen route={props.route} />;
      default:
        return <TestScreen text={'Unkown type: ' + type} />;
    }
  };

  render() {
    return (
      <SafeAreaView style={Styles.container} forceInset={{bottom: 'never'}}>
        <View style={Styles.container}>
          <TabView
            navigationState={this.state}
            swipeEnabled={true}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
            onIndexChange={this.handleIndexChange}
            lazy={true}
            lazyPreloadDistance={0}
            initialLayout={{height: 0, width: Dimensions.get('window').width}}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default withNavigation(CustomPageScreen);
