import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsToggleButton, Text} from '../../components';
import {SunIcon, MoonIcon} from '../../components/svg';
import {useTheme} from '../../Theme';
import SettingsNotifications from './SettingsNotifications';
import {ScrollView} from 'react-native-gesture-handler';
import SettingsSwitch from './SettingsSwitch';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSettingsStore} from '../../state/settings_store';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRA_LARGE = 4;

const SettingsScreenView: React.FC<React.PropsWithChildren<{}>> = () => {
  const {strings, colors} = useTheme();

  const settingsStore = useSettingsStore((state) => state);

  const handleSetDarkMode = (value: boolean) => {
    settingsStore.setIsDarkMode(value);
  };

  const handleSetContinuousPlayer = (value: boolean) => {
    settingsStore.setIsContinuousPlayEnabled(value);
  };

  const handleSetTextSize = (value: number) => {
    settingsStore.setTextSizeMultiplier(value);
  };

  const {isDarkMode, textSizeMultiplier} = settingsStore;

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label} type="secondary" fontFamily="SourceSansPro-SemiBold">
            {'Bendri nustatymai'}
          </Text>
          <View style={{...styles.card, backgroundColor: colors.background}}>
            <View
              style={{
                ...styles.cell,
                borderColor: 'transparent',
              }}>
              <Text style={styles.title}>{strings.nightModeTitle}</Text>
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={!isDarkMode}
                accessibilityLabel="dienos režimas"
                onPress={() => handleSetDarkMode(false)}>
                <SunIcon size={20} selected={!isDarkMode} importantForAccessibility="no" />
              </SettingsToggleButton>
              <SettingsToggleButton
                style={styles.toggleButton}
                selected={isDarkMode}
                accessibilityLabel="nakties režimas"
                onPress={() => handleSetDarkMode(true)}>
                <MoonIcon size={20} selected={isDarkMode} />
              </SettingsToggleButton>
            </View>
            <View style={{...styles.cell, borderColor: colors.listSeparator}}>
              <Text style={styles.title}>{strings.textSizeTitle}</Text>
              <SettingsToggleButton
                style={styles.toggleButton}
                accessibilityLabel="mažas šriftas"
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
              <SettingsToggleButton
                style={styles.toggleButton}
                accessibilityLabel="vidutinis šriftas"
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
              <SettingsToggleButton
                style={styles.toggleButton}
                accessibilityLabel="didelis šriftas"
                selected={textSizeMultiplier === TEXT_SIZE_EXTRA_LARGE}
                onPress={() => handleSetTextSize(TEXT_SIZE_EXTRA_LARGE)}>
                <Text
                  style={styles.textExtraLarge}
                  allowFontScaling={false}
                  scalingEnabled={false}
                  type="secondary">
                  aA
                </Text>
              </SettingsToggleButton>
            </View>
          </View>
          <Text style={styles.label} type="secondary" fontFamily="SourceSansPro-SemiBold">
            {'Grotuvas'}
          </Text>
          <View style={{...styles.card, backgroundColor: colors.background}}>
            <SettingsSwitch
              key={'continuous-player'}
              title="Nepertraukiamas grotuvas"
              onValueChange={handleSetContinuousPlayer}
              value={settingsStore.isContinuousPlayEnabled}
              cellStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}
            />
          </View>
          <Text style={styles.label} type="secondary" fontFamily="SourceSansPro-SemiBold">
            {'Pranešimai'}
          </Text>
          <View style={{...styles.card, backgroundColor: colors.background}}>
            <SettingsNotifications />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreenView;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toggleButton: {
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    margin: 12,
    overflow: 'hidden',
  },
  cell: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    padding: 12,
    paddingTop: 24,
    textTransform: 'uppercase',
  },
  space: {
    width: 6,
    height: 6,
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
});
