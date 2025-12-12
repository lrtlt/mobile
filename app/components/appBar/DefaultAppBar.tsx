import {Image, Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';

import {HeaderOptions} from '@react-navigation/elements';
import {themeDark, themeLight} from '../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '../text/Text';
import {useNavigation} from '@react-navigation/native';
import {useSettingsStore} from '../../state/settings_store';
import useAppBarHeight from './useAppBarHeight';
import ActionButton from '../actionButton/ActionButton';

interface Props {
  onBackPress?: () => void;
  headerLeft?: HeaderOptions['headerLeft'];
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: HeaderOptions['headerRight'];
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerTitle?: HeaderOptions['headerTitle'];
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTintColor?: HeaderOptions['headerTintColor'];
  headerStyle?: StyleProp<ViewStyle>;
}

const DefaultAppBar: React.FC<Props> = ({
  onBackPress,
  headerLeft: HeaderLeft,
  headerLeftContainerStyle,
  headerRight: HeaderRight,
  headerRightContainerStyle,
  headerTitle: HeaderTitle,
  headerTitleStyle,
  headerTintColor,
  headerStyle,
}) => {
  const navigation = useNavigation();

  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const theme = isDarkMode ? themeDark : themeLight;
  const {colors, dim} = theme;

  const insets = useSafeAreaInsets();
  const {fullHeight, actionBarHeigh} = useAppBarHeight();

  return (
    <View
      style={{
        height: fullHeight,
        backgroundColor: colors.headerBackground,
        width: '100%',
        justifyContent: 'flex-end',

        // //Shadow for iOS
        // zIndex: 1,
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: StyleSheet.hairlineWidth,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 0.1,

        // //Shadow for Android
        // elevation: 2,
        ...headerStyle,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: actionBarHeigh,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        }}>
        <View
          accessible={false}
          style={{
            ...styles.leftContainer,
            height: actionBarHeigh,
            paddingLeft: insets.left,
            ...headerLeftContainerStyle,
          }}>
          {!!HeaderLeft ? (
            <HeaderLeft canGoBack={navigation.canGoBack()} tintColor={headerTintColor ?? colors.headerTint} />
          ) : (
            <ActionButton
              style={{
                height: actionBarHeigh,
              }}
              accessibilityLabel="atgal"
              onPress={onBackPress ?? navigation.goBack}>
              <Image
                source={require('../../../node_modules/@react-navigation/elements/src/assets/back-icon.png')}
                resizeMode="contain"
                fadeDuration={0}
                tintColor={colors.headerTint}
                style={{
                  width: Platform.OS === 'ios' ? dim.appBarIconSize - 4 : dim.appBarIconSize,
                  height: Platform.OS === 'ios' ? dim.appBarIconSize - 4 : dim.appBarIconSize,
                }}
              />
            </ActionButton>
          )}
        </View>
        <View accessible={false} style={{...styles.titleContainer, height: actionBarHeigh}}>
          {!!HeaderTitle ? (
            typeof HeaderTitle === 'string' ? (
              <Text
                style={{
                  ...styles.titleText,
                  color: headerTintColor ?? colors.headerTint,
                  ...headerTitleStyle,
                }}>
                {HeaderTitle}
              </Text>
            ) : (
              <HeaderTitle children="" />
            )
          ) : null}
        </View>
        <View
          accessible={false}
          style={{
            ...styles.rightContainer,
            height: actionBarHeigh,
            paddingRight: insets.right,
            ...headerRightContainerStyle,
          }}>
          {!!HeaderRight ? (
            <HeaderRight
              canGoBack={navigation.canGoBack()}
              tintColor={headerTintColor ?? colors.headerTint}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default DefaultAppBar;

const styles = StyleSheet.create({
  leftContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    textAlign: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
