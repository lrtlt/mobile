import React, {useCallback} from 'react';
import {NavigationState, Route, SceneRendererProps, TabBar} from 'react-native-tab-view';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';
import TabLabel, {TabLabelProps} from '../tabLabel/TabLabel';

type TabBarComponentProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

const TabBarComponent: React.FC<TabBarComponentProps> = (props) => {
  const {colors} = useTheme();

  const renderLabel = useCallback((labelProps: TabLabelProps) => <TabLabel {...labelProps} />, []);

  return (
    <TabBar
      {...props}
      scrollEnabled={true}
      pressOpacity={0.6}
      pressColor={colors.androidTouchFeedback}
      renderLabel={renderLabel}
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
