import React from 'react';
import {TabBar} from 'react-native-tab-view';
import TabLable from '../tabLable/TabLable';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';

const TabBarComponent = (props) => {
  const {colors} = useTheme();
  return (
    <TabBar
      {...props}
      scrollEnabled={true}
      pressColor={colors.androidTouchFeedback}
      renderLabel={(labelProps) => <TabLable {...labelProps} />}
      indicatorStyle={{backgroundColor: colors.primaryDark}}
      style={{backgroundColor: colors.background}}
      tabStyle={styles.tab}
    />
  );
};

export default TabBarComponent;

const styles = StyleSheet.create({
  tab: {
    width: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
  },
});
