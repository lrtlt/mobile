import {StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';

interface UserActionItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const UserActionItem: React.FC<UserActionItemProps> = ({icon, label, onPress, isDestructive}) => {
  const {colors} = useTheme();
  return (
    <TouchableDebounce
      style={[
        styles.actionItem,
        {borderColor: colors.border, opacity: onPress ? 1 : 0.4},
        isDestructive && {borderColor: colors.textError, borderWidth: 1},
      ]}
      onPress={onPress}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.actionLabel, {color: isDestructive ? colors.textError : colors.text}]}>
        {label}
      </Text>
    </TouchableDebounce>
  );
};

export default UserActionItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
