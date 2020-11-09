import React from 'react';
import {View, Dimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {StatusBar} from '../../components';
import Styles from './styles';
import TabBar from './tabBar/TabBar';
import {connect} from 'react-redux';
import {setSelectedCategory} from '../../redux/actions';
import HomeScreen from './tabScreen/home/HomeScreen';
import CategoryScreen from './tabScreen/category/CategoryScreen';
import NewestScreen from './tabScreen/newest/NewestScreen';
import PopularScreen from './tabScreen/popular/PopularScreen';
import TestScreen from '../testScreen/TestScreen';
import Gemius from 'react-native-gemius-plugin';

import {
  ARTICLE_LIST_TYPE_HOME,
  ARTICLE_LIST_TYPE_CATEGORY,
  ARTICLE_LIST_TYPE_MEDIA,
  ARTICLE_LIST_TYPE_NEWEST,
  GEMIUS_VIEW_SCRIPT_ID,
  ARTICLE_LIST_TYPE_POPULAR,
} from '../../constants';
import {SafeAreaView} from 'react-navigation';

class MainScreen extends React.Component {
  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'main'});
  }

  handleIndexChange = (index) => this.props.dispatch(setSelectedCategory(index));

  renderTabBar = (props) => <TabBar {...props} />;

  renderScene = (props) => {
    //Render only 1 screen on each side
    const routeIndex = this.props.routes.indexOf(props.route);
    if (Math.abs(this.props.index - routeIndex) > 1) {
      return <View />;
    }

    const current = routeIndex === this.props.index;

    const {type} = props.route;
    switch (type) {
      case ARTICLE_LIST_TYPE_HOME:
        return <HomeScreen type={ARTICLE_LIST_TYPE_HOME} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_MEDIA:
        return <HomeScreen type={ARTICLE_LIST_TYPE_MEDIA} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_CATEGORY:
        return <CategoryScreen route={props.route} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_NEWEST:
        return <NewestScreen isCurrent={current} />;
      case ARTICLE_LIST_TYPE_POPULAR:
        return <PopularScreen isCurrent={current} />;
      default:
        return <TestScreen text={'Unkown type: ' + type} />;
    }
  };

  render() {
    return (
      <SafeAreaView style={Styles.container} forceInset={{bottom: 'never'}}>
        <View style={Styles.container}>
          <StatusBar />
          <TabView
            navigationState={this.props}
            swipeEnabled={true}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
            // removeClippedSubviews={true}
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

const mapStateToProps = (state) => {
  return {
    index: state.navigation.selectedCategory,
    routes: state.navigation.routes,
  };
};

export default connect(mapStateToProps)(MainScreen);
