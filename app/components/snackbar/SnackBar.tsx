import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ColorValue} from 'react-native';
import Text from '../text/Text';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';

type Props = {
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  onDismiss?: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  actionTextStyle?: TextStyle;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  actionTextColor?: ColorValue;
};
const Snackbar: React.FC<Props> = ({
  message,
  actionText,
  onActionPress,
  onDismiss,
  duration = 3000, // Default duration in milliseconds
  position = 'bottom', // Default position
  containerStyle,
  messageStyle,
  actionTextStyle,
  backgroundColor = 'black',
  textColor = 'white',
  actionTextColor,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        onDismiss && onDismiss();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  return isVisible ? (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? {top: 16} : {bottom: 16},
        containerStyle,
        {backgroundColor: backgroundColor},
      ]}
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}>
      <Text style={[styles.messageText, messageStyle, {color: textColor}]}>{message}</Text>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.actionText, actionTextStyle, {color: actionTextColor}]}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  messageText: {
    fontSize: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default Snackbar;
