import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SvgUri} from 'react-native-svg';

interface TopArticleChannelBadgeProps {
  style?: ViewStyle;
  logoUri?: string;
}

const TopArticleChannelBadge: React.FC<TopArticleChannelBadgeProps> = (props) => {
  return (
    <View style={{...styles.container, ...props.style}}>
      <SvgUri width={32} height={32} uri={props.logoUri ?? null} />
    </View>
  );
};

export default TopArticleChannelBadge;

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
