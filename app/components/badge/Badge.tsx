import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Article} from '../../../Types';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  type: Article['badge_class'];
  label: string;
}

const Badge: React.FC<Props> = ({style, type, label}) => {
  return (
    <View style={[styles.container, style]}>
      <TextComponent
        numberOfLines={2}
        style={{
          ...styles.badgeBase,
          ...(styles[type ?? 'default'] ?? styles.default),
        }}>
        {label}
      </TextComponent>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  badgeBase: {
    fontSize: 13,
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  ['badge-danger']: {
    color: '#fff',
    backgroundColor: '#ee000e',
  },
  ['badge-primary']: {
    color: '#fff',
    backgroundColor: '#2f357d',
  },
  ['badge-info']: {
    color: '#fff',
    backgroundColor: '#2f357d',
  },
  ['badge-secondary']: {
    color: '#212529',
    backgroundColor: '#97a2b6',
  },
  ['badge-warning']: {
    color: '#212529',
    backgroundColor: '#ffc107',
  },
  default: {
    color: '#fff',
    backgroundColor: '#2f357d',
  },
});
