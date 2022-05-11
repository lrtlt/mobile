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
      <SvgUri height={24} uri={props.logoUri ?? null} />
    </View>
  );
};

export default TopArticleChannelBadge;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
