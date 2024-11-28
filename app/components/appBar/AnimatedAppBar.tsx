import {Animated, StyleSheet, View} from 'react-native';

import {HeaderBackButton} from '@react-navigation/elements';
import useAppBarHeight from './useAppBarHeight';
import {useTheme} from '../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  translateY: Animated.AnimatedInterpolation<string | number>;
  onBackPress: () => void;
  actions?: React.ReactNode;
  subHeader?: React.ReactNode;
}

const AnimatedAppBar: React.FC<Props> = ({translateY, onBackPress, actions, subHeader}) => {
  const {fullHeight, actionBarHeigh, subHeaderHeight} = useAppBarHeight();
  const {colors} = useTheme();

  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={{
        height: subHeader ? fullHeight + subHeaderHeight : fullHeight,
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        transform: subHeader
          ? undefined
          : [
              {
                translateY: translateY,
              },
            ],
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
        shadowOpacity: 0.25,
        shadowRadius: 0.1,
        elevation: 2,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignContent: 'space-around',
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
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: StyleSheet.hairlineWidth,
            },
            shadowOpacity: 0.25,
            shadowRadius: 0.1,
            elevation: 2,
          }}>
          <View
            style={{
              height: actionBarHeigh,
              justifyContent: 'center',
            }}>
            <HeaderBackButton tintColor={colors.headerTint} onPress={onBackPress} displayMode="minimal" />
          </View>
          <View
            style={{
              height: actionBarHeigh,
              paddingEnd: 4,
              justifyContent: 'center',
            }}>
            {actions}
          </View>
        </View>
      </View>
      {subHeader ? (
        <Animated.View
          style={{
            height: subHeaderHeight,
            transform: [
              {
                translateY: translateY,
              },
            ],
            zIndex: -1,
          }}>
          {subHeader}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

export default AnimatedAppBar;
