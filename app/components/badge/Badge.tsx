import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Article} from '../../../Types';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  type: Article['badge_class'];
  label: string;
  size?: 'small' | 'big';
}

const Badge: React.FC<React.PropsWithChildren<Props>> = ({style, type, label, size = 'big'}) => {
  return (
    <View style={[styles.container, style]}>
      <TextComponent
        importantForAccessibility="no"
        numberOfLines={2}
        fontFamily={size === 'big' ? 'SourceSansPro-Regular' : 'SourceSansPro-SemiBold'}
        style={{
          ...styles.badgeBase,
          ...(styles[type ?? 'default'] ?? styles.default),
          fontSize: size === 'big' ? 12 : 10,
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
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
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
