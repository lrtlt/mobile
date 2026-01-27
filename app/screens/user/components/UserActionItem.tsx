import {StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';

interface UserActionItemProps {
  icon: React.ReactNode;
  label: string;
  caption?: string;
  numberOfItems?: number;
  onPress?: () => void;
  isDestructive?: boolean;
}

const UserActionItem: React.FC<UserActionItemProps> = ({
  icon,
  label,
  caption,
  numberOfItems,
  onPress,
  isDestructive,
}) => {
  const {colors} = useTheme();
  return (
    <TouchableDebounce
      style={[
        styles.actionItem,
        {borderColor: colors.border, opacity: onPress ? 1 : 0.5},
        isDestructive && {borderColor: colors.textError, borderWidth: 1},
      ]}
      onPress={onPress}>
      <View style={styles.labelContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.actionLabel, {color: isDestructive ? colors.textError : colors.text}]}>
          {label}
        </Text>
        {numberOfItems ? (
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text
              style={{
                paddingVertical: 4,
                paddingHorizontal: 8,
                backgroundColor: colors.photoBackground,
                borderRadius: 4,
              }}>
              {numberOfItems > 99 ? '99+' : numberOfItems}
            </Text>
          </View>
        ) : null}
      </View>
      {caption && (
        <Text
          style={{
            paddingTop: 6,
            paddingLeft: 6,
          }}
          type="secondary">
          {caption}
        </Text>
      )}
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
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
