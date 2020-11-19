import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {SettingsToggleButton, BackIcon, Text} from '../../components';
import {SunIcon, MoonIcon, PhotoIcon} from '../../components/svg';
import {setConfig} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {initTheme} from '../../ColorTheme';
import {BorderlessButton} from 'react-native-gesture-handler';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {isEqual} from 'lodash';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectConfig} from '../../redux/selectors';
import {useTheme} from '../../Theme';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRALARGE = 4;

const IMAGE_QUALITY_NORMAL = -0.1;
const IMAGE_QUALITY_HIGH = -0.5;
const IMAGE_QUALITY_EXTRA_HIGH = -1;

const SettingsScreen = (props) => {
  const {navigation} = props;

  const {colors, strings, dim} = useTheme();
  const dispatch = useDispatch();

  const savedConfig = useSelector(selectConfig);

  const [initialConfig] = useState(savedConfig);
  const [config, setConfigState] = useState(savedConfig);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'settings'});
  }, []);

  //TODO remove probably after new theme implementation?
  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.settings,
      headerLeft: () => (
        <BorderlessButton onPress={goBack} rippleColor={colors.ripple}>
          <View style={styles.backButtonContainer}>
            <BackIcon size={dim.appBarIconSize} color={colors.headerTint} />
          </View>
        </BorderlessButton>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const goBack = () => {
    console.log('goBack() - called');

    console.log(initialConfig, config);

    const hasChanges = !isEqual(initialConfig, config);
    if (hasChanges) {
      dispatch(setConfig(config));
      resetNavigationToHome();
    } else {
      navigation.goBack();
    }
  };

  const onBackButtonPressAndroid = () => {
    goBack();
    return true;
  };

  const handleSetDarkMode = (value) => {
    const newConfig = {...config, isDarkMode: value};
    initTheme(newConfig);
    setConfigState(newConfig);
  };

  const handleSetTextSize = (value) => {
    const newConfig = {...config, textSizeMultiplier: value};
    initTheme(newConfig);
    setConfigState(newConfig);
  };

  const handleSetImageMaxScaleFactor = (value) => {
    const newConfig = {...config, imageMaxScaleFactor: value};
    initTheme(newConfig);
    setConfigState(newConfig);
  };

  //TODO update this with better theme switching
  const resetNavigationToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );

    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({routeName: 'home'})],
    // });
    // this.props.navigation.dispatch(resetAction);

    //TODO remove
    //navigation.goBack();
  };

  const {isDarkMode, textSizeMultiplier, imageMaxScaleFactor} = config;

  return (
    <View style={styles.root}>
      <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
        <View style={styles.content}>
          <View style={styles.controls}>
            <Text style={styles.title} type="secondary">
              {strings.nightModeTitle}
            </Text>
            <View style={styles.buttonContainer}>
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={!isDarkMode}
                onPress={() => handleSetDarkMode(false)}>
                <SunIcon size={20} selected={!isDarkMode} />
              </SettingsToggleButton>
              <View style={styles.space} />
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={isDarkMode}
                onPress={() => handleSetDarkMode(true)}>
                <MoonIcon size={20} selected={isDarkMode} />
              </SettingsToggleButton>
            </View>

            <Text style={styles.title} type="secondary">
              {strings.textSizeTitle}
            </Text>
            <View style={styles.buttonContainer}>
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_NORMAL}
                onPress={() => handleSetTextSize(TEXT_SIZE_NORMAL)}>
                <Text
                  style={styles.textNormal}
                  allowFontScaling={false}
                  scalingEnabled={false}
                  type="secondary">
                  aA
                </Text>
              </SettingsToggleButton>
              <View style={styles.space} />
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_LARGE}
                onPress={() => handleSetTextSize(TEXT_SIZE_LARGE)}>
                <Text
                  style={styles.textLarge}
                  allowFontScaling={false}
                  scalingEnabled={false}
                  type="secondary">
                  aA
                </Text>
              </SettingsToggleButton>
              <View style={styles.space} />
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_EXTRALARGE}
                onPress={() => handleSetTextSize(TEXT_SIZE_EXTRALARGE)}>
                <Text
                  style={styles.textExtraLarge}
                  allowFontScaling={false}
                  scalingEnabled={false}
                  type="secondary">
                  aA
                </Text>
              </SettingsToggleButton>
            </View>

            <Text style={styles.title} type="secondary">
              {strings.imageQuality}
            </Text>
            <View style={styles.buttonContainer}>
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_NORMAL}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_NORMAL)}>
                <PhotoIcon size={22} />
              </SettingsToggleButton>
              <View style={styles.space} />
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_HIGH}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_HIGH)}>
                <PhotoIcon size={30} />
              </SettingsToggleButton>
              <View style={styles.space} />
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_EXTRA_HIGH}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_EXTRA_HIGH)}>
                <PhotoIcon size={36} />
              </SettingsToggleButton>
            </View>
          </View>
        </View>
      </AndroidBackHandler>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backButtonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    height: '100%',
  },
  toggleButton: {
    width: 64,
    height: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  controls: {
    width: '100%',
  },
  controlsLand: {
    width: '100%',
    marginStart: 100,
  },
  title: {
    width: '100%',
    padding: 2,
    fontFamily: 'SourceSansPro-Regular',
    letterSpacing: 1,
    fontSize: 18,
    height: 40,
    marginTop: 12,
  },
  space: {
    width: 8,
    height: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
  },
  textNormal: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
  textLarge: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 22,
  },
  textExtraLarge: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 30,
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});
