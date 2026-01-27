import React from 'react';
import TextComponent from '../../../text/Text';
import {StyleSheet} from 'react-native';

const Title: React.FC<{title?: string}> = React.memo(({title}) => {
  if (!title) {
    return null;
  }

  return (
    <TextComponent
      style={styles.titleText}
      allowFontScaling={false}
      fontFamily="SourceSansPro-SemiBold"
      numberOfLines={2}>
      {title}
    </TextComponent>
  );
});

export default Title;

const styles = StyleSheet.create({
  titleText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 8,
    textShadowColor: '#000000AA',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontSize: 16,
    color: 'white',
  },
});
