import {ViewStyle} from 'react-native';
import React from 'react';
import useTextStyle from '../text/useTextStyle';
import ArticleTitleHTMLRenderer from './ArticleTitleHTMLRenderer';

interface Props {
  style?: ViewStyle;
}

const ArticleTitle: React.FC<Props> = ({style, children}) => {
  const textStyle = useTextStyle({
    type: 'primary',
    scalingEnabled: true,
    fontFamily: 'PlayfairDisplay-Regular',
    style: style,
  });

  if (typeof children === 'string') {
    return <ArticleTitleHTMLRenderer textStyle={textStyle} html={children} />;
    // return (
    //   <TextComponent style={textStyle} fontFamily="PlayfairDisplay-Regular">
    //     {children}
    //   </TextComponent>
    // );
  } else {
    console.log('Error: ArticleTitle should always be a `string`.');
    return <>{children}</>;
  }
};

export default ArticleTitle;
