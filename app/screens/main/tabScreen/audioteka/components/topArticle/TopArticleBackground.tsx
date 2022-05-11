import * as React from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {Article} from '../../../../../../../Types';
import {BASE_IMG_URL} from '../../../../../../util/ImageUtil';

interface TopArticleBackgroundProps {
  style: ViewStyle;
  article: Article;
}

const TopArticleBackground: React.FC<TopArticleBackgroundProps> = (props) => {
  const {article, style, children} = props;

  return (
    <View style={{...styles.container, ...style}}>
      <Image
        style={styles.image}
        source={{
          uri: BASE_IMG_URL + article.channel_bg_img,
        }}
        blurRadius={3}
        resizeMode="cover"
      />
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={['#000000', '#00000033']}
        useAngle={true}
        angle={0}
      />
      {children}
    </View>
  );
};

export default TopArticleBackground;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    left: -100,
    right: -100,
  },
});
