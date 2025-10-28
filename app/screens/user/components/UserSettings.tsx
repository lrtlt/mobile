import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';
import {Switch} from 'react-native-gesture-handler';
import {Text} from '../../../components';
import {useSettingsStore} from '../../../state/settings_store';
import {useShallow} from 'zustand/shallow';

const UserSettings: React.FC = () => {
  const settings = useSettingsStore(
    useShallow((state) => ({
      isDarkMode: state.isDarkMode,
      textSizeMultiplier: state.textSizeMultiplier,
      isContinuousPlayEnabled: state.isContinuousPlayEnabled,
    })),
  );

  const toggleDarkMode = (value: boolean) => {
    useSettingsStore.getState().setIsDarkMode(value);
  };

  const toggleLargeText = (value: boolean) => {
    useSettingsStore.getState().setTextSizeMultiplier(value ? 3 : 0);
  };

  return (
    <View style={styles.container}>
      <MySwitch title="Nakties rėžimas" value={settings.isDarkMode} onValueChange={toggleDarkMode} />
      <MySwitch
        title="Didelis šriftas"
        value={settings.textSizeMultiplier > 1}
        onValueChange={toggleLargeText}
      />
    </View>
  );
};

const MySwitch: React.FC<{title: string; value: boolean; onValueChange: (value: boolean) => void}> = ({
  title,
  value,
  onValueChange,
}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.switchContainer}>
      <Switch
        thumbColor={value ? colors.text : colors.greyBackground}
        trackColor={{
          true: value ? colors.textDisbled : colors.primary,
        }}
        onValueChange={onValueChange}
        value={value}
      />
      <Text>{title}</Text>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 73,
    gap: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
