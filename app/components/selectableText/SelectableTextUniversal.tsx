import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Animated, Easing, TextProps, View} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props extends TextProps {
  onSelected?: (selectted: boolean) => void;
}

const SelectableTextUniversal: React.FC<Props> = (props) => {
  const [selected, setSelected] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const {onSelected} = props;

  useEffect(() => {
    Animated.timing(animatedValue, {
      useNativeDriver: false,
      toValue: selected ? 0.96 : 1,
      duration: 300,
      easing: Easing.elastic(2),
    }).start();

    if (onSelected) {
      onSelected(selected);
    }
  }, [animatedValue, onSelected, selected]);

  const {colors} = useTheme();

  const handleLongPress = useCallback(() => {
    setSelected(!selected);
  }, [selected]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: selected ? colors.primaryLight : undefined,
      }}>
      <Animated.View
        style={{
          transform: [
            {
              scale: animatedValue,
            },
          ],
        }}>
        <TextComponent
          {...props}
          onLongPress={handleLongPress}
          selectable={false}
          suppressHighlighting={true}>
          {props.children}
        </TextComponent>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
});
export default SelectableTextUniversal;
