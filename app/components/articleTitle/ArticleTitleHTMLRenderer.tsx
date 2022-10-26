import React, {useMemo} from 'react';
import HTML, {defaultSystemFonts, MixedStyleDeclaration} from 'react-native-render-html';
import {TextStyle, useWindowDimensions} from 'react-native';

import useTextStyle from '../text/useTextStyle';

interface Props {
  html: string;
  textStyle?: TextStyle;
}

const useTagStyles = (): Record<string, MixedStyleDeclaration> => {
  return useMemo(
    () => ({
      p: {
        fontFamily: 'Playfair Display',
        marginVertical: 0,
      },
      //   strong: {
      //     fontFamily: 'PlayfairDisplay-Regular',
      //     fontWeight: 'bold',
      //   },
      //   i: {
      //     fontFamily: 'Playfair Display',
      //     fontStyle: 'italic',
      //   },
      //   em: {
      //     fontFamily: 'PlayfairDisplay-Regular',
      //     fontStyle: 'italic',
      //   },
      //   b: {
      //     fontFamily: 'PlayfairDisplay-Regular',
      //     fontWeight: 'bold',
      //   },
    }),
    [],
  );
};

const fonts: string[] = [...defaultSystemFonts, 'PlayfairDisplay-Regular'];

const ArticleTitleHTMLRenderer: React.FC<Props> = ({html, textStyle: textStyleProp}) => {
  const contentWidth = useWindowDimensions().width - 12;

  const textStyle = useTextStyle({
    type: 'primary',
    scalingEnabled: true,
    fontFamily: 'PlayfairDisplay-Regular',
    style: textStyleProp,
  });

  return (
    <HTML
      source={{
        html: '<p>Hello <b>this is </b> a <em>test</em></p>',
      }}
      contentWidth={contentWidth}
      baseStyle={textStyle as MixedStyleDeclaration}
      defaultTextProps={{
        allowFontScaling: true,
      }}
      tagsStyles={useTagStyles()}
      systemFonts={fonts}
    />
  );
};

export default React.memo(
  ArticleTitleHTMLRenderer,
  (prevProps, nextProps) => prevProps.html === nextProps.html,
);
