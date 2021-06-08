import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Route, Scene} from 'react-native-tab-view/lib/typescript/src/types';
import {Text} from '../../../components';
import {IconHome} from '../../../components/svg';
import {useTheme} from '../../../Theme';

export type TabLabelProps = Scene<Route> & {focused: boolean};

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
    fontFamily: 'SourceSansPro-Regular',
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