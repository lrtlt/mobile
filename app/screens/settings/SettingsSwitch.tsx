import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '../../components';
import {PropsWithChildren} from 'react';
import {useTheme} from '../../Theme';
import {Switch} from 'react-native-gesture-handler';

interface Props {
  title: string;
  onValueChange: (value: boolean) => void;
  value: boolean;

  cellStyle?: ViewStyle;
}

const SettingsSwitch: React.FC<PropsWithChildren<Props>> = ({title, onValueChange, value, cellStyle}) => {
  const {dark, colors} = useTheme();
  return (
    <View style={[styles.cell, {borderColor: colors.listSeparator}, cellStyle]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.center}>
        <Switch
          thumbColor={dark ? colors.text : colors.greyBackground}
          trackColor={{
            true: dark ? colors.textDisbled : colors.primary,
          }}
          onValueChange={onValueChange}
          value={value}
        />
      </View>
    </View>
  );
};

export default SettingsSwitch;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
