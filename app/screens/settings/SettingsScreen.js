import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsToggleButton, Text} from '../../components';
import {SunIcon, MoonIcon, PhotoIcon} from '../../components/svg';
import {setConfig} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {selectSettings} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRALARGE = 4;

const IMAGE_QUALITY_NORMAL = -0.1;
const IMAGE_QUALITY_HIGH = -0.5;
const IMAGE_QUALITY_EXTRA_HIGH = -1;

const SettingsScreen = (props) => {
  const {navigation} = props;

  const {strings} = useTheme();
  const dispatch = useDispatch();

  const config = useSelector(selectSettings);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.settings,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleSetDarkMode = (value) => {
    dispatch(setConfig({...config, isDarkMode: value}));
  };

  const handleSetTextSize = (value) => {
    dispatch(setConfig({...config, textSizeMultiplier: value}));
  };

  const handleSetImageMaxScaleFactor = (value) => {
    dispatch(setConfig({...config, imageMaxScaleFactor: value}));
  };

  const {isDarkMode, textSizeMultiplier, imageMaxScaleFactor} = config;

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right']}>
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
              <Text style={styles.textLarge} allowFontScaling={false} scalingEnabled={false} type="secondary">
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
    </SafeAreaView>
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
