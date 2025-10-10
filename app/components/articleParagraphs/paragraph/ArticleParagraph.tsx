import React from 'react';
import HTMLRenderer from '../../htmlRenderer/HTMLRenderer';

interface Props {
  htmlText?: string;
  textSize?: number;
  lineHeight?: number;
}

const ArticleParagraph: React.FC<React.PropsWithChildren<Props>> = ({
  htmlText = '',
  textSize,
  lineHeight,
}) => {
  return <HTMLRenderer html={htmlText} textSize={textSize} lineHeight={lineHeight} />;
};

export default ArticleParagraph;
