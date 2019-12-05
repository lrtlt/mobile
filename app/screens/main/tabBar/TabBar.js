import React from 'react';
import { TabBar } from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import TabLable from '../tabLable/TabLable';

const tabBar = React.memo(props => (
  <TabBar
    {...props}
    scrollEnabled={true}
    pressColor={EStyleSheet.value('androidTouchFeedback')}
    renderLabel={labelProps => <TabLable {...labelProps} />}
    indicatorStyle={Styles.indicator}
    style={Styles.tabbar}
    tabStyle={Styles.tab}
  />
));

export default React.memo(tabBar);
