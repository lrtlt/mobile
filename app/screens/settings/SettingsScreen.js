import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {ScalableText, SettingsToggleButton, BackIcon} from '../../components';
import {SunIcon, MoonIcon, PhotoIcon} from '../../components/svg';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import {setConfig} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {initTheme} from '../../ColorTheme';
import {BorderlessButton} from 'react-native-gesture-handler';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {isEqual} from 'lodash';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectConfig} from '../../redux/selectors';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRALARGE = 4;

const IMAGE_QUALITY_NORMAL = -0.1;
const IMAGE_QUALITY_HIGH = -0.5;
const IMAGE_QUALITY_EXTRA_HIGH = -1;

const SettingsScreen = (props) => {
  const {navigation} = props;
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
      headerTitle: EStyleSheet.value('$settings'),
      headerLeft: () => (
        <BorderlessButton onPress={goBack} rippleColor={EStyleSheet.value('$rippleColor')}>
          <View style={Styles.backButtonContainer}>
            <BackIcon
              size={EStyleSheet.value('$navBarIconSize') + 4}
              color={EStyleSheet.value('$headerTintColor')}
            />
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
    <View style={Styles.root}>
      <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
        <View style={Styles.content}>
          <View style={Styles.controls}>
            <ScalableText style={Styles.title}>{EStyleSheet.value('$nightModeTitle')}</ScalableText>
            <View style={Styles.buttonContainer}>
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={!isDarkMode}
                onPress={() => handleSetDarkMode(false)}>
                <SunIcon size={20} selected={!isDarkMode} />
              </SettingsToggleButton>
              <View style={Styles.space} />
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={isDarkMode}
                onPress={() => handleSetDarkMode(true)}>
                <MoonIcon size={20} selected={isDarkMode} />
              </SettingsToggleButton>
            </View>

            <View style={Styles.line} />

            <ScalableText style={Styles.title}>{EStyleSheet.value('$textSizeTitle')}</ScalableText>
            <View style={Styles.buttonContainer}>
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_NORMAL}
                onPress={() => handleSetTextSize(TEXT_SIZE_NORMAL)}>
                <Text style={Styles.textNormal} allowFontScaling={false}>
                  aA
                </Text>
              </SettingsToggleButton>
              <View style={Styles.space} />
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_LARGE}
                onPress={() => handleSetTextSize(TEXT_SIZE_LARGE)}>
                <Text style={Styles.textLarge} allowFontScaling={false}>
                  aA
                </Text>
              </SettingsToggleButton>
              <View style={Styles.space} />
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={textSizeMultiplier === TEXT_SIZE_EXTRALARGE}
                onPress={() => handleSetTextSize(TEXT_SIZE_EXTRALARGE)}>
                <Text style={Styles.textExtraLarge} allowFontScaling={false}>
                  aA
                </Text>
              </SettingsToggleButton>
            </View>

            <View style={Styles.line} />

            <ScalableText style={Styles.title}>{EStyleSheet.value('$imageQuality')}</ScalableText>
            <View style={Styles.buttonContainer}>
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_NORMAL}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_NORMAL)}>
                <PhotoIcon size={22} />
              </SettingsToggleButton>
              <View style={Styles.space} />
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_HIGH}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_HIGH)}>
                <PhotoIcon size={30} />
              </SettingsToggleButton>
              <View style={Styles.space} />
              <SettingsToggleButton
                style={Styles.toggleButton}
                selected={imageMaxScaleFactor === IMAGE_QUALITY_EXTRA_HIGH}
                onPress={() => handleSetImageMaxScaleFactor(IMAGE_QUALITY_EXTRA_HIGH)}>
                <PhotoIcon size={36} />
              </SettingsToggleButton>
            </View>
            <View style={Styles.line} />
          </View>
        </View>
      </AndroidBackHandler>
    </View>
  );
};

export default SettingsScreen;
