import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsToggleButton, Text} from '../../components';
import {SunIcon, MoonIcon, PhotoIcon} from '../../components/svg';
import {setConfig} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {selectSettings} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {checkEqual} from '../../util/LodashEqualityCheck';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRALARGE = 4;

const IMAGE_QUALITY_NORMAL = -0.1;
const IMAGE_QUALITY_HIGH = -0.5;
const IMAGE_QUALITY_EXTRA_HIGH = -1;

const SettingsScreenView: React.FC = () => {
  const {strings} = useTheme();
  const dispatch = useDispatch();

  const config = useSelector(selectSettings, checkEqual);

  const handleSetDarkMode = (value: boolean) => {
    dispatch(setConfig({...config, isDarkMode: value}));
  };

  const handleSetTextSize = (value: number) => {
    dispatch(setConfig({...config, textSizeMultiplier: value}));
  };

  const handleSetImageMaxScaleFactor = (value: number) => {
    dispatch(setConfig({...config, imageMaxScaleFactor: value}));
  };

  const {isDarkMode, textSizeMultiplier, imageMaxScaleFactor} = config;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
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

export default SettingsScreenView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toggleButton: {
    width: 56,
    height: 40,
  },
  content: {
    flex: 1,
  },
  controls: {
    margin: 16,
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    width: '100%',
    fontSize: 17,
    marginTop: 12,
    paddingVertical: 8,
  },
  space: {
    width: 6,
    height: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
  },
  textNormal: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 22,
  },
  textExtraLarge: {
    fontSize: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});
