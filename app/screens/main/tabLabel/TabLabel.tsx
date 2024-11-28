import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import {IconHome} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {Route} from 'react-native-tab-view';

export type TabLabelProps = {route: Route; focused: boolean};

const TabLabel: React.FC<TabLabelProps> = ({route, focused}) => {
  const {colors, strings} = useTheme();

  const color = focused ? colors.primary : colors.textSecondary;

  const content = useMemo(() => {
    if (route.title === strings.mainWindow) {
      return (
        <View style={styles.homeContainer}>
          <IconHome size={18} color={color} />
        </View>
      );
    } else {
      return <Text style={{...styles.label, color: color}}>{route.title}</Text>;
    }
  }, [color, route.title, strings.mainWindow]);

  return <View style={styles.labelContainer}>{content}</View>;
};

export default TabLabel;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    width: '100%',
    textTransform: 'uppercase',
  },
  homeContainer: {
    paddingStart: 6,
    paddingEnd: 6,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
