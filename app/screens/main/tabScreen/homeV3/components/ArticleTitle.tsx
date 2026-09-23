import React from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import {Text} from '../../../../../components';
import {IconPlay} from '../../../../../components/svg';
import {HomeV3Article} from '../../../../../api/Types';
import {isVideoArticle} from '../util';
import {PlayColors} from './MediaCta';
import useHomeColors from './useHomeColors';

interface Props {
  article: HomeV3Article;
  serif?: boolean;
  fontSize: number;
  lineHeight: number;
  numberOfLines?: number;
  /**
   * Play mark in front of the title. 'auto' marks video articles in blue as the web does,
   * colors force the mark (media shelves color it by their accent).
   */
  playPrefix?: 'auto' | 'none' | PlayColors;
  style?: TextStyle;
}

/** Article title, optionally with the web's play square in front. */
const ArticleTitle: React.FC<Props> = ({
  article,
  serif,
  fontSize,
  lineHeight,
  numberOfLines,
  playPrefix = 'auto',
  style,
}) => {
  const colors = useHomeColors();
  const prefixSize = Math.round(lineHeight * 0.8);

  let prefix: PlayColors | undefined;
  if (playPrefix === 'auto') {
    prefix = isVideoArticle(article) ? {background: colors.videoPrefix, foreground: '#FFFFFF'} : undefined;
  } else if (playPrefix !== 'none') {
    prefix = playPrefix;
  }

  return (
    <Text
      style={{...styles.title, fontSize, lineHeight, color: colors.text, ...style}}
      fontFamily={serif ? 'PlayfairDisplay-Regular' : 'SourceSansPro-Regular'}
      numberOfLines={numberOfLines}>
      {prefix ? (
        <>
          <View
            style={{
              ...styles.videoPrefix,
              width: prefixSize,
              height: prefixSize,
              backgroundColor: prefix.background,
            }}>
            <IconPlay size={prefixSize * 0.45} color={prefix.foreground} />
          </View>
          {'  '}
        </>
      ) : null}
      {article.title}
    </Text>
  );
};

export default ArticleTitle;

const styles = StyleSheet.create({
  title: {
    flexShrink: 1,
  },
  videoPrefix: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 2,
  },
});
