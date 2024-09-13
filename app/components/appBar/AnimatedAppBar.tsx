import {Animated, StyleSheet, View} from 'react-native';

import {HeaderBackButton} from '@react-navigation/elements';
import useAppBarHeight from './useAppBarHeight';
import {useTheme} from '../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  translateY: Animated.AnimatedInterpolation<string | number>;
  onBackPress: () => void;
  actions?: React.ReactNode;
}

const AnimatedAppBar: React.FC<Props> = ({translateY, onBackPress, actions}) => {
  const {fullHeight, actionBarHeigh} = useAppBarHeight();
  const {colors} = useTheme();

  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignContent: 'space-around',
        // backgroundColor: 'rgba(52, 52, 52, 0)',
        backgroundColor: 'red',
        width: '100%',
        //for animation
        height: fullHeight,
        transform: [{translateY: translateY}],
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,

        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
        shadowOpacity: 0.25,
        shadowRadius: 0.1,
        elevation: 1,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.statusBar,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View
          style={{
            height: actionBarHeigh,
            justifyContent: 'center',
          }}>
          <HeaderBackButton labelVisible={false} tintColor={colors.headerTint} onPress={onBackPress} />
        </View>
        <View
          style={{
            height: actionBarHeigh,
            justifyContent: 'center',
          }}>
          {actions}
        </View>
      </View>
    </Animated.View>
  );
};

export default AnimatedAppBar;
