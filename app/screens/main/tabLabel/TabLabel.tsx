import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import {IconHome} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {Route} from 'react-native-tab-view';

export type TabLabelProps = {route: Route; focused: boolean};

const ICONSIZE = 20;

const TabLabel: React.FC<TabLabelProps> = ({route, focused}) => {
  const {colors, strings, dim} = useTheme();

  const color = focused ? colors.primary : colors.textSecondary;

  const content = useMemo(() => {
    if (route.title === strings.mainWindow) {
      return (
        <View style={[styles.homeContainer, {paddingHorizontal: 8 + (dim.appBarIconSize - ICONSIZE) / 2}]}>
          <IconHome size={ICONSIZE} color={color} />
        </View>
      );
    } else {
      return (
        <Text style={{...styles.label, color: color}} numberOfLines={1}>
          {route.title}
        </Text>
      );
    }
  }, [color, route.title, strings.mainWindow]);

  return <View style={styles.labelContainer}>{content}</View>;
};

export default TabLabel;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    paddingHorizontal: 2,
    textTransform: 'uppercase',
  },
  homeContainer: {
    flex: 1,
    paddingHorizontal: 8 + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
